import React, { useState, useEffect } from 'react';
import { Store } from 'react-notifications-component';
import { 
  FaTrash, FaEdit, FaUserShield, FaUser, FaSearch, 
  FaTimes, FaSave, FaExclamationTriangle, FaPlus, FaKey, FaEllipsisV 
} from 'react-icons/fa';
import api from '../../services/api';
import '../../styles/user.css';

const AdminUsers = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ show: false, type: '', user: null });
  const [formData, setFormData] = useState({ nome: '', email: '', tipo: 'CLIENTE', senha: '' });

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
        // Dados de fallback para visualização
        setUsuarios([
            { id: 1, nome: 'Kauã Henrique', email: 'kaua@vetra.com', tipo: 'ADMIN', foto: null, criado_em: '2024-01-15T10:00:00' },
            { id: 2, nome: 'Ana Laura', email: 'ana@cliente.com', tipo: 'CLIENTE', foto: null, criado_em: '2024-02-10T14:30:00' },
            { id: 3, nome: 'Marcos Silva', email: 'marcos@gmail.com', tipo: 'CLIENTE', foto: null, criado_em: '2024-03-05T09:00:00' },
        ]);
      });
  };

  // --- HANDLERS ---
  const openCreateModal = () => {
    setFormData({ nome: '', email: '', tipo: 'CLIENTE', senha: '' });
    setModal({ show: true, type: 'CREATE', user: null });
  };

  const openEditModal = (user) => {
    setFormData({ nome: user.nome, email: user.email, tipo: user.tipo, senha: '' });
    setModal({ show: true, type: 'EDIT', user });
  };

  const openDeleteModal = (user) => {
    setModal({ show: true, type: 'DELETE', user });
  };

  const closeModal = () => {
    setModal({ show: false, type: '', user: null });
  };

  const handleConfirmAction = async () => {
    // Lógica simplificada para visualização (conecte ao seu backend como antes)
    if (modal.type === 'DELETE') {
        setUsuarios(usuarios.filter(u => u.id !== modal.user.id));
        Store.addNotification({ title: "Removido", message: "Usuário excluído.", type: "success", container: "top-right", dismiss: { duration: 3000 } });
    } else if (modal.type === 'CREATE') {
        const novo = { id: Date.now(), ...formData, criado_em: new Date().toISOString() };
        setUsuarios([novo, ...usuarios]);
        Store.addNotification({ title: "Criado", message: "Usuário adicionado.", type: "success", container: "top-right", dismiss: { duration: 3000 } });
    } else if (modal.type === 'EDIT') {
        setUsuarios(usuarios.map(u => u.id === modal.user.id ? { ...u, ...formData } : u));
        Store.addNotification({ title: "Salvo", message: "Dados atualizados.", type: "info", container: "top-right", dismiss: { duration: 3000 } });
    }
    closeModal();
  };

  // --- FILTROS & HELPERS ---
  const usuariosFiltrados = usuarios.filter(user => 
    user.nome.toLowerCase().includes(busca.toLowerCase()) || 
    user.email.toLowerCase().includes(busca.toLowerCase())
  );

  const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : 'US';
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('pt-BR');

  return (
    <div className="admin-page-container fade-in">
      
      {/* HEADER DE CONTROLE */}
      <div className="control-header">
        <div className="title-section">
            <h1 className="page-title">Membros</h1>
            <span className="page-count">{usuariosFiltrados.length} Registros</span>
        </div>

        <div className="actions-section">
            <div className="search-wrapper">
                <FaSearch className="search-icon" />
                <input 
                    type="text" 
                    placeholder="Pesquisar..." 
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />
            </div>
            <button className="btn-new-user" onClick={openCreateModal}>
                <FaPlus /> <span>Adicionar</span>
            </button>
        </div>
      </div>

      {/* TABELA FLUTUANTE (Floating Rows) */}
      <div className="floating-table-container">
        <div className="table-header-row">
            <div className="col-user">Usuário</div>
            <div className="col-email">Email</div>
            <div className="col-role">Permissão</div>
            <div className="col-date">Cadastro</div>
            <div className="col-actions">Ações</div>
        </div>

        <div className="table-body">
            {loading ? (
                <div className="loading-state">Carregando dados...</div>
            ) : usuariosFiltrados.length === 0 ? (
                <div className="empty-state">Nenhum usuário encontrado.</div>
            ) : (
                usuariosFiltrados.map((user) => (
                <div className="table-row-card" key={user.id}>
                    {/* Coluna Usuário */}
                    <div className="col-user">
                        <div className="avatar-wrapper">
                            {user.foto ? (
                                <img src={user.foto} alt={user.nome} />
                            ) : (
                                <div className={`avatar-initials role-${user.tipo}`}>
                                    {getInitials(user.nome)}
                                </div>
                            )}
                            <div className="user-info">
                                <strong>{user.nome}</strong>
                                <span className="id-sub">#{user.id}</span>
                            </div>
                        </div>
                    </div>

                    {/* Coluna Email */}
                    <div className="col-email">
                        <span className="email-text">{user.email}</span>
                    </div>

                    {/* Coluna Permissão */}
                    <div className="col-role">
                        <span className={`role-badge ${user.tipo === 'ADMIN' ? 'role-admin' : 'role-client'}`}>
                            {user.tipo === 'ADMIN' ? <FaUserShield /> : <FaUser />}
                            {user.tipo}
                        </span>
                    </div>

                    {/* Coluna Data */}
                    <div className="col-date">
                        {formatDate(user.criado_em)}
                    </div>

                    {/* Coluna Ações */}
                    <div className="col-actions">
                        <button className="icon-action edit" onClick={() => openEditModal(user)} title="Editar">
                            <FaEdit />
                        </button>
                        <button className="icon-action delete" onClick={() => openDeleteModal(user)} title="Excluir">
                            <FaTrash />
                        </button>
                    </div>
                </div>
                ))
            )}
        </div>
      </div>

      {/* MODAL REFINADO */}
      {modal.show && (
        <div className="modal-overlay fade-in">
            <div className="modal-glass">
                <button className="close-modal" onClick={closeModal}><FaTimes /></button>
                
                {modal.type === 'DELETE' ? (
                    <div className="delete-content">
                        <div className="icon-warning-pulse"><FaExclamationTriangle /></div>
                        <h2>Excluir Conta</h2>
                        <p>Você tem certeza que deseja remover <strong>{modal.user.nome}</strong>? Esta ação não pode ser desfeita.</p>
                        <div className="modal-footer">
                            <button className="btn-ghost" onClick={closeModal}>Cancelar</button>
                            <button className="btn-danger" onClick={handleConfirmAction}>Confirmar Exclusão</button>
                        </div>
                    </div>
                ) : (
                    <div className="form-content">
                        <div className="modal-top">
                            <h2>{modal.type === 'CREATE' ? 'Novo Membro' : 'Editar Perfil'}</h2>
                            <p>Preencha as informações de acesso.</p>
                        </div>
                        
                        <form onSubmit={(e) => {e.preventDefault(); handleConfirmAction();}}>
                            <div className="input-group">
                                <label>Nome Completo</label>
                                <input 
                                    type="text" 
                                    value={formData.nome} 
                                    onChange={e => setFormData({...formData, nome: e.target.value})}
                                    placeholder="Nome do usuário"
                                />
                            </div>
                            <div className="input-group">
                                <label>Email Corporativo</label>
                                <input 
                                    type="email" 
                                    value={formData.email} 
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    placeholder="usuario@vetra.com"
                                />
                            </div>
                            <div className="input-group">
                                <label>Nível de Acesso</label>
                                <select 
                                    value={formData.tipo} 
                                    onChange={e => setFormData({...formData, tipo: e.target.value})}
                                >
                                    <option value="CLIENTE">Cliente</option>
                                    <option value="ADMIN">Administrador</option>
                                </select>
                            </div>
                            
                            {modal.type === 'CREATE' && (
                                <div className="input-group">
                                    <label>Senha Provisória</label>
                                    <div className="icon-input">
                                        <FaKey />
                                        <input 
                                            type="password" 
                                            value={formData.senha} 
                                            onChange={e => setFormData({...formData, senha: e.target.value})}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="modal-footer">
                                <button type="button" className="btn-ghost" onClick={closeModal}>Cancelar</button>
                                <button type="submit" className="btn-primary-save">
                                    <FaSave /> Salvar Dados
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

export default AdminUsers;