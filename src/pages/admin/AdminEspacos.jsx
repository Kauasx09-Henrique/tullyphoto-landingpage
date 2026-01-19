import React, { useState, useEffect } from 'react';
import { Store } from 'react-notifications-component';
import api from '../../services/api';

const AdminEspacos = () => {
  const [espacos, setEspacos] = useState([]);
  const [novoEspaco, setNovoEspaco] = useState({ nome: '', descricao: '', preco_por_hora: '' });
  const [editingId, setEditingId] = useState(null);

  const loadEspacos = async () => {
    try {
      const res = await api.get('/espacos');
      setEspacos(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { loadEspacos(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/espacos/${editingId}`, { ...novoEspaco, ativo: true });
        Store.addNotification({ title: "Atualizado", message: "Espaço editado com sucesso!", type: "info", container: "top-right", dismiss: { duration: 3000 } });
      } else {
        await api.post('/espacos', novoEspaco);
        Store.addNotification({ title: "Sucesso", message: "Espaço criado!", type: "success", container: "top-right", dismiss: { duration: 3000 } });
      }
      
      setNovoEspaco({ nome: '', descricao: '', preco_por_hora: '' });
      setEditingId(null);
      loadEspacos();
    } catch (err) {
      alert("Erro ao salvar");
    }
  };

  const handleEdit = (espaco) => {
    setNovoEspaco({
      nome: espaco.nome,
      descricao: espaco.descricao,
      preco_por_hora: espaco.preco_por_hora
    });
    setEditingId(espaco.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setNovoEspaco({ nome: '', descricao: '', preco_por_hora: '' });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Tem certeza que deseja excluir?")) return;
    try {
      await api.delete(`/espacos/${id}`);
      loadEspacos();
    } catch (err) {
      alert("Erro ao deletar");
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h2 className="admin-title">Gerenciar Espaços</h2>
      </div>

      <div className="admin-form-card">
        <h3>{editingId ? 'Editar Cenário' : 'Adicionar Novo Cenário'}</h3>
        <form onSubmit={handleSubmit}>
          <input 
            className="admin-input" 
            placeholder="Nome do Espaço (ex: Estúdio Garden)" 
            value={novoEspaco.nome}
            onChange={e => setNovoEspaco({...novoEspaco, nome: e.target.value})}
            required
          />
          <input 
            className="admin-input" 
            placeholder="Descrição curta" 
            value={novoEspaco.descricao}
            onChange={e => setNovoEspaco({...novoEspaco, descricao: e.target.value})}
          />
          <input 
            className="admin-input" 
            type="number" 
            placeholder="Preço por Hora (R$)" 
            value={novoEspaco.preco_por_hora}
            onChange={e => setNovoEspaco({...novoEspaco, preco_por_hora: e.target.value})}
            required
          />
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-add">
                {editingId ? 'Salvar Alterações' : 'Cadastrar Espaço'}
            </button>
            
            {editingId && (
                <button type="button" onClick={handleCancelEdit} style={{ padding: '10px', cursor: 'pointer', background: '#ccc', border: 'none', borderRadius: '4px' }}>
                    Cancelar
                </button>
            )}
          </div>
        </form>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Preço/h</th>
            <th style={{ textAlign: 'center' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {espacos.map(espaco => (
            <tr key={espaco.id}>
              <td>#{espaco.id}</td>
              <td>{espaco.nome}</td>
              <td>R$ {espaco.preco_por_hora}</td>
              <td style={{ textAlign: 'center' }}>
                <button 
                    onClick={() => handleEdit(espaco)} 
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem', marginRight: '10px' }}
                    title="Editar"
                >
                    ✏️
                </button>
                <button 
                    onClick={() => handleDelete(espaco.id)} 
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem' }}
                    title="Excluir"
                >
                    🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminEspacos;