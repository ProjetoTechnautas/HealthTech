import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TopBar from '../components/TopBar';

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!cpf) { setErro('Digite seu CPF.'); return; }
    setErro(''); setLoading(true);
    try {
      await login(cpf, password);
      nav('/home');
    } catch (e) {
      setErro(e.response?.data?.error || 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen">
      <TopBar title="Entrar" backTo="/" />
      <div className="screen-body">
        <p className="form-section-title" style={{ marginTop: 12 }}>Acesse sua conta</p>
        {erro && <div className="error-msg">{erro}</div>}
        <div className="form-group">
          <label className="form-label">CPF</label>
          <input className="form-input" type="text" placeholder="000.000.000-00"
            value={cpf} onChange={e => setCpf(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Senha</label>
          <input className="form-input" type="password" placeholder="Digite sua senha"
            value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>
        <div style={{ marginTop: 24 }}>
          <button className="btn-primary" onClick={handleLogin} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--text-gray)' }}>
          Não tem conta?{' '}
          <span style={{ color: 'var(--navy)', fontWeight: 700, cursor: 'pointer' }}
            onClick={() => nav('/cadastro')}>
            Criar conta
          </span>
        </p>
      </div>
    </div>
  );
}
