import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css/animate.min.css';

// Pages Cliente
import Home from './pages/Home';
import Agendamento from './pages/Agendamento';
import Portfolio from './pages/Portfolio';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import MeusAgendamentos from './pages/meusAgendamentos.jsx';


// Pages Admin
import AdminLayout from './pages/admin/AdminLayout';
import AdminEspacos from './pages/admin/AdminEspacos';
import AdminAgenda from './pages/admin/AdminAgenda';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Information from './components/Information';

function App() {
  return (
    <BrowserRouter>
      <ReactNotifications />

      <Routes>

        <Route path="/" element={<><Header /><Home /><Footer /></>} />
        <Route path="/portfolio" element={<><Header /><Portfolio /><Footer /></>} />
        <Route path="/agendamento" element={<><Header /><Agendamento /><Footer /></>} />
        <Route path="/login" element={<><Header /><Login /><Footer /></>} />
        <Route path="/meus-agendamentos" element={<MeusAgendamentos />} />
        <Route path="/cadastro" element={<><Header /><Cadastro /><Footer /></>} />
        <Route path="/informacoes" element={<Information />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="espacos" element={<AdminEspacos />} />
          <Route path="agenda" element={<AdminAgenda />} />
          <Route path="usuarios" element={<AdminUsers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;