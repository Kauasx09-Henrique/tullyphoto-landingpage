import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Store } from 'react-notifications-component';
import { mask, unmask } from 'remask';
import { FaPhoneAlt, FaCheckCircle, FaTimes, FaShieldAlt } from 'react-icons/fa';
import api from '../services/api';
import './home.css';

const PhotoGrid = lazy(() => import('../components/PhotoGrid'));
const ServiceCards = lazy(() => import('../components/ServiceCards'));
const StudioBanner = lazy(() => import('../components/StudioBanner'));
const Location = lazy(() => import('../components/Location'));
const Equipe = lazy(() => import('../components/Equipe'));

const Home = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [showModal, setShowModal] = useState(false);
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);

  // 🔥 controle de carregamento do carrossel
  const [showCarousel, setShowCarousel] = useState(false);

  useEffect(() => {
    if (user && !user.telefone_verificado) {
      setTimeout(() => setShowModal(true), 1500);
    }

    // 🔥 atraso para não travar LCP
    setTimeout(() => setShowCarousel(true), 500);

  }, [user]);

  const handleSavePhone = async () => {
    const cleanPhone = unmask(telefone);

    if (cleanPhone.length < 10) {
      return Store.addNotification({
        title: "Atenção",
        message: "Número incompleto",
        type: "warning",
        insert: "top",
        container: "top-right",
        dismiss: { duration: 3000 }
      });
    }

    setLoading(true);

    try {
      await api.post('/usuarios/salvar-telefone', { telefone: cleanPhone });

      const updatedUser = { ...user, telefone_verificado: true, telefone: cleanPhone };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setShowModal(false);

      Store.addNotification({
        title: "Sucesso!",
        message: "Contato salvo com sucesso.",
        type: "success",
        insert: "top",
        container: "top-right",
        dismiss: { duration: 3000 }
      });

    } catch {
      Store.addNotification({
        title: "Erro",
        message: "Falha ao salvar número",
        type: "danger",
        insert: "top",
        container: "top-right",
        dismiss: { duration: 3000 }
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
            <button className="close-lux" onClick={() => setShowModal(false)}>
              <FaTimes />
            </button>

            <div className="modal-header-lux">
              <div className="icon-gold-circle"><FaPhoneAlt /></div>
              <h2>Atualizar Contato</h2>
              <div className="gold-divider"></div>
              <p>Precisamos do seu WhatsApp para confirmar seus próximos agendamentos.</p>
            </div>

            <div className="modal-body-lux">
              <label className="label-lux">Seu WhatsApp</label>

              <div className="input-group-lux">
                <FaPhoneAlt />
                <input
                  type="text"
                  placeholder="(00) 00000-0000"
                  value={telefone}
                  onChange={(e) =>
                    setTelefone(mask(e.target.value, ['(99) 9999-9999', '(99) 99999-9999']))
                  }
                />
              </div>

              <button className="btn-action-lux" onClick={handleSavePhone} disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Contato'} <FaCheckCircle />
              </button>
            </div>

            <div className="modal-footer-lux">
              <FaShieldAlt />
              <span>Seus dados estão seguros conosco.</span>
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={<div style={{ height: '80vh', background: '#000' }} />}>
        <PhotoGrid />
      </Suspense>

      <Suspense fallback={<div>Carregando...</div>}>
        <StudioBanner />
        <ServiceCards />
        <Equipe />
        <Location />
      </Suspense>

    </main>
  );
};

export default Home;