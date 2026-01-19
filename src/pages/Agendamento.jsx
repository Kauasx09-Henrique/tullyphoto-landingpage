import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import { Store } from 'react-notifications-component';
import { format } from 'date-fns';
import { 
  FaCreditCard, FaBarcode, FaQrcode, FaTimes, FaCloudUploadAlt, 
  FaCcVisa, FaCcMastercard, FaCcAmex, FaMoneyBillWave, FaCheckCircle, 
  FaClock, FaCalendarAlt, FaMapMarkerAlt 
} from 'react-icons/fa';
import api from '../services/api';
import 'react-calendar/dist/Calendar.css';
import '../styles/agendamento.css';

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
  const navigate = useNavigate();

  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  useEffect(() => {
    api.get('/espacos').then((res) => setEspacos(res.data));
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (selectedEspaco && espacos.length > 0) {
      const espacoInfo = espacos.find(e => e.id === parseInt(selectedEspaco));
      if (espacoInfo) setTotal(espacoInfo.preco_por_hora * duracao);
    }
  }, [selectedEspaco, duracao, espacos]);

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

  const isTimeBlocked = (timeString) => {
    const hora = parseInt(timeString.split(':')[0]);
    return horariosOcupados.includes(hora);
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    if (!selectedEspaco || !date || !selectedTime || !metodoPagamento) {
      Store.addNotification({
        title: "Atenção", message: "Preencha todos os campos obrigatórios.", type: "warning", container: "top-right", dismiss: { duration: 3000 }
      });
      return;
    }
    if (metodoPagamento === 'PIX') setShowPixModal(true);
    else enviarReserva();
  };

  const sendBrowserNotification = (title, body) => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
    }
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
      
      Store.addNotification({
        title: "Confirmado!", message: "Sua reserva foi enviada com sucesso.", type: "success", container: "top-right", dismiss: { duration: 5000 }
      });

      sendBrowserNotification("Reserva Confirmada!", `Seu agendamento para ${format(dataInicio, 'dd/MM HH:mm')} foi enviado.`);

      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.msg || "Erro ao processar reserva.";
      Store.addNotification({ title: "Erro", message: msg, type: "danger", container: "top-right", dismiss: { duration: 4000 } });
      setDate(new Date(date));
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        <h2 className="booking-title">Agende seu Ensaio</h2>
        
        <form onSubmit={handlePreSubmit}>
          <div className="form-section">
            <label className="section-label"><FaMapMarkerAlt /> 1. Escolha o Cenário</label>
            <div className="espacos-grid">
              {espacos.map((espaco) => (
                <div key={espaco.id} className={`espaco-card ${selectedEspaco === espaco.id ? 'selected' : ''}`} onClick={() => { setSelectedEspaco(espaco.id); setSelectedTime(null); }}>
                  <span>{espaco.nome}</span>
                  <small>R$ {espaco.preco_por_hora}/h</small>
                </div>
              ))}
            </div>
          </div>

          <div className="form-section row-layout">
            <div className="calendar-wrapper">
              <label className="section-label"><FaCalendarAlt /> 2. Data</label>
              <Calendar onChange={(d) => { setDate(d); setSelectedTime(null); }} value={date} minDate={new Date()} locale="pt-BR" />
            </div>

            <div className="time-wrapper">
              <label className="section-label"><FaClock /> 3. Horário de Início</label>
              <div className="time-grid">
                {timeSlots.map(time => {
                  const blocked = isTimeBlocked(time);
                  return (
                    <button type="button" key={time} disabled={blocked} className={`time-btn ${selectedTime === time ? 'active' : ''} ${blocked ? 'blocked' : ''}`} onClick={() => !blocked && setSelectedTime(time)}>
                      {time}
                    </button>
                  );
                })}
              </div>
              <div className="time-legend">
                <span><span className="dot free"></span> Livre</span>
                <span><span className="dot sel"></span> Escolhido</span>
                <span><span className="dot occ"></span> Ocupado</span>
              </div>
            </div>
          </div>

          <div className="form-section">
            <label className="section-label"><FaClock /> 4. Duração</label>
            <div className="duration-control">
              <input type="number" min="1" max="8" className="fake-input" value={duracao} onChange={(e) => setDuracao(e.target.value)} />
              <span>horas de locação</span>
            </div>
          </div>

          <div className="form-section">
            <label className="section-label"><FaCreditCard /> 5. Pagamento</label>
            <div className="payment-methods">
              <div className={`payment-card ${metodoPagamento === 'CREDITO' ? 'active' : ''}`} onClick={() => setMetodoPagamento('CREDITO')}>
                <FaCreditCard className="payment-icon" /><span>Crédito</span>
              </div>
              <div className={`payment-card ${metodoPagamento === 'DEBITO' ? 'active' : ''}`} onClick={() => setMetodoPagamento('DEBITO')}>
                <FaBarcode className="payment-icon" /><span>Débito</span>
              </div>
              <div className={`payment-card ${metodoPagamento === 'PIX' ? 'active' : ''}`} onClick={() => setMetodoPagamento('PIX')}>
                <FaQrcode className="payment-icon" /><span>PIX</span>
              </div>
            </div>

            {(metodoPagamento === 'CREDITO' || metodoPagamento === 'DEBITO') && (
              <div className="credit-details">
                <div style={{ display: 'flex', justifyContent: 'center', gap: 15, fontSize: '2rem', marginBottom: 15 }}>
                  <FaCcVisa color="#1a1f71" /><FaCcMastercard color="#eb001b" /><FaCcAmex color="#2e77bb" />
                </div>
                <h4 style={{ color: '#2C2420', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <FaCheckCircle color="#27ae60" /> Pagamento Presencial
                </h4>
                <p style={{ color: '#666', marginTop: 5 }}>O pagamento será realizado na maquininha no dia do ensaio.</p>
              </div>
            )}
          </div>

          <div className="footer-summary">
            <div><span style={{color:'#888', textTransform:'uppercase'}}>Total Estimado</span><span className="total-value">R$ {total.toFixed(2).replace('.', ',')}</span></div>
            <button type="submit" className="booking-btn">{metodoPagamento === 'PIX' ? 'Continuar para PIX' : 'Confirmar Reserva'}</button>
          </div>
        </form>
      </div>

      {showPixModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowPixModal(false)}><FaTimes /></button>
            <h3 style={{ color: '#2C2420' }}>Pagamento via PIX</h3>
            <div className="qr-box">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020126580014BR.GOV.BCB.PIX0136kaua@vetra.com520400005303986540${total.toFixed(2).replace('.', '')}5802BR5913ESTUDIO VETRA6009SAO PAULO62070503***6304`} alt="QR Code" width="200" />
            </div>
            <label className="upload-area">
              <FaCloudUploadAlt size={30} color="#D4AF6E" />
              <div style={{ fontWeight: 'bold', color: '#555' }}>Anexar Comprovante</div>
              <div style={{ fontSize: '0.8rem', color: '#999' }}>{comprovante ? comprovante.name : '(Clique para selecionar PDF ou Imagem)'}</div>
              <input type="file" accept="image/*,application/pdf" onChange={(e) => setComprovante(e.target.files[0])} style={{ display: 'none' }} />
            </label>
            <button className="confirm-pix" onClick={() => !comprovante ? alert("Anexe o comprovante!") : enviarReserva()}>
              <FaMoneyBillWave /> Confirmar e Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agendamento;