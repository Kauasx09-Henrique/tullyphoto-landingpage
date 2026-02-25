import React, { useState, useEffect } from 'react';
import { Store } from 'react-notifications-component';
import { FaUserShield, FaUser, FaLock, FaLockOpen, FaEdit, FaTrash } from 'react-icons/fa';
import api from '../../services/api';
import './styles/adminUsuarios.css';

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const res = await api.get('/usuarios');
      setUsuarios(res.data);
    } catch (err) {
      Store.addNotification({ title: "Erro", message: "Falha ao buscar usuários.", type: "danger", container: "top-right", dismiss: { duration: 3000 } });
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, statusAtual) => {
    const novoStatus = !statusAtual;
    try {
      await api.put(`/usuarios/${id}/status`, { ativo: novoStatus });
      Store.addNotification({ title: "Sucesso", message: "Status atualizado.", type: "success", container: "top-right", dismiss: { duration: 3000 } });
      carregarUsuarios();
    } catch (err) {
      Store.addNotification({ title: "Erro", message: "Erro ao atualizar status.", type: "danger", container: "top-right", dismiss: { duration: 3000 } });
    }
  };

  const toggleTipo = async (id, tipoAtual) => {
    const novoTipo = tipoAtual === 'ADMIN' ? 'CLIENTE' : 'ADMIN';
    if (!window.confirm(`Deseja alterar a permissão para ${novoTipo}?`)) return;
    
    try {
      await api.put(`/usuarios/${id}/tipo`, { tipo: novoTipo });
      Store.addNotification({ title: "Sucesso", message: "Permissão atualizada.", type: "success", container: "top-right", dismiss: { duration: 3000 } });
      carregarUsuarios();
    } catch (err) {
      Store.addNotification({ title: "Erro", message: "Erro ao atualizar permissão.", type: "danger", container: "top-right", dismiss: { duration: 3000 } });
    }
  };

  const deletarUsuario = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário permanentemente?')) return;
    
    try {
      await api.delete(`/usuarios/${id}`);
      Store.addNotification({ title: "Sucesso", message: "Usuário excluído.", type: "success", container: "top-right", dismiss: { duration: 3000 } });
      setUsuarios(usuarios.filter(user => user.id !== id));
    } catch (err) {
      Store.addNotification({ title: "Erro", message: "Erro ao excluir usuário.", type: "danger", container: "top-right", dismiss: { duration: 3000 } });
    }
  };

  return (
    <div className="admin-page-container fade-in">
      <div className="admin-header-row">
        <div className="header-text">
          <h2 className="admin-title">Gerenciar Usuários</h2>
          <p className="admin-subtitle">Controle os acessos, bloqueios e permissões dos clientes.</p>
        </div>
      </div>

      <div className="table-card">
        <table className="vetra-table">
          <thead>
            <tr>
              <th width="60">ID</th>
              <th>Nome do Usuário</th>
              <th>E-mail</th>
              <th>Permissão</th>
              <th>Status</th>
              <th align="right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center">Carregando usuários...</td></tr>
            ) : usuarios.length === 0 ? (
              <tr><td colSpan="6" className="text-center empty-state">Nenhum usuário encontrado.</td></tr>
            ) : (
              usuarios.map(user => (
                <tr key={user.id} className={!user.ativo ? 'row-inativo' : ''}>
                  <td className="id-cell">#{user.id}</td>
                  <td>
                    <strong>{user.nome}</strong>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.tipo.toLowerCase()}`}>
                      {user.tipo === 'ADMIN' ? <><FaUserShield /> ADMIN</> : <><FaUser /> CLIENTE</>}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.ativo ? 'confirmado' : 'cancelado'}`}>
                      {user.ativo ? 'ATIVO' : 'BLOQUEADO'}
                    </span>
                  </td>
                  <td align="right">
                    <div className="action-buttons">
                      <button
                        className={`action-btn ${user.tipo === 'ADMIN' ? 'warning' : 'edit'}`}
                        onClick={() => toggleTipo(user.id, user.tipo)}
                        title="Alterar Permissão"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className={`action-btn ${user.ativo ? 'danger' : 'success'}`}
                        onClick={() => toggleStatus(user.id, user.ativo)}
                        title={user.ativo ? "Bloquear Usuário" : "Desbloquear Usuário"}
                      >
                        {user.ativo ? <FaLock /> : <FaLockOpen />}
                      </button>
                      <button
                        className="action-btn danger"
                        onClick={() => deletarUsuario(user.id)}
                        title="Excluir Usuário"
                      >
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
    </div>
  );
};

export default AdminUsuarios;