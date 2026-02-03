import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { FaWallet, FaCalendarCheck, FaChartLine, FaTrophy, FaUserCircle } from 'react-icons/fa';
import '../../styles/dashboard.css';

const AdminDashboard = () => {
  const [kpis, setKpis] = useState({ faturamento: 0, total: 0, ticketMedio: 0 });
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [topClientes, setTopClientes] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    api.get('/agendamentos')
      .then(res => processarDados(res.data))
      .catch(err => console.error(err));
  }, []);

  const processarDados = (dados) => {
    // 1. KPIs
    const totalFat = dados.reduce((acc, curr) => acc + parseFloat(curr.preco_total), 0);
    const totalAg = dados.length;
    
    setKpis({
      faturamento: totalFat,
      total: totalAg,
      ticketMedio: totalAg > 0 ? totalFat / totalAg : 0
    });

    // 2. Gráfico (Agrupado por Mês)
    const porMes = dados.reduce((acc, curr) => {
      const data = new Date(curr.data_inicio);
      const mes = data.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }).toUpperCase();
      // Remove o ponto final que alguns browsers colocam (ex: jan.)
      const mesLimpo = mes.replace('.', '');
      
      if (!acc[mesLimpo]) acc[mesLimpo] = 0;
      acc[mesLimpo] += 1;
      return acc;
    }, {});

    const arrayGrafico = Object.keys(porMes).map(key => ({
      name: key,
      agendamentos: porMes[key]
    }));

    setDadosGrafico(arrayGrafico);

    // 3. Top Clientes
    const clientes = dados.reduce((acc, curr) => {
      const nome = curr.usuario_nome;
      if (!acc[nome]) acc[nome] = 0;
      acc[nome] += 1;
      return acc;
    }, {});

    const arrayClientes = Object.keys(clientes)
      .map(key => ({ nome: key, total: clientes[key] }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    setTopClientes(arrayClientes);
  };

  // Formata Moeda (R$)
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Tooltip Customizado do Gráfico
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

  const onBarEnter = (_, index) => setActiveIndex(index);
  const onBarLeave = () => setActiveIndex(null);

  return (
    <div className="dashboard-container fade-in">
      {/* HEADER */}
      <div className="admin-header-row">
        <div>
           <h2 className="admin-title">Dashboard Geral</h2>
           <p className="admin-subtitle">Visão geral de performance e resultados.</p>
        </div>
        <div className="date-badge">
           {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      {/* KPIS CARDS */}
      <div className="dashboard-grid">
        <div className="kpi-card">
          <div className="kpi-icon-box gold"><FaWallet /></div>
          <div className="kpi-info">
            <span className="kpi-title">Faturamento Total</span>
            <span className="kpi-value">{formatCurrency(kpis.faturamento)}</span>
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-icon-box dark"><FaCalendarCheck /></div>
          <div className="kpi-info">
            <span className="kpi-title">Agendamentos</span>
            <span className="kpi-value">{kpis.total}</span>
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-icon-box gray"><FaChartLine /></div>
          <div className="kpi-info">
            <span className="kpi-title">Ticket Médio</span>
            <span className="kpi-value">{formatCurrency(kpis.ticketMedio)}</span>
          </div>
        </div>
      </div>

      {/* SEÇÃO PRINCIPAL (GRÁFICO + RANKING) */}
      <div className="charts-section">
        
        {/* GRÁFICO */}
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">Volume Mensal</h3>
          </div>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <BarChart data={dadosGrafico} onMouseMove={onBarEnter} onMouseLeave={onBarLeave}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis 
                    dataKey="name" 
                    tick={{fill: '#888', fontSize: 12}} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                />
                <YAxis 
                    allowDecimals={false} 
                    tick={{fill: '#888', fontSize: 12}} 
                    tickLine={false} 
                    axisLine={false} 
                />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                <Bar dataKey="agendamentos" radius={[6, 6, 0, 0]} barSize={45}>
                  {dadosGrafico.map((entry, index) => (
                    <Cell 
                        cursor="pointer" 
                        fill={index === activeIndex ? '#2C2420' : '#D4AF6E'} 
                        key={`cell-${index}`} 
                        style={{ transition: 'all 0.3s ease' }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RANKING CLIENTES */}
        <div className="ranking-container">
          <h3 className="chart-title">Top Clientes</h3>
          <div className="top-users-list">
            {topClientes.length === 0 ? (
                <p className="no-data">Nenhum dado registrado.</p>
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
                            <small>{cliente.total} reservas</small>
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