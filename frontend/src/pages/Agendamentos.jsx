import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { agendamentosAPI } from '../services/api';
import TopBar from '../components/TopBar';
import NavBar from '../components/NavBar';

function formatData(d) {
  if (!d) return '—';
  const [y, m, dia] = d.split('-');
  return `${dia}/${m}/${y}`;
}

export default function Agendamentos() {
  const nav = useNavigate();
  const [tab, setTab] = useState('ativas');
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agendamentosAPI.listar()
      .then(r => setAgendamentos(r.data))
      .finally(() => setLoading(false));
  }, []);

  const ativas = agendamentos.filter(a => a.status === 'ATIVA' || a.status === 'PENDENTE');
  const historico = agendamentos;

  const lista = tab === 'ativas' ? ativas : historico;

  const badgeClass = (s) => {
    if (s === 'ATIVA') return 'ativa';
    if (s === 'CANCELADA') return 'cancelada';
    if (s === 'CONCLUIDA') return 'concluida';
    return 'pendente';
  };

  return (
    <div className="screen">
      <TopBar title="Minhas Senhas" backTo="/home" />
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(13,27,94,.08)' }}>
        {['ativas', 'historico'].map(t => (
          <button key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '12px', border: 'none', background: 'none',
              fontWeight: 800, fontSize: 13, cursor: 'pointer',
              color: tab === t ? 'var(--navy)' : 'var(--text-gray)',
              borderBottom: tab === t ? '2px solid var(--navy)' : '2px solid transparent',
            }}>
            {t === 'ativas' ? 'Ativas' : 'Histórico'}
          </button>
        ))}
      </div>
      <div className="screen-body">
        {loading ? (
          <div style={{ textAlign: 'center', paddingTop: 40 }}><div className="spinner" style={{ margin: 'auto' }} /></div>
        ) : lista.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>{tab === 'ativas' ? 'Nenhum agendamento ativo.' : 'Nenhum histórico ainda.'}</p>
            {tab === 'ativas' && (
              <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => nav('/nova-senha')}>
                Solicitar senha
              </button>
            )}
          </div>
        ) : (
          lista.map(ag => (
            <div key={ag.id} className="ag-card" onClick={() => nav(`/senha/${ag.id}`)}>
              <div className="ag-header">
                <span className="ag-number">Senha {ag.numero_senha}</span>
                <span className={`badge ${badgeClass(ag.status)}`}>{ag.status.charAt(0) + ag.status.slice(1).toLowerCase()}</span>
              </div>
              <div className="ag-service">{ag.servico}</div>
              <div className="ag-date">{ag.unidade_nome} · {formatData(ag.data)} às {ag.hora}</div>
            </div>
          ))
        )}
      </div>
      <NavBar />
    </div>
  );
}
