import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import { Store } from 'react-notifications-component';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  FaCreditCard, FaBarcode, FaQrcode, FaTimes, FaCloudUploadAlt,
  FaCcVisa, FaCcMastercard, FaCcAmex, FaMoneyBillWave, FaCheckCircle,
  FaClock, FaCalendarAlt, FaCameraRetro, FaMinus, FaPlus, FaCopy
} from 'react-icons/fa';
import api from '../services/api';
import 'react-calendar/dist/Calendar.css';
import '../styles/agendamento.css';

const PIX_KEY = "kaua@vetra.com";
const MERCHANT_NAME = "ESTUDIO VETRA";
const MERCHANT_CITY = "SAO PAULO";

const generateCRC16 = (payload) => {
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc = ((crc >> 8) | (crc << 8)) & 0xFFFF;
    crc ^= (payload.charCodeAt(i) & 0x00FF);
    crc ^= ((crc & 0x00FF) >> 4);
    crc ^= ((crc << 8) << 4);
    crc ^= ((crc & 0xFF00) >> 7);
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
};

const generatePixPayload = (key, name, city, amount, txId = '***') => {
  const formatField = (id, value) => {
    const len = value.length.toString().padStart(2, '0');
    return `${id}${len}${value}`;
  };

  const amountStr = amount.toFixed(2);

  let payload =
    formatField('00', '01') +
    formatField('26', `0014BR.GOV.BCB.PIX01${key.length}${key}`) +
    formatField('52', '0000') +
    formatField('53', '986') +
    formatField('54', amountStr) +
    formatField('58', 'BR') +
    formatField('59', name) +
    formatField('60', city) +
    formatField('62', formatField('05', txId));

  payload += '6304';
  payload += generateCRC16(payload);

  return payload;
};

const Agendamento = () => {
  const [espacos, setEspacos] = useState([]);
  const [selectedEspaco, setSelectedEspaco] = useState('');
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [duracao, setDuracao] = useState(1);
  const [total, setTotal] = useState(0);
  const [horariosOcupados, setHorariosOcupados] = useState([]);
  const [metodoPagamento, setMetodoPagamento] = useState('');
  const [comprovante, setComprovante] = useState(null);
  const [showPixModal, setShowPixModal] = useState(false);
  const [pixCopiaCola, setPixCopiaCola] = useState('');
  const navigate = useNavigate();

  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  useEffect(() => {
    api.get('/espacos').then((res) => setEspacos(res.data)).catch(() => {
      setEspacos([
        { id: 1, nome: 'Estúdio Infinito', preco_por_hora: 150 },
        { id: 2, nome: 'Sala Industrial', preco_por_hora: 200 },
        { id: 3, nome: 'Jardim Externo', preco_por_hora: 120 }
      ]);
    });
  }, []);

  useEffect(() => {
    if (selectedEspaco && espacos.length > 0) {
      const espacoInfo = espacos.find(e => e.id === parseInt(selectedEspaco));
      if (espacoInfo) setTotal(espacoInfo.preco_por_hora * duracao);
    }
  }, [selectedEspaco, duracao, espacos]);

  useEffect(() => {
    if (total > 0) {
      const payload = generatePixPayload(PIX_KEY, MERCHANT_NAME, MERCHANT_CITY, total);
      setPixCopiaCola(payload);
    }
  }, [total]);

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
        })
        .catch(() => { });
    }
  }, [selectedEspaco, date]);

  const isTimeBlocked = (timeString) => {
    const hora = parseInt(timeString.split(':')[0]);
    return horariosOcupados.includes(hora);
  };

  const handleDurationChange = (operation) => {
    if (operation === 'inc' && duracao < 8) setDuracao(duracao + 1);
    if (operation === 'dec' && duracao > 1) setDuracao(duracao - 1);
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    if (!selectedEspaco || !date || !selectedTime || !metodoPagamento) {
      Store.addNotification({
        title: "Campos incompletos", message: "Por favor, preencha todos os detalhes da reserva.", type: "warning", container: "top-right", dismiss: { duration: 3000 }
      });
      return;
    }
    if (metodoPagamento === 'PIX') setShowPixModal(true);
    else enviarReserva();
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCopiaCola);
    Store.addNotification({
      title: "Copiado!", message: "Código Pix copiado para a área de transferência.", type: "default", container: "top-right", dismiss: { duration: 2000 }
    });
  };

  const enviarReserva = async () => {
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
      Store.addNotification({ title: "Sucesso!", message: "Agendamento realizado.", type: "success", container: "top-right", dismiss: { duration: 5000 } });
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.msg || "Erro ao processar reserva.";
      Store.addNotification({ title: "Erro", message: msg, type: "danger", container: "top-right", dismiss: { duration: 4000 } });
    }
  };

  const getEspacoNome = () => {
    const e = espacos.find(item => item.id === selectedEspaco);
    return e ? e.nome : 'Selecione...';
  };

  return (
    <div className="booking-page fade-in">
      <div className="booking-header">
        <h1>Agendamento de Estúdio</h1>
        <p>Configure sua sessão fotográfica com exclusividade.</p>
      </div>

      <div className="booking-layout">
        <div className="booking-form-col">
          <form onSubmit={handlePreSubmit}>
            <section className="form-section">
              <div className="section-title">
                <span className="step-number">1</span>
                <h3>Escolha o Cenário</h3>
              </div>
              <div className="espacos-grid">
                {espacos.map((espaco) => (
                  <div
                    key={espaco.id}
                    className={`espaco-card ${selectedEspaco === espaco.id ? 'selected' : ''}`}
                    onClick={() => { setSelectedEspaco(espaco.id); setSelectedTime(null); }}
                  >
                    <div className="espaco-icon"><FaCameraRetro /></div>
                    <div className="espaco-info">
                      <span className="name">{espaco.nome}</span>
                      <span className="price">R$ {espaco.preco_por_hora}/h</span>
                    </div>
                    {selectedEspaco === espaco.id && <div className="check-badge"><FaCheckCircle /></div>}
                  </div>
                ))}
              </div>
            </section>

            <section className="form-section">
              <div className="section-title">
                <span className="step-number">2</span>
                <h3>Data e Horário</h3>
              </div>
              <div className="datetime-container">
                <div className="calendar-box">
                  <Calendar
                    onChange={(d) => { setDate(d); setSelectedTime(null); }}
                    value={date}
                    minDate={new Date()}
                    locale="pt-BR"
                    prev2Label={null}
                    next2Label={null}
                  />
                </div>
                <div className="time-box">
                  <h4>Horários Disponíveis</h4>
                  <div className="time-grid">
                    {timeSlots.map(time => {
                      const blocked = isTimeBlocked(time);
                      return (
                        <button
                          type="button"
                          key={time}
                          disabled={blocked}
                          className={`time-btn ${selectedTime === time ? 'active' : ''} ${blocked ? 'blocked' : ''}`}
                          onClick={() => !blocked && setSelectedTime(time)}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                  <div className="legend">
                    <span><i className="dot free"></i> Livre</span>
                    <span><i className="dot busy"></i> Ocupado</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="form-section">
              <div className="section-title">
                <span className="step-number">3</span>
                <h3>Tempo de Sessão</h3>
              </div>
              <div className="duration-wrapper">
                <div className="stepper">
                  <button type="button" onClick={() => handleDurationChange('dec')} disabled={duracao <= 1}><FaMinus /></button>
                  <span className="value">{duracao}h</span>
                  <button type="button" onClick={() => handleDurationChange('inc')} disabled={duracao >= 8}><FaPlus /></button>
                </div>
                <p className="duration-hint">Recomendamos pelo menos 2h para ensaios completos.</p>
              </div>
            </section>

            <section className="form-section">
              <div className="section-title">
                <span className="step-number">4</span>
                <h3>Método de Pagamento</h3>
              </div>
              <div className="payment-grid">
                <div className={`payment-option ${metodoPagamento === 'CREDITO' ? 'active' : ''}`} onClick={() => setMetodoPagamento('CREDITO')}>
                  <FaCreditCard className="icon" />
                  <span>Crédito</span>
                </div>
                <div className={`payment-option ${metodoPagamento === 'DEBITO' ? 'active' : ''}`} onClick={() => setMetodoPagamento('DEBITO')}>
                  <FaBarcode className="icon" />
                  <span>Débito</span>
                </div>
                <div className={`payment-option ${metodoPagamento === 'PIX' ? 'active' : ''}`} onClick={() => setMetodoPagamento('PIX')}>
                  <FaQrcode className="icon" />
                  <span>PIX</span>
                </div>
              </div>

              {(metodoPagamento === 'CREDITO' || metodoPagamento === 'DEBITO') && (
                <div className="payment-info-box">
                  <div className="card-logos">
                    <FaCcVisa /><FaCcMastercard /><FaCcAmex />
                  </div>
                  <p><FaCheckCircle className="green" /> O pagamento será realizado presencialmente na recepção do estúdio.</p>
                </div>
              )}
            </section>
          </form>
        </div>

        <div className="booking-summary-col">
          <div className="summary-card">
            <h3>Resumo da Reserva</h3>
            <div className="summary-row">
              <span><FaCameraRetro /> Cenário</span>
              <strong>{getEspacoNome()}</strong>
            </div>
            <div className="summary-row">
              <span><FaCalendarAlt /> Data</span>
              <strong>{format(date, "dd 'de' MMMM", { locale: ptBR })}</strong>
            </div>
            <div className="summary-row">
              <span><FaClock /> Horário</span>
              <strong>{selectedTime || '--:--'}</strong>
            </div>
            <div className="summary-row">
              <span><FaClock /> Duração</span>
              <strong>{duracao} horas</strong>
            </div>

            <div className="summary-divider"></div>

            <div className="total-row">
              <span>Total Estimado</span>
              <span className="price">R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>

            <button type="button" onClick={handlePreSubmit} className="confirm-btn">
              {metodoPagamento === 'PIX' ? 'Pagar com PIX' : 'Confirmar Agendamento'}
            </button>
          </div>
        </div>
      </div>

      {showPixModal && (
        <div className="modal-overlay fade-in">
          <div className="modal-content pix-modal">
            <button className="close-btn" onClick={() => setShowPixModal(false)}><FaTimes /></button>
            <h3>Pagamento via PIX</h3>
            <p className="pix-inst">Valor total: <strong className="gold-text">R$ {total.toFixed(2).replace('.', ',')}</strong></p>

            <div className="qr-container">
              {/* Gera o QR Code visual baseado na string do payload gerada */}
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixCopiaCola)}`} alt="QR Code Pix" />
            </div>

            <div className="pix-copy-box">
              <span className="label">Pix Copia e Cola</span>
              <div className="copy-input-group">
                <input type="text" readOnly value={pixCopiaCola} />
                <button onClick={copyPixCode} title="Copiar código"><FaCopy /></button>
              </div>
            </div>

            <label className="upload-zone">
              <FaCloudUploadAlt size={24} />
              <span>{comprovante ? comprovante.name : 'Anexar Comprovante'}</span>
              <input type="file" accept="image/*,application/pdf" onChange={(e) => setComprovante(e.target.files[0])} hidden />
            </label>

            <button className="modal-action-btn" onClick={() => !comprovante ? alert("Anexe o comprovante!") : enviarReserva()}>
              <FaMoneyBillWave /> Enviar e Finalizar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agendamento;