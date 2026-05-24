import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    authAPI.perfil()
      .then(r => setUsuario(r.data))
      .catch(() => setUsuario(null))
      .finally(() => setCarregando(false));
  }, []);

  const login = async (cpf, password) => {
    const r = await authAPI.login({ cpf, password });
    setUsuario(r.data.usuario);
    return r.data.usuario;
  };

  const registro = async (dados) => {
    const r = await authAPI.registro(dados);
    setUsuario(r.data.usuario);
    return r.data.usuario;
  };

  const logout = async () => {
    await authAPI.logout();
    setUsuario(null);
  };

  const atualizarUsuario = (dados) => setUsuario(u => ({ ...u, ...dados }));

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, registro, logout, atualizarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
