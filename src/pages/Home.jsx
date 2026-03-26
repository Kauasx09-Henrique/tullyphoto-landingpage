import React, { useState, useEffect } from 'react';
import { Store } from 'react-notifications-component';
import { mask, unmask } from 'remask';
import { FaPhoneAlt, FaCheckCircle, FaTimes, FaLock, FaShieldAlt } from 'react-icons/fa';
import api from '../services/api';
import './home.css';

// Componentes da Home
import PhotoGrid from '../components/PhotoGrid';
import ServiceCards from '../components/ServiceCards';
import StudioBanner from '../components/StudioBanner';
import Location from '../components/Location';
import Equipe from '../components/Equipe';
import './home.css'

const Home = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [showModal, setShowModal] = useState(false);
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Abre o modal se o usuário existir mas não tiver telefone verificado
    if (user && !user.telefone_verificado) {
      setTimeout(() => setShowModal(true), 1500);
    }
  }, [user]);

  const handleSavePhone = async () => {
    const cleanPhone = unmask(telefone);
    if (cleanPhone.length < 10) {
      return Store.addNotification({
        title: "Atenção", message: "Número incompleto", type: "warning",
        insert: "top", container: "top-right", dismiss: { duration: 3000 }
      });
    }

    setLoading(true);
    try {
      await api.post('/usuarios/salvar-telefone', { telefone: cleanPhone });

      // Atualiza localmente para sumir o modal
      const updatedUser = { ...user, telefone_verificado: true, telefone: cleanPhone };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setShowModal(false);

      Store.addNotification({
        title: "Sucesso!", message: "Contato salvo com sucesso.", type: "success",
        insert: "top", container: "top-right", dismiss: { duration: 3000 }
      });
    } catch (err) {
      Store.addNotification({
        title: "Erro", message: "Falha ao salvar número", type: "danger",
        insert: "top", container: "top-right", dismiss: { duration: 3000 }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="home-container">
      {showModal && (
        <div className="modal-overlay-lux">
          <div className="modal-card-lux slide-up">
            <button className="close-lux" onClick={() => setShowModal(false)}><FaTimes /></button>
            <div className="modal-header-lux">
              <div className="icon-gold-circle"><FaPhoneAlt /></div>
              <h2>Atualizar Contato</h2>
              <div className="gold-divider"></div>
              <p>Precisamos do seu WhatsApp para confirmar seus próximos agendamentos.</p>
            </div>

            <div className="modal-body-lux">
              <div className="step-content">
                <label className="label-lux">Seu WhatsApp</label>
                <div className="input-group-lux">
                  <FaPhoneAlt />
                  <input
                    type="text"
                    placeholder="(00) 00000-0000"
                    value={telefone}
                    onChange={(e) => setTelefone(mask(e.target.value, ['(99) 9999-9999', '(99) 99999-9999']))}
                  />
                </div>
                <button className="btn-action-lux" onClick={handleSavePhone} disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar Contato'} <FaCheckCircle />
                </button>
              </div>
            </div>
            <div className="modal-footer-lux">
              <FaShieldAlt /> <span>Seus dados estão seguros conosco.</span>
            </div>
          </div>
        </div>
      )}

      <PhotoGrid />
      <StudioBanner />
      <ServiceCards />

      <Equipe />
      <Location />
    </main>
  );
};

export default Home;