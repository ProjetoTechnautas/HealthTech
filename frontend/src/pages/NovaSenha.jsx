import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { unidadesAPI, agendamentosAPI } from '../services/api';
import TopBar from '../components/TopBar';

const SERVICOS = [
  'Consulta Médica Geral', 'Consulta de Enfermagem', 'Coleta de Exames',
  'Vacinação', 'Triagem / Acolhimento', 'Consulta Psicológica', 'Odontologia',
];

export default function NovaSenha() {
  const nav = useNavigate();
  const { usuario } = useAuth();
  const [passo, setPasso] = useState('local'); // local | tipo | solicitar
  const [unidades, setUnidades] = useState([]);
  const [unidadeSel, setUnidadeSel] = useState(null);
  const [tipo, setTipo] = useState('');
  const [servicoSel, setServicoSel] = useState('');
  const [servicoOutro, setServicoOutro] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('08:00');
  const [motivo, setMotivo] = useState('');
  const [confirmado, setConfirmado] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(null);

  useEffect(() => {
    unidadesAPI.listar().then(r => setUnidades(r.data));
  }, []);

  const selecionarLocal = (u) => { setUnidadeSel(u); setPasso('tipo'); };
  const selecionarTipo = (t) => { setTipo(t); setPasso('solicitar'); };

  const solicitar = async () => {
    const servico = servicoSel || servicoOutro;
    if (!servico) { setErro('Selecione o serviço desejado.'); return; }
    if (!data) { setErro('Selecione a data desejada.'); return; }
    if (!confirmado) { setErro('Confirme seus dados antes de solicitar.'); return; }
    setErro(''); setLoading(true);
    try {
      const r = await agendamentosAPI.criar({
        unidade: unidadeSel.id,
        tipo_atendimento: tipo,
        servico,
        data,
        hora: hora.length === 5 ? hora + ':00' : hora,
        motivo,
      });
      setSucesso(r.data);
    } catch (e) {
      setErro('Erro ao solicitar senha. Tente novamente.');
    } finally { setLoading(false); }
  };

  if (sucesso) return (
    <div className="screen">
      <div className="screen-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
        <p style={{ fontSize: 20, fontWeight: 900, color: 'var(--navy)', marginBottom: 8 }}>Solicitação concluída!</p>
        <p style={{ fontSize: 14, color: 'var(--text-gray)', marginBottom: 8 }}>Sua senha foi gerada com sucesso.</p>
        <div style={{ background: 'var(--navy)', borderRadius: 16, padding: '20px 40px', margin: '16px 0', color: 'white' }}>
          <p style={{ fontSize: 13, opacity: .7 }}>Senha</p>
          <p style={{ fontSize: 48, fontWeight: 900 }}>{sucesso.numero_senha}</p>
          <p style={{ fontSize: 13, opacity: .7 }}>{sucesso.status}</p>
        </div>
        <div style={{ display: 'flex', gap: 10, width: '100%', marginTop: 8 }}>
          <button className="btn-soft" style={{ flex: 1 }} onClick={() => nav('/agendamentos')}>Ver senhas</button>
          <button className="btn-primary" style={{ flex: 1 }} onClick={() => nav(`/senha/${sucesso.id}`)}>Ver detalhes</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="screen">
      <TopBar
        title={passo === 'local' ? 'Escolher Local' : passo === 'tipo' ? 'Tipo de Atendimento' : 'Solicitar Senha'}
        backTo={passo === 'local' ? '/home' : undefined}
      />
      <div className="screen-body">
        {erro && <div className="error-msg">{erro}</div>}

        {passo === 'local' && (
          <>
            <p className="form-section-title">Onde deseja ser atendido?</p>
            {unidades.map(u => (
              <div key={u.id} className="local-card" onClick={() => selecionarLocal(u)}>
                <span className="local-icon">{u.tipo === 'UBS' ? '🏥' : '🏛️'}</span>
                <div>
                  <div className="local-name">{u.nome}</div>
                  <div className="local-addr">{u.endereco}</div>
                </div>
              </div>
            ))}
          </>
        )}

        {passo === 'tipo' && (
          <>
            <p className="form-section-title">Tipo de atendimento em<br /><span style={{ color: 'var(--navy)' }}>{unidadeSel?.nome}</span></p>
            <div className="tipo-grid">
              <div className="tipo-card" onClick={() => selecionarTipo('PRESENCIAL')}>
                <div className="tipo-icon">🏥</div>
                <div className="tipo-label">Presencial</div>
              </div>
              <div className="tipo-card" onClick={() => selecionarTipo('TELEMEDICINA')}>
                <div className="tipo-icon">📱</div>
                <div className="tipo-label">Telemedicina</div>
              </div>
            </div>
          </>
        )}

        {passo === 'solicitar' && (
          <>
            <p className="form-section-title">Selecione o serviço</p>
            <div className="servico-list">
              {SERVICOS.map(s => (
                <div key={s} className="radio-item" onClick={() => setServicoSel(s)}>
                  <div className={`radio-circle ${servicoSel === s ? 'checked' : ''}`} />
                  <span className="radio-label">{s}</span>
                </div>
              ))}
              <div className="form-group" style={{ marginTop: 8 }}>
                <label className="form-label">Outro serviço</label>
                <input className="form-input" placeholder="Descreva o serviço..." value={servicoOutro}
                  onChange={e => { setServicoOutro(e.target.value); setServicoSel(''); }} />
              </div>
            </div>

            <p className="section-title">Data e hora desejadas</p>
            <div className="form-row" style={{ marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">Data</label>
                <input className="form-input" type="date" value={data} onChange={e => setData(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Hora</label>
                <input className="form-input" type="time" value={hora} onChange={e => setHora(e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Motivo (opcional)</label>
              <input className="form-input" placeholder="Descreva brevemente o motivo..." value={motivo} onChange={e => setMotivo(e.target.value)} />
            </div>

            <p className="section-title">Seus dados de confirmação</p>
            <div className="form-group">
              <label className="form-label">Nome</label>
              <input className="form-input" value={usuario?.nome || ''} readOnly style={{ background: 'var(--bg2)' }} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">CPF</label>
                <input className="form-input" value={usuario?.cpf || ''} readOnly style={{ background: 'var(--bg2)' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Nascimento</label>
                <input className="form-input" value={usuario?.data_nascimento || ''} readOnly style={{ background: 'var(--bg2)' }} />
              </div>
            </div>

            <div className="check-row" style={{ marginBottom: 20 }} onClick={() => setConfirmado(c => !c)}>
              <div className={`check-box ${confirmado ? 'checked' : ''}`} />
              <span style={{ fontSize: 13, color: 'var(--text-gray)', lineHeight: 1.5 }}>
                Confirmo que os dados acima estão corretos e estou ciente das regras de agendamento.
              </span>
            </div>

            <button className="btn-primary" onClick={solicitar} disabled={loading || !confirmado}>
              {loading ? 'Solicitando...' : 'Solicitar Senha'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
