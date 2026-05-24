import { useState } from 'react';
import { lembretesAPI } from '../services/api';
import TopBar from '../components/TopBar';
import NavBar from '../components/NavBar';

const DIAS = ['Dom.','Seg.','Ter.','Qua.','Qui.','Sex.','Sáb'];
const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

const SERVICOS_DEMO = [
  {dia:4,prof:'Dr. Carlos Silva'},{dia:7,prof:'Enf. Maria Souza'},
  {dia:11,prof:'Dr. Carlos Silva'},{dia:13,prof:'Psic. Ana Lima'},
  {dia:21,prof:'Dr. Carlos Silva'},{dia:22,prof:'Enf. Maria Souza'},
  {dia:26,prof:'Dr. João Neto'},{dia:28,prof:'Dent. Paula Rios'},
];

export default function Calendario() {
  const now = new Date(2026, 4, 1);
  const mes = now.getMonth(); const ano = now.getFullYear();
  const [selecionado, setSelecionado] = useState(23);
  const [modalLembrete, setModalLembrete] = useState(null);
  const [lembreteSalvo, setLembreteSalvo] = useState(false);

  const primeiroDia = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const disponiveis = SERVICOS_DEMO.map(s => s.dia);

  const salvarLembrete = async () => {
    try {
      await lembretesAPI.criar({ texto: modalLembrete, data_referencia: `${ano}-${String(mes+1).padStart(2,'0')}-01` });
      setModalLembrete(null); setLembreteSalvo(true);
    } catch { setModalLembrete(null); setLembreteSalvo(true); }
  };

  const cells = [];
  for (let i = 0; i < primeiroDia; i++) cells.push(<div key={`e${i}`} className="cal-day empty" />);
  for (let d = 1; d <= diasNoMes; d++) {
    const dow = new Date(ano, mes, d).getDay();
    const isWeekend = dow === 0 || dow === 6;
    const isAvail = disponiveis.includes(d);
    const isSel = d === selecionado;
    let cls = 'cal-day';
    if (isSel) cls += ' selected';
    else if (isWeekend) cls += ' weekend';
    else if (isAvail) cls += ' available';
    else cls += ' normal';
    cells.push(<div key={d} className={cls} onClick={() => setSelecionado(d)}>{d}</div>);
  }

  return (
    <div className="screen" style={{ position: 'relative' }}>
      <TopBar title="Calendário" backTo="/home" />
      <div className="screen-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontWeight: 900, fontSize: 16, color: 'var(--navy)' }}>{MESES[mes]} {ano}</span>
        </div>

        <div className="cal-grid">
          {DIAS.map(d => <div key={d} className="cal-day-name">{d}</div>)}
          {cells}
        </div>

        <p className="section-title">Serviços disponíveis</p>
        {SERVICOS_DEMO.map(s => {
          const mesStr = String(mes + 1).padStart(2,'0');
          const txt = `Dia ${String(s.dia).padStart(2,'0')}/${mesStr} — ${s.prof}`;
          return (
            <div key={s.dia} className="service-list-item" onClick={() => setModalLembrete(txt)}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{txt}</span>
              <span>🔖</span>
            </div>
          );
        })}
      </div>
      <NavBar />

      {modalLembrete && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p className="modal-title">Salvar lembrete?</p>
            <p className="modal-body">{modalLembrete}</p>
            <div className="modal-actions">
              <button className="btn-soft" style={{ flex: 1 }} onClick={() => setModalLembrete(null)}>Cancelar</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={salvarLembrete}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      {lembreteSalvo && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔖</div>
            <p className="modal-title">Lembrete salvo!</p>
            <p className="modal-body">Você pode ver seus lembretes na tela inicial.</p>
            <button className="btn-primary" onClick={() => setLembreteSalvo(false)}>Ok</button>
          </div>
        </div>
      )}
    </div>
  );
}
