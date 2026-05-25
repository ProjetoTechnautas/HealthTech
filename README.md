# Health Tech — Django + React

App de agendamento digital de senhas para UBS e Secretarias de Saúde, convertido de HTML/JS vanilla para **Django REST Framework + React (Vite)**.

---

## Estrutura do projeto

```
/
├── backend/          # Django (API REST)
│   ├── backend/      # Configurações (settings, urls, wsgi)
│   ├── api/          # App principal
│   │   ├── models.py       # Usuario, UnidadeSaude, Agendamento, Lembrete
│   │   ├── serializers.py  # DRF serializers
│   │   ├── views.py        # Views e ViewSets
│   │   ├── urls.py         # Rotas da API
│   │   ├── admin.py        # Painel admin
│   │   └── fixtures/       # Dados iniciais (4 unidades de saúde)
│   ├── db.sqlite3    # Banco de dados SQLite
│   └── manage.py
│
└── frontend/         # React + Vite
    └── src/
        ├── context/        # AuthContext (sessão do usuário)
        ├── services/       # api.js (axios para Django)
        ├── components/     # NavBar, TopBar
        └── pages/          # Splash, Login, Cadastro, Home,
                            # Agendamentos, NovaSenha, DetalheSenha,
                            # Calendario, Perfil
```

---

## Pré-requisitos

- Python 3.10+
- Node.js 18+
- pip

---

## Como rodar

### 1. Backend (Django)

```bash
cd backend
pip install django djangorestframework django-cors-headers
python manage.py migrate
python manage.py loaddata api/fixtures/initial_data.json
python manage.py runserver
```

O servidor inicia em **http://localhost:8000**

Para criar superusuário (acesso ao admin):
```bash
python manage.py createsuperuser
# admin: http://localhost:8000/admin/
```

### 2. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

O app abre em **http://localhost:5173**

---

## Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/registro/` | Criar conta |
| POST | `/api/auth/login/` | Login (session auth) |
| POST | `/api/auth/logout/` | Logout |
| GET  | `/api/auth/perfil/` | Dados do usuário logado |
| PATCH | `/api/auth/perfil/atualizar/` | Atualizar perfil |
| GET  | `/api/unidades/` | Listar unidades de saúde |
| GET/POST | `/api/agendamentos/` | Listar / criar agendamentos |
| POST | `/api/agendamentos/{id}/cancelar/` | Cancelar agendamento |
| GET/POST | `/api/lembretes/` | Listar / criar lembretes |
| DELETE | `/api/lembretes/{id}/` | Deletar lembrete |

---

## Autenticação

Usa **Session Authentication** do Django. O React envia cookies de sessão e inclui o `X-CSRFToken` automaticamente via interceptor do axios.

