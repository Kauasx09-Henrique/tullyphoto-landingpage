import React, { useState, useEffect } from 'react';
import { Store } from 'react-notifications-component';
import { 
  FaPlus, FaEdit, FaTrash, FaMapMarkerAlt, 
  FaTimes, FaSave, FaExclamationTriangle, FaDollarSign 
} from 'react-icons/fa';
import api from '../../services/api';
import '../../styles/adminEspacos.css'; 

const AdminEspacos = () => {
  const [espacos, setEspacos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Controle dos Modais
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

  // --- FUNÇÕES DE ABERTURA DE MODAL ---
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

  // --- AÇÕES DO CRUD ---
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.preco_por_hora) {
        Store.addNotification({ title: "Atenção", message: "Preencha os campos obrigatórios.", type: "warning", container: "top-right", dismiss: { duration: 3000 } });
        return;
    }

    try {
      if (modal.type === 'EDIT') {
        await api.put(`/espacos/${modal.data.id}`, { ...formData, ativo: true });
        setEspacos(prev => prev.map(item => item.id === modal.data.id ? { ...item, ...formData } : item));
        Store.addNotification({ title: "Sucesso", message: "Cenário atualizado!", type: "info", container: "top-right", dismiss: { duration: 3000 } });
      } else {
        // Simulação de ID para frontend (substitua pela resposta da API real)
        const novo = { id: Date.now(), ...formData }; 
        // const res = await api.post('/espacos', formData); 
        // setEspacos([...espacos, res.data]); 
        setEspacos([...espacos, novo]);
        Store.addNotification({ title: "Sucesso", message: "Cenário criado!", type: "success", container: "top-right", dismiss: { duration: 3000 } });
      }
      closeModal();
    } catch (err) {
      Store.addNotification({ title: "Erro", message: "Falha ao salvar.", type: "danger", container: "top-right", dismiss: { duration: 3000 } });
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/espacos/${modal.data.id}`);
      setEspacos(espacos.filter(item => item.id !== modal.data.id));
      Store.addNotification({ title: "Removido", message: "Cenário excluído.", type: "success", container: "top-right", dismiss: { duration: 3000 } });
      closeModal();
    } catch (err) {
      Store.addNotification({ title: "Erro", message: "Não foi possível excluir.", type: "danger", container: "top-right", dismiss: { duration: 4000 } });
    }
  };

  return (
    <div className="admin-page-container fade-in">
      {/* HEADER */}
      <div className="admin-header-row">
        <div>
           <h2 className="admin-title">Cenários & Espaços</h2>
           <p className="admin-subtitle">Gerencie os locais disponíveis para locação.</p>
        </div>
        <button className="btn-primary-add" onClick={openCreateModal}>
           <FaPlus /> Novo Cenário
        </button>
      </div>

      {/* TABELA CARD */}
      <div className="table-card">
        <table className="vetra-table">
          <thead>
            <tr>
              <th width="80">ID</th>
              <th>Nome & Descrição</th>
              <th width="150">Preço / Hora</th>
              <th width="120" align="right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                 <tr><td colSpan="4" className="text-center">Carregando...</td></tr>
            ) : espacos.length === 0 ? (
                 <tr><td colSpan="4" className="text-center">Nenhum cenário cadastrado.</td></tr>
            ) : (
                espacos.map(espaco => (
                <tr key={espaco.id}>
                    <td className="id-cell">#{espaco.id}</td>
                    
                    <td>
                        <div className="space-info">
                            {/* Ícone decorativo */}
                            <div className="space-icon-box">
                                <FaMapMarkerAlt />
                            </div>
                            <div className="space-details">
                                <span className="space-name">{espaco.nome}</span>
                                <span className="space-desc">{espaco.descricao || "Sem descrição definida."}</span>
                            </div>
                        </div>
                    </td>
                    
                    <td>
                        <div className="price-badge">
                            R$ {parseFloat(espaco.preco_por_hora).toFixed(2).replace('.', ',')}
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

      {/* MODAL */}
      {modal.show && (
        <div className="custom-modal-overlay fade-in">
          <div className="custom-modal-content">
            <button className="modal-close-icon" onClick={closeModal}><FaTimes /></button>
            
            {modal.type === 'DELETE' ? (
                <div className="modal-body-delete">
                    <div className="warning-icon"><FaExclamationTriangle /></div>
                    <h3>Excluir Cenário?</h3>
                    <p>Tem certeza que deseja remover <strong>{modal.data.nome}</strong>?</p>
                    <div className="modal-actions">
                        <button className="btn-cancel" onClick={closeModal}>Cancelar</button>
                        <button className="btn-confirm-delete" onClick={handleDelete}>Confirmar</button>
                    </div>
                </div>
            ) : (
                <div className="modal-body-form">
                    <h3>{modal.type === 'EDIT' ? 'Editar Cenário' : 'Novo Cenário'}</h3>
                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Nome do Espaço</label>
                            <input 
                                type="text" 
                                placeholder="Ex: Estúdio Principal" 
                                value={formData.nome}
                                onChange={e => setFormData({...formData, nome: e.target.value})}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Descrição</label>
                            <input 
                                type="text" 
                                placeholder="Ex: Fundo infinito branco..." 
                                value={formData.descricao}
                                onChange={e => setFormData({...formData, descricao: e.target.value})}
                            />
                        </div>

                        <div className="form-group">
                            <label>Valor Hora (R$)</label>
                            <div className="input-icon-group">
                                <FaDollarSign className="input-icon" />
                                <input 
                                    type="number" 
                                    placeholder="0,00" 
                                    value={formData.preco_por_hora}
                                    onChange={e => setFormData({...formData, preco_por_hora: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="btn-cancel" onClick={closeModal}>Cancelar</button>
                            <button type="submit" className="btn-confirm-save">
                                <FaSave /> Salvar
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