import React, { useState, useEffect } from 'react';
import { Store } from 'react-notifications-component';
import { 
  FaTrash, FaEdit, FaUserShield, FaUser, FaSearch, 
  FaTimes, FaSave, FaExclamationTriangle, FaPlus 
} from 'react-icons/fa';
import api from '../../services/api';
import '../../styles/dashboard.css';

const AdminUsers = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);

  // Estados para Modal e Formulário
  const [modal, setModal] = useState({ show: false, type: '', user: null });
  
  // Incluímos 'senha' no estado do formulário
  const [formData, setFormData] = useState({ 
    nome: '', 
    email: '', 
    tipo: 'CLIENTE', 
    senha: '' 
  });

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = () => {
    api.get('/usuarios')
      .then(res => {
        setUsuarios(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        setUsuarios([
            { id: 1, nome: 'Kauã Henrique', email: 'kaua@vetra.com', tipo: 'ADMIN', foto: null, criado_em: '2024-01-15T10:00:00' },
            { id: 2, nome: 'Ana Laura', email: 'ana@cliente.com', tipo: 'CLIENTE', foto: null, criado_em: '2024-02-10T14:30:00' },
        ]);
      });
  };

  // --- LÓGICA DO MODAL ---

  const openCreateModal = () => {
    // Reseta o form para criar um novo
    setFormData({ nome: '', email: '', tipo: 'CLIENTE', senha: '' });
    setModal({ show: true, type: 'CREATE', user: null });
  };

  const openEditModal = (user) => {
    // Preenche o form com dados do usuário (sem senha)
    setFormData({ nome: user.nome, email: user.email, tipo: user.tipo, senha: '' });
    setModal({ show: true, type: 'EDIT', user });
  };

  const openDeleteModal = (user) => {
    setModal({ show: true, type: 'DELETE', user });
  };

  const closeModal = () => {
    setModal({ show: false, type: '', user: null });
  };

  // --- AÇÕES DO CRUD (CRIAR, EDITAR, DELETAR) ---

  const handleConfirmAction = async () => {
    // 1. AÇÃO DE CRIAR (POST)
    if (modal.type === 'CREATE') {
        if (!formData.nome || !formData.email || !formData.senha) {
            Store.addNotification({ title: "Atenção", message: "Preencha todos os campos.", type: "warning", container: "top-right", dismiss: { duration: 3000 } });
            return;
        }

        try {
            // const res = await api.post('/usuarios', formData); // Backend Real
            
            // Simulação Visual (Frontend Optimistic Update)
            const novoUsuario = { 
                id: Math.random(), 
                ...formData, 
                criado_em: new Date().toISOString(), 
                foto: null 
            };
            setUsuarios([novoUsuario, ...usuarios]);

            Store.addNotification({ title: "Sucesso", message: "Novo usuário cadastrado!", type: "success", container: "top-right", dismiss: { duration: 3000 } });
            closeModal();
        } catch (err) {
            Store.addNotification({ title: "Erro", message: "Erro ao criar usuário.", type: "danger", container: "top-right", dismiss: { duration: 3000 } });
        }
    }

    // 2. AÇÃO DE EDITAR (PUT)
    else if (modal.type === 'EDIT') {
        try {
            // await api.put(`/usuarios/${modal.user.id}`, formData); // Backend Real
            
            setUsuarios(usuarios.map(u => u.id === modal.user.id ? { ...u, ...formData } : u));
            
            Store.addNotification({ title: "Atualizado", message: "Dados salvos com sucesso.", type: "success", container: "top-right", dismiss: { duration: 3000 } });
            closeModal();
        } catch (err) {
            Store.addNotification({ title: "Erro", message: "Erro ao salvar.", type: "danger", container: "top-right", dismiss: { duration: 3000 } });
        }
    }

    // 3. AÇÃO DE EXCLUIR (DELETE)
    else if (modal.type === 'DELETE') {
        try {
            await api.delete(`/usuarios/${modal.user.id}`);
            setUsuarios(usuarios.filter(u => u.id !== modal.user.id));
            Store.addNotification({ title: "Excluído", message: "Usuário removido.", type: "success", container: "top-right", dismiss: { duration: 3000 } });
            closeModal();
        } catch (err) {
            Store.addNotification({ title: "Erro", message: "Erro ao excluir.", type: "danger", container: "top-right", dismiss: { duration: 3000 } });
        }
    }
  };

  // --- RENDERIZAÇÃO ---
  const usuariosFiltrados = usuarios.filter(user => 
    user.nome.toLowerCase().includes(busca.toLowerCase()) || 
    user.email.toLowerCase().includes(busca.toLowerCase())
  );

  const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : 'US';
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('pt-BR');

  return (
    <div className="admin-page-container fade-in">
      {/* HEADER SUPERIOR */}
      <div className="admin-header-row">
        <div className="header-title-group">
            <h2 className="admin-title">Gestão de Usuários</h2>
            <p className="admin-subtitle">Administre o acesso e permissões da plataforma.</p>
        </div>
        
        <div className="header-actions">
            <div className="search-box">
                <FaSearch className="search-icon" />
                <input 
                    type="text" 
                    placeholder="Buscar usuário..." 
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />
            </div>
            {/* BOTÃO NOVO USUÁRIO */}
            <button className="btn-primary-add" onClick={openCreateModal}>
                <FaPlus /> Novo Usuário
            </button>
        </div>
      </div>

      {/* TABELA */}
      <div className="table-container">
        <table className="vetra-table">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Email</th>
              <th>Permissão</th>
              <th>Data Cadastro</th>
              <th align="right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan="5" className="text-center">Carregando...</td></tr>
            ) : usuariosFiltrados.length === 0 ? (
                <tr><td colSpan="5" className="text-center">Nenhum registro encontrado.</td></tr>
            ) : (
                usuariosFiltrados.map((user) => (
                <tr key={user.id}>
                    <td>
                        <div className="user-profile-cell">
                            {user.foto ? (
                                <img src={user.foto} alt={user.nome} className="avatar-img" />
                            ) : (
                                <div className="avatar-placeholder">{getInitials(user.nome)}</div>
                            )}
                            <span className="user-name">{user.nome}</span>
                        </div>
                    </td>
                    <td className="text-muted">{user.email}</td>
                    <td>
                        <span className={`badge ${user.tipo === 'ADMIN' ? 'badge-admin' : 'badge-client'}`}>
                            {user.tipo === 'ADMIN' ? <FaUserShield /> : <FaUser />}
                            {user.tipo}
                        </span>
                    </td>
                    <td className="text-muted">{formatDate(user.criado_em)}</td>
                    <td align="right">
                        <div className="action-buttons">
                            <button className="action-btn edit" onClick={() => openEditModal(user)} title="Editar">
                                <FaEdit />
                            </button>
                            <button className="action-btn delete" onClick={() => openDeleteModal(user)} title="Excluir">
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
      
      <div className="table-footer">
        Total de <strong>{usuariosFiltrados.length}</strong> usuários.
      </div>

      {/* --- MODAL INTELIGENTE (CRIAR / EDITAR / DELETAR) --- */}
      {modal.show && (
        <div className="custom-modal-overlay fade-in">
            <div className="custom-modal-content">
                <button className="modal-close-icon" onClick={closeModal}><FaTimes /></button>
                
                {modal.type === 'DELETE' ? (
                    // --- DELETE MODE ---
                    <div className="modal-body-delete">
                        <div className="warning-icon"><FaExclamationTriangle /></div>
                        <h3>Confirmar Exclusão</h3>
                        <p>Deseja realmente apagar <strong>{modal.user.nome}</strong>? Essa ação é irreversível.</p>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={closeModal}>Cancelar</button>
                            <button className="btn-confirm-delete" onClick={handleConfirmAction}>Excluir</button>
                        </div>
                    </div>
                ) : (
                    // --- CREATE / EDIT MODE ---
                    <div className="modal-body-form">
                        <h3>{modal.type === 'CREATE' ? 'Novo Cadastro' : 'Editar Usuário'}</h3>
                        
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Nome Completo</label>
                                <input 
                                    type="text" 
                                    placeholder="Ex: João Silva"
                                    value={formData.nome} 
                                    onChange={(e) => setFormData({...formData, nome: e.target.value})} 
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Email de Acesso</label>
                                <input 
                                    type="email" 
                                    placeholder="email@exemplo.com"
                                    value={formData.email} 
                                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                />
                            </div>

                            <div className="form-group">
                                <label>Permissão</label>
                                <select 
                                    value={formData.tipo} 
                                    onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                                >
                                    <option value="CLIENTE">Cliente (Acesso Padrão)</option>
                                    <option value="ADMIN">Administrador (Acesso Total)</option>
                                </select>
                            </div>

                            {/* Campo de Senha aparece APENAS ao criar novo usuário */}
                            {modal.type === 'CREATE' && (
                                <div className="form-group">
                                    <label>Senha Inicial</label>
                                    <input 
                                        type="password" 
                                        placeholder="Crie uma senha forte"
                                        value={formData.senha} 
                                        onChange={(e) => setFormData({...formData, senha: e.target.value})} 
                                    />
                                </div>
                            )}
                        </div>

                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={closeModal}>Cancelar</button>
                            <button className="btn-confirm-save" onClick={handleConfirmAction}>
                                <FaSave /> {modal.type === 'CREATE' ? 'Criar Usuário' : 'Salvar Alterações'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;