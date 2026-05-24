import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Splash from './pages/Splash';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Home from './pages/Home';
import Agendamentos from './pages/Agendamentos';
import NovaSenha from './pages/NovaSenha';
import DetalheSenha from './pages/DetalheSenha';
import Calendario from './pages/Calendario';
import Perfil from './pages/Perfil';

function RotaProtegida({ children }) {
  const { usuario, carregando } = useAuth();
  if (carregando) return null;
  return usuario ? children : <Navigate to="/" />;
}

function AppRoutes() {
  return (
    <div className="phone-frame">
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/home" element={<RotaProtegida><Home /></RotaProtegida>} />
        <Route path="/agendamentos" element={<RotaProtegida><Agendamentos /></RotaProtegida>} />
        <Route path="/nova-senha" element={<RotaProtegida><NovaSenha /></RotaProtegida>} />
        <Route path="/senha/:id" element={<RotaProtegida><DetalheSenha /></RotaProtegida>} />
        <Route path="/calendario" element={<RotaProtegida><Calendario /></RotaProtegida>} />
        <Route path="/perfil" element={<RotaProtegida><Perfil /></RotaProtegida>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
