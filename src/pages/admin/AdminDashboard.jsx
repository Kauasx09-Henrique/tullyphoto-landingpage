import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import '../../styles/dashboard.css';

const AdminDashboard = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [kpis, setKpis] = useState({ faturamento: 0, total: 0, ticketMedio: 0 });
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [topClientes, setTopClientes] = useState([]);

  useEffect(() => {
    api.get('/agendamentos')
      .then(res => {
        setAgendamentos(res.data);
        processarDados(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  const processarDados = (dados) => {
    const totalFat = dados.reduce((acc, curr) => acc + parseFloat(curr.preco_total), 0);
    const totalAg = dados.length;
    
    setKpis({
      faturamento: totalFat,
      total: totalAg,
      ticketMedio: totalAg > 0 ? totalFat / totalAg : 0
    });

    const porMes = dados.reduce((acc, curr) => {
      const data = new Date(curr.data_inicio);
      const mes = data.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      
      if (!acc[mes]) acc[mes] = 0;
      acc[mes] += 1;
      return acc;
    }, {});

    const arrayGrafico = Object.keys(porMes).map(key => ({
      name: key.toUpperCase(),
      agendamentos: porMes[key]
    }));

    setDadosGrafico(arrayGrafico);

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

  return (
    <div>
      <div className="admin-header">
        <h2 className="admin-title">Dashboard Geral</h2>
      </div>

      <div className="dashboard-grid">
        <div className="kpi-card">
          <span className="kpi-title">Faturamento Total</span>
          <span className="kpi-value">R$ {kpis.faturamento.toFixed(2)}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-title">Total de Agendamentos</span>
          <span className="kpi-value">{kpis.total}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-title">Ticket Médio</span>
          <span className="kpi-value">R$ {kpis.ticketMedio.toFixed(2)}</span>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h3 className="chart-title">Agendamentos por Mês</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosGrafico}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{fontSize: 12}} />
              <YAxis allowDecimals={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#2C2420', color: '#fff', borderRadius: '4px' }}
                itemStyle={{ color: '#D4AF6E' }}
              />
              <Bar dataKey="agendamentos" fill="#2C2420" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Top 5 Clientes</h3>
          <div className="top-users-list">
            {topClientes.map((cliente, index) => (
              <div key={index} className="user-rank-item">
                <div className="rank-info">
                  <strong>{cliente.nome}</strong>
                  <small>{cliente.total} reservas realizadas</small>
                </div>
                <div className="rank-badge">
                  #{index + 1}
                </div>
              </div>
            ))}
            {topClientes.length === 0 && <p>Nenhum dado ainda.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;