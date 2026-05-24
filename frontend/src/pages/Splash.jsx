import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function Splash() {
  const nav = useNavigate();
  const { usuario, carregando } = useAuth();

  useEffect(() => {
    if (!carregando && usuario) nav('/home');
  }, [carregando, usuario]);

  if (carregando) return (
    <div className="screen">
      <div className="loading-screen">
        <div className="spinner" />
        <p style={{ color: 'var(--navy)', fontWeight: 700 }}>Carregando...</p>
      </div>
    </div>
  );

  return (
    <div className="screen">
      <div className="splash">
        <div className="splash-blob1" />
        <div className="splash-blob2" />
        <div className="splash-logo">HT</div>
        <p className="splash-tagline">Healtech Tech</p>
        <p className="splash-sub">Agendamento digital de senhas para UBS e Secretarias de Saúde</p>
        <div className="splash-buttons">
          <button className="btn-primary" onClick={() => nav('/cadastro')}>Criar conta</button>
          <button className="btn-primary" onClick={() => nav('/login')}>Entrar</button>
        </div>
      </div>
    </div>
  );
}
