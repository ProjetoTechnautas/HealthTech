import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const cookies = document.cookie.split(';');
  for (let c of cookies) {
    const [key, val] = c.trim().split('=');
    if (key === 'csrftoken') {
      config.headers['X-CSRFToken'] = val;
      break;
    }
  }
  return config;
});

export const authAPI = {
  registro: (data) => api.post('/auth/registro/', data),
  login: (data) => api.post('/auth/login/', data),
  logout: () => api.post('/auth/logout/'),
  perfil: () => api.get('/auth/perfil/'),
  atualizarPerfil: (data) => api.patch('/auth/perfil/atualizar/', data),
};

export const agendamentosAPI = {
  listar: () => api.get('/agendamentos/'),
  criar: (data) => api.post('/agendamentos/', data),
  cancelar: (id) => api.post(`/agendamentos/${id}/cancelar/`),
};

export const unidadesAPI = {
  listar: () => api.get('/unidades/'),
};

export const lembretesAPI = {
  listar: () => api.get('/lembretes/'),
  criar: (data) => api.post('/lembretes/', data),
  deletar: (id) => api.delete(`/lembretes/${id}/`),
};

export default api;
