import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import { Store } from 'react-notifications-component';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  FaCreditCard, FaBarcode, FaQrcode, FaTimes, FaCloudUploadAlt,
  FaCheckCircle, FaClock, FaCalendarAlt, FaCameraRetro, FaMinus, FaPlus, 
  FaCopy, FaArrowRight, FaTree, FaLightbulb, FaCube, 
  FaCcVisa, FaCcMastercard, FaCcAmex
} from 'react-icons/fa';
import api from '../services/api';
import 'react-calendar/dist/Calendar.css';
import '../styles/agendamento.css';

// --- PIX HELPERS ---
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
  const [selectedEspaco, setSelectedEspaco] = useState(null);
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  
  // Duração começa em 2
  const [duracao, setDuracao] = useState(2);
  
  const [horariosOcupados, setHorariosOcupados] = useState([]);
  const [metodoPagamento, setMetodoPagamento] = useState('');
  const [comprovante, setComprovante] = useState(null);
  const [showPixModal, setShowPixModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  // 1. CARREGAR ESPAÇOS
  useEffect(() => {
    api.get('/espacos')
        .then(res => {
            const dados = res.data.map(e => ({ ...e, icon: getIconForSpace(e.nome) }));
            setEspacos(dados);
            setLoading(false);
        })
        .catch(err => {
            console.error("Erro API:", err);
            setLoading(false);
        });
  }, []);

  const getIconForSpace = (nome) => {
      const n = nome ? nome.toLowerCase() : '';
      if (n.includes('jardim')) return <FaTree />;
      if (n.includes('industrial')) return <FaLightbulb />;
      return <FaCameraRetro />;
  };

  // --- LÓGICA DE CÁLCULO ---
  const espacoAtivo = espacos.find(e => String(e.id) === String(selectedEspaco));

  const getPrecoNumerico = (preco) => {
      if (!preco) return 0;
      const limpo = String(preco).replace('R$', '').replace(/\s/g, '').replace(',', '.');
      const numero = parseFloat(limpo);
      return isNaN(numero) ? 0 : numero;
  };

  const precoHora = espacoAtivo ? getPrecoNumerico(espacoAtivo.preco_por_hora) : 0;
  
  // Total Calculado na hora
  const totalCalculado = precoHora * duracao;

  const pixCopiaCola = useMemo(() => {
      if (totalCalculado <= 0) return '';
      return generatePixPayload(PIX_KEY, MERCHANT_NAME, MERCHANT_CITY, totalCalculado);
  }, [totalCalculado]);

  // --- DISPONIBILIDADE ---
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
        .catch(() => {});
    }
  }, [selectedEspaco, date]);

  const isTimeBlocked = (time) => {
    const hora = parseInt(time.split(':')[0]);
    return horariosOcupados.includes(hora);
  };

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
    if (metodoPagamento === 'PIX') setShowPixModal(true);
    else enviarReserva();
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
      Store.addNotification({ title: "Sucesso!", message: "Solicitação enviada.", type: "success", container: "top-right", dismiss: { duration: 5000 } });
      navigate('/');
    } catch (err) {
        console.error(err);
        Store.addNotification({ title: "Erro", message: "Erro ao reservar.", type: "danger", container: "top-right", dismiss: { duration: 4000 } });
    }
  };

  return (
    <div className="booking-page fade-in">
      <div className="booking-header">
        <h1>Reservar Estúdio</h1>
        <div className="header-divider"></div>
        <p>Experiência Vetra Exclusiva</p>
      </div>

      <div className="booking-layout">
        <div className="booking-form-col">
          <form onSubmit={handlePreSubmit}>
            
            {/* 1. CENÁRIO */}
            <section className="form-section">
              <div className="section-header">
                <span className="step-number">01</span>
                <h3>Escolha o Cenário</h3>
              </div>
              
              {loading ? <div className="loading-spinner">Carregando...</div> : (
                  <div className="espacos-grid">
                    {espacos.map((espaco) => (
                      <div
                        key={espaco.id}
                        className={`espaco-card ${String(selectedEspaco) === String(espaco.id) ? 'selected' : ''}`}
                        onClick={() => { 
                            setSelectedEspaco(espaco.id); 
                            setSelectedTime(null); 
                        }}
                      >
                        <div className="espaco-icon">{espaco.icon}</div>
                        <div className="espaco-info">
                          <span className="name">{espaco.nome}</span>
                          
                          {/* BLINDAGEM DE TRADUÇÃO AQUI */}
                          <span className="price notranslate" translate="no">
                             R$ {getPrecoNumerico(espaco.preco_por_hora).toFixed(2).replace('.', ',')}
                             <small>/h</small>
                          </span>

                        </div>
                        {String(selectedEspaco) === String(espaco.id) && <div className="check-badge"><FaCheckCircle /></div>}
                      </div>
                    ))}
                  </div>
              )}
            </section>

            {/* 2. DATA/HORA */}
            <section className="form-section">
              <div className="section-header"><span className="step-number">02</span><h3>Data e Horário</h3></div>
              <div className="datetime-container">
                <div className="calendar-wrapper">
                  <Calendar onChange={(d) => { setDate(d); setSelectedTime(null); }} value={date} minDate={new Date()} locale="pt-BR" className="vetra-calendar" />
                </div>
                <div className="time-wrapper">
                  <h4>Horários</h4>
                  <div className="time-grid">
                    {timeSlots.map(time => {
                      const blocked = isTimeBlocked(time);
                      return (
                        <button type="button" key={time} disabled={blocked}
                          className={`time-btn ${selectedTime === time ? 'active' : ''} ${blocked ? 'blocked' : ''}`}
                          onClick={() => !blocked && setSelectedTime(time)}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* 3. DURAÇÃO */}
            <section className="form-section">
              <div className="section-header"><span className="step-number">03</span><h3>Duração</h3></div>
              <div className="duration-control">
                <div className="stepper-box">
                  <button type="button" onClick={() => handleDurationChange('dec')} disabled={duracao <= 1}><FaMinus /></button>
                  
                  {/* BLINDAGEM DE TRADUÇÃO AQUI */}
                  <span className="value notranslate" translate="no">{duracao}h</span>
                  
                  <button type="button" onClick={() => handleDurationChange('inc')} disabled={duracao >= 12}><FaPlus /></button>
                </div>
                <p className="duration-hint">
                    {precoHora > 0 ? (
                        <span className="notranslate" translate="no">
                             R$ {precoHora}/h x {duracao}h
                        </span>
                    ) : 'Selecione um cenário'}
                </p>
              </div>
            </section>

            {/* 4. PAGAMENTO */}
            <section className="form-section">
              <div className="section-header"><span className="step-number">04</span><h3>Pagamento</h3></div>
              <div className="payment-grid">
                <div className={`payment-option ${metodoPagamento === 'PIX' ? 'active' : ''}`} onClick={() => setMetodoPagamento('PIX')}>
                  <FaQrcode className="pay-icon" /><div className="pay-text"><strong>PIX</strong></div>
                </div>
                <div className={`payment-option ${metodoPagamento === 'CREDITO' ? 'active' : ''}`} onClick={() => setMetodoPagamento('CREDITO')}>
                  <FaCreditCard className="pay-icon" /><div className="pay-text"><strong>Crédito</strong></div>
                </div>
                <div className={`payment-option ${metodoPagamento === 'DEBITO' ? 'active' : ''}`} onClick={() => setMetodoPagamento('DEBITO')}>
                  <FaBarcode className="pay-icon" /><div className="pay-text"><strong>Débito</strong></div>
                </div>
              </div>
            </section>
          </form>
        </div>

        {/* RESUMO */}
        <div className="booking-summary-col">
          <div className="summary-card">
            <h3 className="summary-title">Resumo</h3>
            <div className="summary-item">
              <span className="label"><FaCameraRetro /> Cenário</span>
              <span className="value highlight">{espacoAtivo ? espacoAtivo.nome : 'Selecione...'}</span>
            </div>
            <div className="summary-item">
              <span className="label"><FaCalendarAlt /> Data</span>
              <span className="value">{format(date, "dd 'de' MMMM", { locale: ptBR })}</span>
            </div>
            <div className="summary-item">
              <span className="label"><FaClock /> Horário</span>
              <span className="value">{selectedTime || '--:--'}</span>
            </div>
            <div className="summary-item">
              <span className="label"><FaClock /> Duração</span>
              
              {/* BLINDAGEM DE TRADUÇÃO AQUI */}
              <span className="value notranslate" translate="no">{duracao}h</span>

            </div>
            <div className="summary-divider"></div>
            
            <div className="total-box">
              <span>Total Estimado</span>
              
              {/* BLINDAGEM DE TRADUÇÃO NO TOTAL (MUITO IMPORTANTE) */}
              <span className="total-price notranslate" translate="no">
                R$ {totalCalculado.toFixed(2).replace('.', ',')}
              </span>

            </div>

            <button type="button" onClick={handlePreSubmit} className="btn-confirm-booking">
              {metodoPagamento === 'PIX' ? 'Gerar Pagamento' : 'Confirmar Reserva'} <FaArrowRight />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL PIX */}
      {showPixModal && (
        <div className="modal-overlay fade-in">
          <div className="modal-content pix-modal">
            <button className="close-btn" onClick={() => setShowPixModal(false)}><FaTimes /></button>
            <div className="pix-header">
                <FaQrcode className="pix-icon-lg" />
                <h3>Pagamento Pix</h3>
            </div>
            <div className="qr-container">
              <div className="qr-box">
                 <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixCopiaCola)}`} alt="QR Code" />
              </div>
              
              {/* BLINDAGEM NO VALOR DO PIX */}
              <div className="pix-value notranslate" translate="no">
                  R$ {totalCalculado.toFixed(2).replace('.', ',')}
              </div>

            </div>
            <div className="pix-copy-section">
               <input type="text" readOnly value={pixCopiaCola} />
               <button onClick={() => navigator.clipboard.writeText(pixCopiaCola)} className="copy-btn"><FaCopy /> Copiar</button>
            </div>
            <div className="upload-section">
                <label className="upload-zone">
                    <FaCloudUploadAlt size={28} />
                    <strong>{comprovante ? comprovante.name : 'Anexar Comprovante'}</strong>
                    <input type="file" onChange={(e) => setComprovante(e.target.files[0])} hidden />
                </label>
            </div>
            <button className="btn-finalize-pix" onClick={() => !comprovante ? alert("Anexe o comprovante!") : enviarReserva()}>
              <FaCheckCircle /> Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agendamento;