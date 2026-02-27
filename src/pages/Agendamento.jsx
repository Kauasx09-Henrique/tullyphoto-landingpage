import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DayPicker } from 'react-day-picker';
import { ptBR } from 'date-fns/locale';
import { format, isSameDay } from 'date-fns';
import { Store } from 'react-notifications-component';
import {
  FaCreditCard, FaBarcode, FaQrcode, FaTimes, FaCloudUploadAlt,
  FaCheckCircle, FaClock, FaCalendarAlt, FaCameraRetro, FaMinus, FaPlus,
  FaArrowRight, FaTree, FaLightbulb, FaLock, FaCopy, FaTags, FaUniversity
} from 'react-icons/fa';
import api from '../services/api';
import 'react-day-picker/dist/style.css';
import '../styles/agendamento.css';

const PIX_KEY = "bf591bd9-c630-4b77-b4b2-5c7e685121cb";
const MERCHANT_NAME = "Vetra Studio";
const MERCHANT_CITY = "BRASILIA";

const crc16ccitt = (payload) => {
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    let x = (crc >> 8) ^ payload.charCodeAt(i);
    x ^= x >> 4;
    crc = ((crc << 8) ^ (x << 12) ^ (x << 5) ^ x) & 0xFFFF;
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
};

const generatePixPayload = (key, name, city, amount, txId) => {
  const amountStr = amount.toFixed(2);
  const normalize = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const nameClean = normalize(name).substring(0, 25);
  const cityClean = normalize(city).substring(0, 15);
  const formatField = (id, value) => {
    const len = value.length.toString().padStart(2, '0');
    return `${id}${len}${value}`;
  };
  let payload = formatField('00', '01') + formatField('26', formatField('00', 'BR.GOV.BCB.PIX') + formatField('01', key)) +
    formatField('52', '0000') + formatField('53', '986') + formatField('54', amountStr) + formatField('58', 'BR') +
    formatField('59', nameClean) + formatField('60', cityClean) + formatField('62', formatField('05', txId));
  payload += '6304';
  payload += crc16ccitt(payload);
  return payload;
};

const Agendamento = () => {
  const [espacos, setEspacos] = useState([]);
  const [selectedEspaco, setSelectedEspaco] = useState(null);
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [duracao, setDuracao] = useState(2);
  const [horariosOcupados, setHorariosOcupados] = useState([]);
  const [metodoPagamento, setMetodoPagamento] = useState('PIX');
  const [comprovante, setComprovante] = useState(null);
  const [showPixModal, setShowPixModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [txIdUnico, setTxIdUnico] = useState('***');

  const navigate = useNavigate();
  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  useEffect(() => {
    api.get('/espacos')
      .then(res => {
        setEspacos(res.data.map(e => ({
          ...e,
          icon: e.nome.toLowerCase().includes('jardim') ? <FaTree /> : e.nome.toLowerCase().includes('industrial') ? <FaLightbulb /> : <FaCameraRetro />
        })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const checkFeriadoOuFDS = (data) => {
    if (!data) return false;
    const diaSemana = data.getDay();
    if (diaSemana === 0 || diaSemana === 6) return true;
    const df = `${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
    const feriados = ['01-01', '04-21', '05-01', '09-07', '10-12', '11-02', '11-15', '12-25'];
    return feriados.includes(df);
  };

  const isFimDeSemana = checkFeriadoOuFDS(date);

  // Lógica de Preços (Tabela Oficial)
  const precoBasePix = useMemo(() => {
    if (isFimDeSemana) {
      if (duracao === 1) return 200; //
      if (duracao === 2) return 320; //
      if (duracao === 3) return 460; //
      if (duracao === 4) return 600; //
      return 1000; // Diária FDS
    } else {
      if (duracao === 1) return 150; //
      if (duracao === 2) return 240; //
      if (duracao === 3) return 360; //
      if (duracao === 4) return 480; //
      return 800; // Diária Semana
    }
  }, [duracao, isFimDeSemana]);

  const precoCredito = precoBasePix * 1.15; // 15% Acréscimo
  const totalExibido = metodoPagamento === 'CREDITO' ? precoCredito : precoBasePix;
  const valorEconomia = precoCredito - precoBasePix;

  const pixCopiaCola = useMemo(() => {
    if (!totalExibido || totalExibido <= 0) return '';
    return generatePixPayload(PIX_KEY, MERCHANT_NAME, MERCHANT_CITY, totalExibido, txIdUnico);
  }, [totalExibido, txIdUnico]);

  useEffect(() => {
    if (selectedEspaco && date) {
      const dataFormatada = format(date, 'yyyy-MM-dd');
      api.get(`/agendamentos/disponibilidade?espaco_id=${selectedEspaco}&data=${dataFormatada}`)
        .then(res => {
          const ocupados = [];
          res.data.forEach(ag => {
            const inicio = new Date(ag.data_inicio).getHours();
            const fim = new Date(ag.data_fim).getHours();
            for (let h = inicio; h < fim; h++) ocupados.push(h);
          });
          setHorariosOcupados(ocupados);
        }).catch(() => { });
    }
  }, [selectedEspaco, date]);

  const isTimeBlocked = (time) => horariosOcupados.includes(parseInt(time.split(':')[0]));

  const handleDurationChange = (op) => {
    if (op === 'inc' && duracao < 12) setDuracao(duracao + 1);
    if (op === 'dec' && duracao > 1) setDuracao(duracao - 1);
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    if (!selectedEspaco || !date || !selectedTime || !metodoPagamento) {
      Store.addNotification({ title: "Atenção", message: "Preencha todos os campos.", type: "warning", container: "top-right", dismiss: { duration: 3000 } });
      return;
    }
    if (metodoPagamento === 'PIX') {
      setTxIdUnico(`VT${Date.now()}`.substring(0, 25));
      setShowPixModal(true);
    } else {
      enviarReserva();
    }
  };

  const enviarReserva = async () => {
    if (metodoPagamento === 'PIX' && !comprovante) { alert("Anexe o comprovante do Pix."); return; }
    const [hora, minuto] = selectedTime.split(':');
    const dataInicio = new Date(date);
    dataInicio.setHours(parseInt(hora), parseInt(minuto), 0);
    const dataFim = new Date(dataInicio.getTime() + duracao * 60 * 60 * 1000);

    const formData = new FormData();
    formData.append('espaco_id', selectedEspaco);
    formData.append('data_inicio', dataInicio.toISOString());
    formData.append('data_fim', dataFim.toISOString());
    formData.append('metodo_pagamento', metodoPagamento);
    if (comprovante) formData.append('comprovante', comprovante);

    try {
      await api.post('/agendamentos', formData);
      setShowPixModal(false);
      Store.addNotification({ title: "Sucesso!", message: "Sessão agendada!", type: "success", container: "top-right", dismiss: { duration: 5000 } });
      navigate('/meus-agendamentos');
    } catch (err) {
      Store.addNotification({ title: "Erro", message: "Falha ao reservar.", type: "danger", container: "top-right", dismiss: { duration: 4000 } });
    }
  };

  return (
    <div className="booking-page fade-in" translate="no">
      <div className="booking-header">
        <h1>Reservar Estúdio</h1>
        <div className="header-divider"></div>
        <p>Agendamento Exclusivo Vetra</p>
      </div>

      <div className="booking-layout">
        <div className="booking-form-col">
          <form onSubmit={handlePreSubmit}>

            {/* ETAPA 1: CENÁRIOS CENTRALIZADOS */}
            <section className="form-section central-section-v">
              <div className="section-header-v"><span className="step-tag-v">01</span><h3>Cenário</h3></div>
              {loading ? <div className="loading-v">Buscando ambientes...</div> : (
                <div className="espacos-centered-v">
                  {espacos.map((espaco) => (
                    <div key={espaco.id} className={`espaco-card-v ${String(selectedEspaco) === String(espaco.id) ? 'selected' : ''}`} onClick={() => { setSelectedEspaco(espaco.id); setSelectedTime(null); }}>
                      <div className="icon-v-circle">
                        {espaco.icon}
                      </div>
                      <span className="name-v">{espaco.nome}</span>
                      {String(selectedEspaco) === String(espaco.id) && <FaCheckCircle className="check-gold-v" />}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ETAPA 2: CALENDÁRIO REACT-DAY-PICKER */}
            <section className="form-section">
              <div className="section-header-v"><span className="step-tag-v">02</span><h3>Data e Horário</h3></div>
              {isFimDeSemana && <div className="weekend-alert-v"><span><FaTags /> Tarifário de Fim de Semana Ativo</span></div>}
              <div className="datetime-grid-v">
                <div className="calendar-container-v">
                  <DayPicker
                    mode="single"
                    selected={date}
                    onSelect={(d) => { if (d) setDate(d); setSelectedTime(null); }}
                    locale={ptBR}
                    disabled={{ before: new Date() }}
                    className="luxury-daypicker"
                  />
                </div>
                <div className="times-container-v">
                  <h4>Horários</h4>
                  <div className="time-grid-v">
                    {timeSlots.map(time => (
                      <button type="button" key={time} disabled={isTimeBlocked(time)} className={`time-btn-v ${selectedTime === time ? 'active' : ''} ${isTimeBlocked(time) ? 'blocked' : ''}`} onClick={() => setSelectedTime(time)}><span>{time}</span></button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ETAPA 3: DURAÇÃO */}
            <section className="form-section">
              <div className="section-header-v"><span className="step-tag-v">03</span><h3>Duração da Sessão</h3></div>
              <div className="duration-layout-v">
                <div className="stepper-luxury-v">
                  <button type="button" onClick={() => handleDurationChange('dec')} disabled={duracao <= 1}><FaMinus /></button>
                  <div className="dur-display-v"><span>{duracao}</span><small>horas</small></div>
                  <button type="button" onClick={() => handleDurationChange('inc')} disabled={duracao >= 12}><FaPlus /></button>
                </div>
                <span className="package-info-v">{duracao > 4 ? '✨ Diária Automática' : `Pacote de ${duracao}h`}</span>
              </div>
            </section>

            {/* ETAPA 4: PAGAMENTO COM DÉBITO */}
            <section className="form-section">
              <div className="section-header-v"><span className="step-tag-v">04</span><h3>Pagamento</h3></div>
              <div className="payment-grid-v">
                <div className={`pay-card-v ${metodoPagamento === 'PIX' ? 'active' : ''}`} onClick={() => setMetodoPagamento('PIX')}>
                  <FaQrcode />
                  <strong>PIX / Dinheiro</strong>
                  <div className="discount-tag-v">15% OFF</div>
                </div>
                <div className={`pay-card-v ${metodoPagamento === 'CREDITO' ? 'active' : ''}`} onClick={() => setMetodoPagamento('CREDITO')}>
                  <FaCreditCard />
                  <strong>Crédito</strong>
                  <small>+15% Taxa</small>
                </div>
                <div className={`pay-card-v ${metodoPagamento === 'DEBITO' ? 'active' : ''}`} onClick={() => setMetodoPagamento('DEBITO')}>
                  <FaBarcode />
                  <strong>Débito</strong>
                  <small>Pagar no Local</small>
                </div>
              </div>
            </section>
          </form>
        </div>

        <div className="booking-summary-col">
          <div className="ticket-summary-v">
            <h3 className="ticket-title-v">Resumo da Reserva</h3>
            <div className="ticket-body-v">
              <div className="ticket-row-v"><span>Cenário</span><strong>{espacos.find(e => String(e.id) === String(selectedEspaco))?.nome || '-'}</strong></div>
              <div className="ticket-row-v"><span>Data</span><strong>{format(date, "dd/MM/yyyy")}</strong></div>
              <div className="ticket-row-v"><span>Horário</span><strong>{selectedTime || '--:--'}</strong></div>
              <div className="ticket-row-v"><span>Duração</span><strong>{duracao}h</strong></div>
            </div>
            <div className="ticket-divider-v"></div>
            <div className="price-v-container">
              <span className="p-label-v">Total Estimado:</span>
              <span className="p-value-v">R$ {totalExibido.toFixed(2).replace('.', ',')}</span>
              {metodoPagamento === 'PIX' && <small className="p-savings-v">Você economiza R$ {valorEconomia.toFixed(2).replace('.', ',')}</small>}
            </div>
            <button type="button" onClick={handlePreSubmit} className="btn-confirm-v">Confirmar Reserva <FaArrowRight /></button>
            <div className="secure-footer-v"><FaLock /> Ambiente Seguro</div>
          </div>
        </div>
      </div>

      {showPixModal && (
        <div className="modal-overlay-v">
          <div className="pix-modal-v">
            <button className="close-v" onClick={() => setShowPixModal(false)}><FaTimes /></button>
            <div className="pix-header-v"><h3>Finalizar com PIX</h3><p>Escaneie o código ou use o link de pagamento</p></div>
            <div className="pix-content-v">
              <div className="qr-v-box">{pixCopiaCola && <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixCopiaCola)}`} alt="QR" />}</div>
              <div className="pix-copy-v"><code>{pixCopiaCola.substring(0, 25)}...</code><button onClick={() => navigator.clipboard.writeText(pixCopiaCola)}><FaCopy /></button></div>
              <label className={`pix-upload-v ${comprovante ? 'has-file' : ''}`}>
                <FaCloudUploadAlt /> <span>{comprovante ? comprovante.name : 'Anexar Comprovante'}</span>
                <input type="file" onChange={(e) => setComprovante(e.target.files[0])} hidden accept="image/*" />
              </label>
            </div>
            <button className="btn-send-pix-v" onClick={enviarReserva}><FaCheckCircle /> Enviar Comprovante</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agendamento;