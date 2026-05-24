import { useNavigate } from 'react-router-dom';

export default function TopBar({ title, backTo, rightEl }) {
  const nav = useNavigate();
  return (
    <div className="topbar">
      {backTo ? (
        <button className="btn-back" onClick={() => nav(backTo)}>‹ Voltar</button>
      ) : <span />}
      <span className="topbar-title">{title}</span>
      {rightEl || <span />}
    </div>
  );
}
