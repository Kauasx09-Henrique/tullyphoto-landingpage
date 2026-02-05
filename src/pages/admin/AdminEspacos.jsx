import React, { useState, useEffect } from 'react';
import { Store } from 'react-notifications-component';
import { 
  FaPlus, FaEdit, FaTrash, FaMapMarkerAlt, 
  FaTimes, FaSave, FaExclamationTriangle, FaDollarSign, FaImage 
} from 'react-icons/fa';
import api from '../../services/api';
import '../../styles/adminEspacos.css'; 

const AdminEspacos = () => {
  const [espacos, setEspacos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados do Modal
  const [modal, setModal] = useState({ show: false, type: '', data: null });
  const [formData, setFormData] = useState({ nome: '', descricao: '', preco_por_hora: '' });

  useEffect(() => {
    loadEspacos();
  }, []);

  const loadEspacos = async () => {
    try {
      const res = await api.get('/espacos');
      setEspacos(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- MODAIS ---
  const openCreateModal = () => {
    setFormData({ nome: '', descricao: '', preco_por_hora: '' });
    setModal({ show: true, type: 'CREATE', data: null });
  };

  const openEditModal = (espaco) => {
    setFormData({ 
      nome: espaco.nome, 
      descricao: espaco.descricao || '', 
      preco_por_hora: espaco.preco_por_hora 
    });
    setModal({ show: true, type: 'EDIT', data: espaco });
  };

  const openDeleteModal = (espaco) => {
    setModal({ show: true, type: 'DELETE', data: espaco });
  };

  const closeModal = () => {
    setModal({ show: false, type: '', data: null });
  };

  // --- CRUD ---
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.preco_por_hora) {
        Store.addNotification({ title: "Campos obrigatórios", message: "Preencha nome e valor.", type: "warning", container: "top-right", dismiss: { duration: 3000 } });
        return;
    }

    try {
      if (modal.type === 'EDIT') {
        await api.put(`/espacos/${modal.data.id}`, { ...formData, ativo: true });
        setEspacos(prev => prev.map(item => item.id === modal.data.id ? { ...item, ...formData } : item));
        Store.addNotification({ title: "Atualizado", message: "Cenário editado com sucesso.", type: "success", container: "top-right", dismiss: { duration: 3000 } });
      } else {
        const novo = { id: Date.now(), ...formData }; // Simulação (troque por res.data do backend)
        // const res = await api.post('/espacos', formData); 
        setEspacos([...espacos, novo]);
        Store.addNotification({ title: "Criado", message: "Novo cenário adicionado.", type: "success", container: "top-right", dismiss: { duration: 3000 } });
      }
      closeModal();
    } catch (err) {
      Store.addNotification({ title: "Erro", message: "Não foi possível salvar.", type: "danger", container: "top-right", dismiss: { duration: 3000 } });
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/espacos/${modal.data.id}`);
      setEspacos(espacos.filter(item => item.id !== modal.data.id));
      Store.addNotification({ title: "Excluído", message: "Cenário removido.", type: "default", container: "top-right", dismiss: { duration: 3000 } });
      closeModal();
    } catch (err) {
      Store.addNotification({ title: "Erro", message: "Falha ao excluir.", type: "danger", container: "top-right", dismiss: { duration: 4000 } });
    }
  };

  return (
    <div className="admin-page-container fade-in">
      
      {/* HEADER SUPERIOR */}
      <div className="admin-header-row">
        <div className="header-text">
           <h2 className="admin-title">Cenários & Espaços</h2>
           <p className="admin-subtitle">Gerencie os locais disponíveis para locação e ensaios.</p>
        </div>
        <button className="btn-primary-add" onClick={openCreateModal}>
           <FaPlus /> <span>Novo Cenário</span>
        </button>
      </div>

      {/* TABELA DE DADOS (CARD) */}
      <div className="table-card">
        <table className="vetra-table">
          <thead>
            <tr>
              <th width="80" align="center">ID</th>
              <th>Detalhes do Espaço</th>
              <th width="180">Valor / Hora</th>
              <th width="140" align="right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                 <tr><td colSpan="4" className="text-center">Carregando dados...</td></tr>
            ) : espacos.length === 0 ? (
                 <tr><td colSpan="4" className="text-center empty-state">Nenhum cenário cadastrado ainda.</td></tr>
            ) : (
                espacos.map(espaco => (
                <tr key={espaco.id}>
                    <td className="id-cell">#{espaco.id}</td>
                    
                    <td>
                        <div className="space-info-cell">
                            <div className="space-thumb">
                                <FaImage /> {/* Placeholder se não tiver foto */}
                            </div>
                            <div className="space-details">
                                <span className="space-name">{espaco.nome}</span>
                                <span className="space-desc">
                                    <FaMapMarkerAlt className="mini-icon"/> {espaco.descricao || "Descrição pendente"}
                                </span>
                            </div>
                        </div>
                    </td>
                    
                    <td>
                        <div className="price-tag">
                            <small>R$</small> {parseFloat(espaco.preco_por_hora).toFixed(2).replace('.', ',')}
                        </div>
                    </td>
                    
                    <td align="right">
                        <div className="action-buttons">
                            <button className="action-btn edit" onClick={() => openEditModal(espaco)} title="Editar">
                                <FaEdit />
                            </button>
                            <button className="action-btn delete" onClick={() => openDeleteModal(espaco)} title="Excluir">
                                <FaTrash />
                            </button>
                        </div>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL (OVERLAY) */}
      {modal.show && (
        <div className="custom-modal-overlay fade-in">
          <div className={`custom-modal-content ${modal.type === 'DELETE' ? 'modal-sm' : 'modal-md'}`}>
            <button className="modal-close-icon" onClick={closeModal}><FaTimes /></button>
            
            {modal.type === 'DELETE' ? (
                // LAYOUT DELETAR
                <div className="modal-body-delete">
                    <div className="warning-icon-box"><FaExclamationTriangle /></div>
                    <h3>Confirmar Exclusão</h3>
                    <p>Tem certeza que deseja apagar permanentemente o cenário <strong>{modal.data.nome}</strong>?</p>
                    <div className="modal-actions">
                        <button className="btn-cancel" onClick={closeModal}>Cancelar</button>
                        <button className="btn-confirm-delete" onClick={handleDelete}>Sim, Excluir</button>
                    </div>
                </div>
            ) : (
                // LAYOUT FORMULÁRIO
                <div className="modal-body-form">
                    <div className="modal-header">
                        <h3>{modal.type === 'EDIT' ? 'Editar Cenário' : 'Novo Cenário'}</h3>
                        <p>Preencha as informações do espaço físico.</p>
                    </div>
                    
                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Nome do Espaço</label>
                            <input 
                                type="text" 
                                placeholder="Ex: Estúdio Principal - Fundo Infinito" 
                                value={formData.nome}
                                onChange={e => setFormData({...formData, nome: e.target.value})}
                                required
                                className="vetra-input"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Descrição Curta</label>
                            <input 
                                type="text" 
                                placeholder="Ex: Ar condicionado, luz natural, 40m²..." 
                                value={formData.descricao}
                                onChange={e => setFormData({...formData, descricao: e.target.value})}
                                className="vetra-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Valor por Hora</label>
                            <div className="input-icon-group">
                                <FaDollarSign className="input-icon" />
                                <input 
                                    type="number" 
                                    placeholder="0,00" 
                                    value={formData.preco_por_hora}
                                    onChange={e => setFormData({...formData, preco_por_hora: e.target.value})}
                                    required
                                    className="vetra-input with-icon"
                                />
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="btn-cancel" onClick={closeModal}>Cancelar</button>
                            <button type="submit" className="btn-confirm-save">
                                <FaSave /> Salvar Alterações
                            </button>
                        </div>
                    </form>
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEspacos;