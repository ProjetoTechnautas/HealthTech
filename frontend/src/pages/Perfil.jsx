import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import TopBar from '../components/TopBar';
import NavBar from '../components/NavBar';

export default function Perfil() {
  const nav = useNavigate();
  const { usuario, logout, atualizarUsuario } = useAuth();
  const [editando, setEditando] = useState(false);
  const [dados, setDados] = useState({ ...usuario });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const set = (k, v) => setDados(d => ({ ...d, [k]: v }));

  const salvar = async () => {
    setLoading(true); setMsg('');
    try {
      const r = await authAPI.atualizarPerfil(dados);
      atualizarUsuario(r.data);
      setMsg('Perfil atualizado!');
      setEditando(false);
    } catch { setMsg('Erro ao salvar.'); }
    finally { setLoading(false); }
  };

  const fazerLogout = async () => {
    await logout();
    nav('/');
  };

  const iniciais = usuario?.nome?.split(' ').map(n => n[0]).slice(0, 2).join('') || 'U';

  return (
    <div className="screen">
      <TopBar title="Meu Perfil" backTo="/home"
        rightEl={
          <button className="btn-back" onClick={() => setEditando(e => !e)}>
            {editando ? 'Cancelar' : 'Editar'}
          </button>
        }
      />
      <div className="screen-body">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24, padding: '16px 0' }}>
          <div className="avatar-circle">{iniciais}</div>
          <p style={{ fontWeight: 900, fontSize: 18, color: 'var(--navy)', marginTop: 8 }}>{usuario?.nome}</p>
          <p style={{ fontSize: 13, color: 'var(--text-gray)' }}>CPF: {usuario?.cpf}</p>
        </div>

        {msg && <div style={{ background: '#dcfce7', color: '#15803d', padding: 10, borderRadius: 8, marginBottom: 12, fontWeight: 700, fontSize: 13 }}>{msg}</div>}

        {editando ? (
          <>
            {[
              ['nome', 'Nome completo', 'text'],
              ['telefone', 'Telefone', 'text'],
              ['email', 'E-mail', 'email'],
              ['cidade', 'Cidade', 'text'],
              ['ubs_preferida', 'UBS de preferência', 'text'],
            ].map(([k, label, type]) => (
              <div className="form-group" key={k}>
                <label className="form-label">{label}</label>
                <input className="form-input" type={type} value={dados[k] || ''} onChange={e => set(k, e.target.value)} />
              </div>
            ))}
            <button className="btn-primary" onClick={salvar} disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </>
        ) : (
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', padding: '16px', boxShadow: 'var(--shadow-sm)', marginBottom: 16 }}>
            {[
              ['Nome', usuario?.nome],
              ['CPF', usuario?.cpf],
              ['Telefone', usuario?.telefone || '—'],
              ['E-mail', usuario?.email || '—'],
              ['Cidade', usuario?.cidade || '—'],
              ['UBS', usuario?.ubs_preferida || '—'],
            ].map(([label, value]) => (
              <div className="info-row" key={label}>
                <span className="info-label">{label}</span>
                <span className="info-value">{value}</span>
              </div>
            ))}
          </div>
        )}

        <button className="btn-soft" style={{ marginTop: 8, width: '100%', color: 'var(--red)', borderColor: 'var(--red)' }} onClick={fazerLogout}>
          Sair da conta
        </button>
      </div>
      <NavBar />
    </div>
  );
}
