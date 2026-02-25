import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import { Store } from 'react-notifications-component';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  FaCreditCard, FaBarcode, FaQrcode, FaTimes, FaCloudUploadAlt,
  FaCheckCircle, FaClock, FaCalendarAlt, FaCameraRetro, FaMinus, FaPlus,
  FaArrowRight, FaTree, FaLightbulb, FaLock, FaCopy
} from 'react-icons/fa';
import api from '../services/api';
import 'react-calendar/dist/Calendar.css';
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

  let payload =
    formatField('00', '01') +
    formatField('26',
      formatField('00', 'BR.GOV.BCB.PIX') +
      formatField('01', key)
    ) +
    formatField('52', '0000') +
    formatField('53', '986') +
    formatField('54', amountStr) +
    formatField('58', 'BR') +
    formatField('59', nameClean) +
    formatField('60', cityClean) +
    formatField('62', formatField('05', txId));

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
  const [metodoPagamento, setMetodoPagamento] = useState('');
  const [comprovante, setComprovante] = useState(null);
  const [showPixModal, setShowPixModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [txIdUnico, setTxIdUnico] = useState('***');

  const navigate = useNavigate();
  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  useEffect(() => {
    api.get('/espacos')
      .then(res => {
        const dados = res.data.map(e => ({ ...e, icon: getIconForSpace(e.nome) }));
        setEspacos(dados);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  }, []);

  const getIconForSpace = (nome) => {
    const n = nome ? nome.toLowerCase() : '';
    if (n.includes('jardim')) return <FaTree />;
    if (n.includes('industrial')) return <FaLightbulb />;
    return <FaCameraRetro />;
  };

  const checkFeriadoOuFDS = (data) => {
    if (!data || !(data instanceof Date) || isNaN(data)) return false;
    const diaSemana = data.getDay();
    if (diaSemana === 0 || diaSemana === 6) return true;

    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dataFormatada = `${mes}-${dia}`;

    const feriadosFixos = ['01-01', '04-21', '05-01', '09-07', '10-12', '11-02', '11-15', '12-25'];
    return feriadosFixos.includes(dataFormatada);
  };

  const espacoAtivo = espacos.find(e => String(e.id) === String(selectedEspaco));

  const getPrecoNumerico = (preco) => {
    if (!preco) return 0;
    const limpo = String(preco).replace('R$', '').replace(/\s/g, '').replace(',', '.');
    const numero = parseFloat(limpo);
    return isNaN(numero) ? 0 : numero;
  };

  // Cálculo Base
  const isTaxaExtra = checkFeriadoOuFDS(date);
  const precoBase = espacoAtivo ? getPrecoNumerico(espacoAtivo.preco_por_hora) : 0;
  const precoHora = precoBase > 0 ? (isTaxaExtra ? precoBase + 50 : precoBase) : 0;
  const totalCalculado = precoHora * duracao;

  // Lógica da Taxa do Cartão de Crédito
  const totalFinal = metodoPagamento === 'CREDITO' ? totalCalculado * 1.10 : totalCalculado;

  const pixCopiaCola = useMemo(() => {
    if (!totalFinal || isNaN(totalFinal) || totalFinal <= 0) return '';
    return generatePixPayload(PIX_KEY, MERCHANT_NAME, MERCHANT_CITY, totalFinal, txIdUnico);
  }, [totalFinal, txIdUnico]);

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

    if (metodoPagamento === 'PIX') {
      const novoTxId = `VT${Date.now()}`.substring(0, 25);
      setTxIdUnico(novoTxId);
      setShowPixModal(true);
    } else {
      enviarReserva();
    }
  };

  const enviarReserva = async () => {
    if (metodoPagamento === 'PIX' && !comprovante) {
      alert("Por favor, anexe o comprovante do Pix.");
      return;
    }

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

      const msgSucesso = metodoPagamento === 'PIX' ? "Solicitação enviada! Aguarde a confirmação." : "Agendamento realizado! Pagamento será feito no local.";
      Store.addNotification({ title: "Sucesso!", message: msgSucesso, type: "success", container: "top-right", dismiss: { duration: 5000 } });
      navigate('/meus-agendamentos');
    } catch (err) {
      Store.addNotification({ title: "Erro", message: "Erro ao reservar. Tente novamente.", type: "danger", container: "top-right", dismiss: { duration: 4000 } });
    }
  };

  return (
    <div className="booking-page fade-in" translate="no">
      <div className="booking-header">
        <h1>Reservar Estúdio</h1>
        <div className="header-divider"></div>
        <p>Experiência Vetra Exclusiva</p>
      </div>

      <div className="booking-layout">
        <div className="booking-form-col">
          <form onSubmit={handlePreSubmit}>

            <section className="form-section">
              <div className="section-header">
                <span className="step-number">01</span>
                <h3>Escolha o Cenário</h3>
              </div>

              {loading ? (
                <div className="loading-spinner">
                  <FaClock className="spin" /> <span>Carregando...</span>
                </div>
              ) : (
                <div className="espacos-grid">
                  {espacos.map((espaco) => (
                    <div
                      key={espaco.id}
                      className={`espaco-card ${String(selectedEspaco) === String(espaco.id) ? 'selected' : ''}`}
                      onClick={() => { setSelectedEspaco(espaco.id); setSelectedTime(null); }}
                    >
                      <div className="espaco-icon-box">
                        <div className="espaco-icon" style={{ fontSize: '3rem', margin: '15px 0', color: String(selectedEspaco) === String(espaco.id) ? '#D4AF6E' : '#888' }}>
                          {espaco.icon}
                        </div>
                      </div>
                      <div className="espaco-info">
                        <span className="name">{espaco.nome}</span>
                        <span className="price notranslate" translate="no">
                          R$ {getPrecoNumerico(espaco.preco_por_hora).toFixed(2).replace('.', ',')} <small>/h (base)</small>
                        </span>
                      </div>
                      {String(selectedEspaco) === String(espaco.id) && <div className="check-badge"><FaCheckCircle /></div>}
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="form-section">
              <div className="section-header"><span className="step-number">02</span><h3>Data e Horário</h3></div>

              {isTaxaExtra && (
                <div style={{ background: '#fff3cd', color: '#856404', padding: '10px 15px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  <span>Aviso: Valores ajustados (+ R$50/h) para finais de semana e feriados.</span>
                </div>
              )}

              <div className="datetime-container">
                <div className="calendar-wrapper">
                  <Calendar onChange={(d) => { setDate(d); setSelectedTime(null); }} value={date} minDate={new Date()} locale="pt-BR" className="vetra-calendar" />
                </div>
                <div className="time-wrapper">
                  <h4>Horários Disponíveis</h4>
                  <div className="time-grid">
                    {timeSlots.map(time => {
                      const blocked = isTimeBlocked(time);
                      return (
                        <button type="button" key={time} disabled={blocked} className={`time-btn ${selectedTime === time ? 'active' : ''} ${blocked ? 'blocked' : ''}`} onClick={() => !blocked && setSelectedTime(time)}>
                          <span>{time}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            <section className="form-section">
              <div className="section-header"><span className="step-number">03</span><h3>Duração</h3></div>
              <div className="duration-control">
                <div className="stepper-box">
                  <button type="button" onClick={() => handleDurationChange('dec')} disabled={duracao <= 1}><FaMinus /></button>
                  <span className="value notranslate" translate="no">{duracao}h</span>
                  <button type="button" onClick={() => handleDurationChange('inc')} disabled={duracao >= 12}><FaPlus /></button>
                </div>
                <p className="duration-hint">
                  {precoHora > 0 ? (
                    <span className="notranslate" translate="no">R$ {precoHora}/h x {duracao}h</span>
                  ) : <span>Selecione um cenário</span>}
                </p>
              </div>
            </section>

            <section className="form-section">
              <div className="section-header"><span className="step-number">04</span><h3>Forma de Pagamento</h3></div>
              <p className="payment-intro"><span>Selecione o método de pagamento preferido.</span></p>

              <div className="payment-grid">
                <div className={`payment-option ${metodoPagamento === 'PIX' ? 'active' : ''}`} onClick={() => setMetodoPagamento('PIX')}>
                  <FaQrcode className="pay-icon" />
                  <div className="pay-text"><strong>PIX</strong></div>
                  <small><span>Aprovação Imediata</span></small>
                </div>
                <div className={`payment-option ${metodoPagamento === 'CREDITO' ? 'active' : ''}`} onClick={() => setMetodoPagamento('CREDITO')}>
                  <FaCreditCard className="pay-icon" />
                  <div className="pay-text"><strong>Crédito</strong></div>
                  <small><span>Pagar no Local (+10%)</span></small>
                </div>
                <div className={`payment-option ${metodoPagamento === 'DEBITO' ? 'active' : ''}`} onClick={() => setMetodoPagamento('DEBITO')}>
                  <FaBarcode className="pay-icon" />
                  <div className="pay-text"><strong>Débito</strong></div>
                  <small><span>Pagar no Local</span></small>
                </div>
              </div>
            </section>
          </form>
        </div>

        <div className="booking-summary-col">
          <div className="summary-card">
            <h3 className="summary-title">Resumo da Reserva</h3>

            <div style={{ fontSize: '4rem', textAlign: 'center', margin: '20px 0', color: '#D4AF6E' }}>
              {espacoAtivo ? espacoAtivo.icon : <FaCameraRetro />}
            </div>

            <div className="summary-content">
              <div className="summary-item">
                <span className="label"><FaCameraRetro /> <span>Cenário</span></span>
                <span className="value highlight">{espacoAtivo ? espacoAtivo.nome : <span>Selecione...</span>}</span>
              </div>
              <div className="summary-item">
                <span className="label"><FaCalendarAlt /> <span>Data</span></span>
                <span className="value">{format(date, "dd 'de' MMMM", { locale: ptBR })}</span>
              </div>
              <div className="summary-item">
                <span className="label"><FaClock /> <span>Horário</span></span>
                <span className="value">{selectedTime || '--:--'}</span>
              </div>
              <div className="summary-item">
                <span className="label"><FaClock /> <span>Duração</span></span>
                <span className="value notranslate" translate="no">{duracao}h</span>
              </div>
              <div className="summary-item">
                <span className="label"><FaCreditCard /> <span>Pagamento</span></span>
                <span className="value">{metodoPagamento || '...'}</span>
              </div>
            </div>

            <div className="summary-divider"></div>

            <div className="total-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>Total Estimado</span>
                {metodoPagamento === 'CREDITO' && (
                  <span style={{ fontSize: '0.75rem', color: '#e74c3c', fontWeight: 'bold' }}>+10% Taxa de Cartão</span>
                )}
              </div>
              <span className="total-price notranslate" translate="no">
                R$ {totalFinal ? totalFinal.toFixed(2).replace('.', ',') : '0,00'}
              </span>
            </div>

            <button type="button" onClick={handlePreSubmit} className="btn-confirm-booking" disabled={loading}>
              <span>{metodoPagamento === 'PIX' ? 'Pagar com Pix' : 'Confirmar Reserva'}</span> <FaArrowRight />
            </button>

            <div className="security-badge">
              <FaLock /> <span>Ambiente Seguro</span>
            </div>
          </div>
        </div>
      </div>

      {showPixModal && (
        <div className="modal-overlay fade-in">
          <div className="modal-content pix-modal">
            <button className="close-btn" onClick={() => setShowPixModal(false)}><FaTimes /></button>

            <div className="modal-header-payment">
              <h3>Pagamento Pix</h3>
              <p className="subtitle"><span>Escaneie o QR Code ou use o Copia e Cola</span></p>
            </div>

            <div className="payment-steps">
              <div className="pay-step-box center-box">
                <span className="step-tag">1. Escanear</span>
                <p>Valor: <strong>R$ {totalFinal ? totalFinal.toFixed(2).replace('.', ',') : '0,00'}</strong></p>
                <div className="qr-container-infinite">
                  {pixCopiaCola && <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=10&data=${encodeURIComponent(pixCopiaCola)}`} alt="QR Pix" />}
                </div>
              </div>

              <div className="pay-step-box">
                <span className="step-tag">2. Copia e Cola</span>
                <div className="copy-paste-box">
                  <input type="text" readOnly value={pixCopiaCola} />
                  <button type="button" onClick={() => {
                    navigator.clipboard.writeText(pixCopiaCola);
                    Store.addNotification({ title: "Copiado!", message: "Código Pix copiado.", type: "default", container: "top-right", dismiss: { duration: 2000 } });
                  }}><FaCopy /></button>
                </div>
              </div>

              <div className="pay-step-box">
                <span className="step-tag">3. Comprovante</span>
                <label className={`upload-zone ${comprovante ? 'has-file' : ''}`}>
                  <FaCloudUploadAlt size={28} />
                  <div className="upload-text">
                    <strong><span>{comprovante ? comprovante.name : 'Anexar Comprovante'}</span></strong>
                  </div>
                  <input type="file" onChange={(e) => setComprovante(e.target.files[0])} hidden accept="image/*,application/pdf" />
                </label>
              </div>
            </div>

            <button type="button" className="btn-finalize-total" onClick={enviarReserva}>
              <FaCheckCircle /> <span>Finalizar Pix</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agendamento;