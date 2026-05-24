import { useNavigate, useLocation } from 'react-router-dom';

export default function NavBar() {
  const nav = useNavigate();
  const loc = useLocation();

  const items = [
    { path: '/home', icon: '🏠', label: 'Início' },
    { path: '/agendamentos', icon: '📋', label: 'Senhas' },
    { path: '/calendario', icon: '📅', label: 'Calendário' },
    { path: '/perfil', icon: '👤', label: 'Perfil' },
  ];

  return (
    <div className="nav-bar">
      {items.map(item => (
        <div
          key={item.path}
          className={`nav-item ${loc.pathname === item.path ? 'active' : ''}`}
          onClick={() => nav(item.path)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
