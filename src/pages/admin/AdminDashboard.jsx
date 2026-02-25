import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Store } from 'react-notifications-component';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
    FaWallet, FaCalendarCheck, FaChartLine, FaTrophy, 
    FaCheck, FaTimes, FaClock, FaExclamationCircle 
} from 'react-icons/fa';
import '../../styles/dashboard.css';

const AdminDashboard = () => {
  const [kpis, setKpis] = useState({ faturamento: 0, total: 0, ticketMedio: 0 });
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [topClientes, setTopClientes] = useState([]);
  const [pendentes, setPendentes] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
        const res = await api.get('/agendamentos');
        processarDados(res.data);
        setLoading(false);
    } catch (err) {
        setLoading(false);
        Store.addNotification({
            title: "Erro de Conexão", 
            message: "Falha ao buscar as locações no servidor.", 
            type: "danger", 
            insert: "top", 
            container: "top-right", 
            dismiss: { duration: 3000 }
        });
    }
  };

  const processarDados = (dados) => {
    const listaPendentes = dados.filter(d => d.status === 'PENDENTE');
    setPendentes(listaPendentes);

    const dadosValidos = dados.filter(d => d.status === 'CONFIRMADO' || d.status === 'REALIZADO');
    
    const totalFat = dadosValidos.reduce((acc, curr) => acc + (parseFloat(curr.preco_total) || 0), 0);
    const totalAg = dadosValidos.length;
    
    setKpis({
      faturamento: totalFat,
      total: totalAg,
      ticketMedio: totalAg > 0 ? totalFat / totalAg : 0
    });

    const porMes = dadosValidos.reduce((acc, curr) => {
      const data = new Date(curr.data_inicio);
      const mes = data.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }).toUpperCase().replace('.', '');
      if (!acc[mes]) acc[mes] = 0;
      acc[mes] += 1;
      return acc;
    }, {});

    setDadosGrafico(Object.keys(porMes).map(key => ({ name: key, agendamentos: porMes[key] })));

    const clientes = dadosValidos.reduce((acc, curr) => {
      const nome = curr.usuario_nome || 'Cliente';
      if (!acc[nome]) acc[nome] = 0;
      acc[nome] += 1;
      return acc;
    }, {});

    setTopClientes(Object.keys(clientes).map(key => ({ nome: key, total: clientes[key] })).sort((a, b) => b.total - a.total).slice(0, 4));
  };

  const handleAcaoPendente = async (id, acao) => {
      const novoStatus = acao === 'APROVAR' ? 'CONFIRMADO' : 'CANCELADO';
      
      try {
          await api.put(`/agendamentos/${id}/status`, { status: novoStatus });
          
          setPendentes(prev => prev.filter(p => p.id !== id));

          Store.addNotification({
              title: acao === 'APROVAR' ? "Reserva Aprovada!" : "Reserva Cancelada",
              message: `O agendamento #${id} foi atualizado com sucesso.`,
              type: acao === 'APROVAR' ? "success" : "warning",
              insert: "top",
              container: "top-right",
              dismiss: { duration: 4000 }
          });

          carregarDados();
      } catch (err) {
          Store.addNotification({
            title: "Erro", message: "Não foi possível atualizar o status.", type: "danger", insert: "top", container: "top-right", dismiss: { duration: 3000 }
          });
      }
  };

  const formatCurrency = (value) => {
      const numero = parseFloat(value);
      if (isNaN(numero)) return 'R$ 0,00';
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numero);
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-chart-tooltip">
          <p className="label">{label}</p>
          <p className="intro">{`${payload[0].value} Agendamentos`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) return (
    <div className="loading-state fade-in">
        <div className="loader-ring"></div>
        <p>Analisando dados do estúdio...</p>
    </div>
  );

  return (
    <div className="dashboard-container fade-in" translate="no">
      <div className="admin-header-row">
        <div className="header-text-block">
           <h2 className="admin-title">Painel Geral</h2>
           <p className="admin-subtitle">Bem-vindo(a) ao gerenciamento do Estúdio Vetra.</p>
        </div>
        <div className="date-badge">
           <FaCalendarCheck /> {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="kpi-card">
          <div className="kpi-icon-box gold"><FaWallet /></div>
          <div className="kpi-info">
            <span className="kpi-title">Faturamento</span>
            <span className="kpi-value notranslate">{formatCurrency(kpis.faturamento)}</span>
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-icon-box dark"><FaCalendarCheck /></div>
          <div className="kpi-info">
            <span className="kpi-title">Concluídos</span>
            <span className="kpi-value">{kpis.total}</span>
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-icon-box gray"><FaChartLine /></div>
          <div className="kpi-info">
            <span className="kpi-title">Ticket Médio</span>
            <span className="kpi-value notranslate">{formatCurrency(kpis.ticketMedio)}</span>
          </div>
        </div>
      </div>

      <div className="pending-section">
          <div className="section-header">
              <h3><FaClock className="icon-pulse" /> Solicitações Pendentes</h3>
              {pendentes.length > 0 && <span className="badge-count">{pendentes.length}</span>}
          </div>
          
          <div className="pending-list">
              {pendentes.length === 0 ? (
                  <div className="empty-pending">
                      <FaCheck className="empty-icon" />
                      <p>Sua agenda está limpa! Nenhuma aprovação pendente.</p>
                  </div>
              ) : (
                  pendentes.map(p => (
                      <div className="pending-card" key={p.id}>
                          <div className="pending-main-content">
                              <div className="p-avatar">
                                  {p.usuario_nome ? p.usuario_nome.substring(0,2).toUpperCase() : 'CL'}
                              </div>
                              
                              <div className="p-info">
                                  <h4>{p.usuario_nome || 'Cliente'} <span className="p-id">#{String(p.id).padStart(4, '0')}</span></h4>
                                  <p className="p-space">{p.espaco_nome}</p>
                                  <p className="p-date"><FaCalendarCheck /> {formatDate(p.data_inicio)}</p>
                                  <span className={`p-pay-badge ${p.metodo_pagamento?.toLowerCase()}`}>
                                      {p.metodo_pagamento === 'PIX' && <FaExclamationCircle className="pix-alert"/>} {p.metodo_pagamento}
                                  </span>
                              </div>
                          </div>

                          <div className="pending-side-actions">
                              <div className="p-price notranslate">
                                  {formatCurrency(p.preco_total)}
                              </div>
                              <div className="p-actions">
                                  <button className="btn-reject" onClick={() => handleAcaoPendente(p.id, 'REJEITAR')} title="Recusar">
                                      <FaTimes />
                                  </button>
                                  <button className="btn-approve" onClick={() => handleAcaoPendente(p.id, 'APROVAR')} title="Aprovar">
                                      <FaCheck /> Aprovar
                                  </button>
                              </div>
                          </div>
                      </div>
                  ))
              )}
          </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">Volume Mensal de Agendamentos</h3>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosGrafico} onMouseMove={(_, i) => setActiveIndex(i)} onMouseLeave={() => setActiveIndex(null)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{fill: '#888', fontSize: 12}} tickLine={false} axisLine={false} dy={10} />
                <YAxis allowDecimals={false} tick={{fill: '#888', fontSize: 12}} tickLine={false} axisLine={false} dx={-10}/>
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(212, 175, 110, 0.05)'}} />
                <Bar dataKey="agendamentos" radius={[6, 6, 0, 0]} barSize={40}>
                  {dadosGrafico.map((entry, index) => (
                    <Cell cursor="pointer" fill={index === activeIndex ? '#1A1614' : '#D4AF6E'} key={`cell-${index}`} style={{ transition: 'all 0.3s' }} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="ranking-container">
          <h3 className="chart-title">Top Clientes</h3>
          <div className="top-users-list">
            {topClientes.length === 0 ? (
                <div className="empty-pending" style={{marginTop: '20px', padding: '20px'}}>Nenhum dado registrado.</div>
            ) : (
                topClientes.map((cliente, index) => (
                <div key={index} className="user-rank-item">
                    <div className="rank-left">
                        <div className={`rank-medal rank-${index + 1}`}>
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </div>
                        <div className="rank-avatar">
                            {cliente.nome.substring(0,2).toUpperCase()}
                        </div>
                        <div className="rank-info">
                            <strong>{cliente.nome}</strong>
                            <small>{cliente.total} sessões</small>
                        </div>
                    </div>
                    {index === 0 && <FaTrophy className="trophy-icon" />}
                </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;