import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { lembretesAPI } from '../services/api';
import NavBar from '../components/NavBar';

export default function Home() {
  const nav = useNavigate();
  const { usuario } = useAuth();
  const [lembretes, setLembretes] = useState([]);

  useEffect(() => {
    lembretesAPI.listar().then(r => setLembretes(r.data)).catch(() => {});
  }, []);

  const primeiroNome = usuario?.nome?.split(' ')[0] || 'Usuário';

  return (
    <div className="screen">
      <div style={{ background: 'var(--navy)', padding: '20px 20px 24px', color: 'white' }}>
        <p style={{ fontSize: 13, opacity: .7, marginBottom: 4 }}>Bem-vindo(a) de volta 👋</p>
        <p style={{ fontSize: 22, fontWeight: 900 }}>Olá, {primeiroNome}</p>
        <p style={{ fontSize: 12, opacity: .6, marginTop: 4 }}>
          {usuario?.ubs_preferida || 'SaúdeFácil'}
        </p>
      </div>

      <div className="screen-body">
        <p className="section-title">O que você precisa?</p>
        <div className="action-grid">
          <div className="action-btn" onClick={() => nav('/agendamentos')}>
            <span className="action-icon">📋</span>
            <span className="action-label">Meus Agendamentos</span>
          </div>
          <div className="action-btn" onClick={() => nav('/nova-senha')}>
            <span className="action-icon">🎫</span>
            <span className="action-label">Solicitar Senha</span>
          </div>
          <div className="action-btn" onClick={() => nav('/calendario')}>
            <span className="action-icon">📅</span>
            <span className="action-label">Calendário</span>
          </div>
          <div className="action-btn" onClick={() => nav('/perfil')}>
            <span className="action-icon">👤</span>
            <span className="action-label">Meu Perfil</span>
          </div>
        </div>

        <p className="section-title">Lembretes</p>
        {lembretes.length === 0
          ? <div className="lembrete-item" style={{ color: 'var(--text-gray)' }}>Nenhum lembrete no momento</div>
          : lembretes.map(l => (
            <div key={l.id} className="lembrete-item">🔖 {l.texto}</div>
          ))
        }
      </div>
      <NavBar />
    </div>
  );
}
