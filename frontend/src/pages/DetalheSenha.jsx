import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { agendamentosAPI } from '../services/api';
import TopBar from '../components/TopBar';

function fmt(d) {
  if (!d) return '—';
  if (d.includes('-')) { const [y,m,dia] = d.split('-'); return `${dia}/${m}/${y}`; }
  return d;
}

export default function DetalheSenha() {
  const { id } = useParams();
  const nav = useNavigate();
  const [ag, setAg] = useState(null);
  const [modal, setModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [cancelado, setCancelado] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agendamentosAPI.listar()
      .then(r => setAg(r.data.find(a => a.id === parseInt(id))))
      .finally(() => setLoading(false));
  }, [id]);

  const cancelar = async () => {
    setConfirmModal(false);
    await agendamentosAPI.cancelar(id);
    setAg(a => ({ ...a, status: 'CANCELADA' }));
    setCancelado(true);
  };

  const badgeClass = (s) => {
    if (s === 'ATIVA') return 'ativa';
    if (s === 'CANCELADA') return 'cancelada';
    if (s === 'CONCLUIDA') return 'concluida';
    return 'pendente';
  };

  if (loading) return <div className="screen"><div className="loading-screen"><div className="spinner" /></div></div>;
  if (!ag) return <div className="screen"><TopBar title="Senha" backTo="/agendamentos" /><div className="screen-body"><p>Senha não encontrada.</p></div></div>;

  return (
    <div className="screen" style={{ position: 'relative' }}>
      <TopBar title="Sua Senha" backTo="/agendamentos"
        rightEl={<button className="btn-back" onClick={() => nav('/historico')}>Histórico</button>}
      />
      <div className="screen-body">
        <div className="senha-card" style={{ background: ag.status === 'CANCELADA' ? '#5d2b2b' : 'var(--navy)' }}>
          <div className="senha-label">Número da Senha</div>
          <div className="senha-num">{ag.numero_senha}</div>
          <div style={{ marginTop: 8 }}>
            <span className={`badge ${badgeClass(ag.status)}`}>{ag.status}</span>
          </div>
          <div className="senha-updated">Criada em {fmt(ag.criado_em?.substring(0, 10))}</div>
        </div>

        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', padding: '16px', boxShadow: 'var(--shadow-sm)', marginBottom: 16 }}>
          <div className="info-row"><span className="info-label">Paciente</span><span className="info-value">{ag.usuario_nome}</span></div>
          <div className="info-row"><span className="info-label">CPF</span><span className="info-value">{ag.usuario_cpf}</span></div>
          <div className="info-row"><span className="info-label">Nascimento</span><span className="info-value">{fmt(ag.usuario_nasc)}</span></div>
          <div className="info-row"><span className="info-label">Tipo</span><span className="info-value">{ag.tipo_atendimento}</span></div>
          <div className="info-row"><span className="info-label">Serviço</span><span className="info-value">{ag.servico}</span></div>
          <div className="info-row"><span className="info-label">Local</span><span className="info-value">{ag.unidade_nome}</span></div>
          <div className="info-row"><span className="info-label">Data</span><span className="info-value">{fmt(ag.data)}</span></div>
          <div className="info-row"><span className="info-label">Hora</span><span className="info-value">{ag.hora} Horas</span></div>
          {ag.motivo && <div className="info-row"><span className="info-label">Motivo</span><span className="info-value" style={{ maxWidth: '60%', textAlign: 'right' }}>{ag.motivo}</span></div>}
        </div>

        {(ag.status === 'ATIVA' || ag.status === 'PENDENTE') && (
          <button className="btn-primary danger" onClick={() => setModal(true)}>Cancelar Agendamento</button>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <p className="modal-title">Cancelar agendamento?</p>
            <p className="modal-body">Você deseja cancelar a senha Nº {ag.numero_senha} para {ag.servico}?</p>
            <div className="modal-actions">
              <button className="btn-soft" style={{ flex: 1 }} onClick={() => setModal(false)}>Não</button>
              <button className="btn-primary danger" style={{ flex: 1 }} onClick={() => { setModal(false); setConfirmModal(true); }}>Sim, cancelar</button>
            </div>
          </div>
        </div>
      )}

      {confirmModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p className="modal-title">Confirmar cancelamento</p>
            <p className="modal-body">
              Confirmar Cancelamento da senha Nº {ag.numero_senha} para atendimento {ag.servico}, no dia {fmt(ag.data)}?
            </p>
            <div className="modal-actions">
              <button className="btn-soft" style={{ flex: 1 }} onClick={() => setConfirmModal(false)}>Voltar</button>
              <button className="btn-primary danger" style={{ flex: 1 }} onClick={cancelar}>Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {cancelado && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>❌</div>
            <p className="modal-title">Agendamento cancelado</p>
            <p className="modal-body">Sua senha foi cancelada com sucesso.</p>
            <button className="btn-primary" onClick={() => setCancelado(false)}>Ok</button>
          </div>
        </div>
      )}
    </div>
  );
}
