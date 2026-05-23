
// ══════════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════════
const state = {
  usuario: null,
  localSelecionado: '',
  tipoAtendimento: '',
  senhas: [],
  lembretes: [],
  lembreteTemp: null,
  confirmacaoChecked: false,
};

// ══════════════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════════════
function goTo(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) target.classList.add('active');
  // scroll to top
  const body = target && target.querySelector('.screen-body');
  if (body) body.scrollTop = 0;
}

// ══════════════════════════════════════════════════
// AUTH
// ══════════════════════════════════════════════════
function irParaCadastro2() {
  const nome = document.getElementById('cad-nome').value.trim();
  const cpf = document.getElementById('cad-cpf').value.trim();
  if (!nome || !cpf) { alert('Por favor, preencha Nome e CPF.'); return; }
  goTo('screen-cadastro2');
}

function concluirCadastro() {
  const cidade = document.getElementById('cad-cidade').value.trim();
  if (!cidade) { alert('Por favor, preencha sua cidade.'); return; }
  state.usuario = {
    nome: document.getElementById('cad-nome').value.trim(),
    nasc: document.getElementById('cad-nasc').value,
    cpf: document.getElementById('cad-cpf').value.trim(),
    tel: document.getElementById('cad-tel').value.trim(),
    email: document.getElementById('cad-email').value.trim(),
    pass: document.getElementById('cad-pass').value,
    rua: document.getElementById('cad-rua').value.trim(),
    bairro: document.getElementById('cad-bairro').value.trim(),
    num: document.getElementById('cad-num').value.trim(),
    estado: document.getElementById('cad-estado').value.trim(),
    cidade,
    comp: document.getElementById('cad-comp').value.trim(),
    ubs: document.getElementById('cad-ubs').value,
  };
  entrarNaHome();
}

function fazerLogin() {
  const cpf = document.getElementById('login-cpf').value.trim();
  if (!cpf) { alert('Digite seu CPF.'); return; }
  // Demo: aceita qualquer CPF se não há usuário cadastrado
  if (!state.usuario) {
    state.usuario = {
      nome: 'Usuário Demo',
      nasc: '01/01/1990',
      cpf: cpf,
      tel: '',
      email: '',
      ubs: 'UBS Centro',
    };
  }
  entrarNaHome();
}

function entrarNaHome() {
  const u = state.usuario;
  document.getElementById('home-greeting').textContent = `Olá, ${u.nome.split(' ')[0]}`;
  // Perfil
  document.getElementById('perfil-nome').value = u.nome;
  document.getElementById('perfil-email').value = u.email || '—';
  document.getElementById('perfil-tel').value = u.tel || '—';
  document.getElementById('perfil-ubs').value = u.ubs || '—';
  document.getElementById('perfil-nome-display').textContent = u.nome;
  document.getElementById('perfil-cpf-display').textContent = 'CPF: ' + u.cpf;
  renderMeusAgendamentos();
  goTo('screen-home');
}

function sair() {
  state.usuario = null;
  state.senhas = [];
  state.lembretes = [];
  goTo('screen-splash');
}

// ══════════════════════════════════════════════════
// AGENDAMENTO FLOW
// ══════════════════════════════════════════════════
function selecionarLocal(local) {
  state.localSelecionado = local;
  document.getElementById('tipo-local-label').textContent = local;
  goTo('screen-tipo');
}

function selecionarTipo(tipo) {
  state.tipoAtendimento = tipo;
  // preencher confirmação com dados do usuário
  const u = state.usuario;
  document.getElementById('sol-nome-conf').value = u.nome;
  document.getElementById('sol-nasc-conf').value = formatDate(u.nasc);
  document.getElementById('sol-cpf-conf').value = u.cpf;
  // reset radio
  document.querySelectorAll('.radio-circle').forEach(r => r.classList.remove('checked'));
  state.confirmacaoChecked = false;
  document.getElementById('chk-confirma').classList.remove('checked');
  document.getElementById('btn-solicitar').disabled = true;
  document.getElementById('btn-solicitar').style.opacity = '0.6';
  goTo('screen-solicitar');
}

// Radio de serviço
document.querySelectorAll('.radio-circle[data-val]').forEach(circle => {
  circle.addEventListener('click', function() {
    document.querySelectorAll('.radio-circle[data-val]').forEach(r => r.classList.remove('checked'));
    this.classList.add('checked');
  });
});

function toggleConfirma() {
  state.confirmacaoChecked = !state.confirmacaoChecked;
  const chk = document.getElementById('chk-confirma');
  if (state.confirmacaoChecked) chk.classList.add('checked');
  else chk.classList.remove('checked');
  const btn = document.getElementById('btn-solicitar');
  btn.disabled = !state.confirmacaoChecked;
  btn.style.opacity = state.confirmacaoChecked ? '1' : '0.6';
}

function solicitarSenha() {
  const servicoEl = document.querySelector('.radio-circle.checked');
  const servicoOutro = document.getElementById('servico-outro').value.trim();
  const servico = servicoEl ? servicoEl.dataset.val : (servicoOutro || null);
  if (!servico) { alert('Selecione o serviço desejado.'); return; }
  const data = document.getElementById('sol-data').value;
  const hora = document.getElementById('sol-hora').value;
  if (!data) { alert('Selecione a data desejada.'); return; }

  // calcular próximo número de senha do dia
  const senhasNoDia = state.senhas.filter(s => s.data === data && s.local === state.localSelecionado);
  const proximoNum = String(senhasNoDia.length + 1).padStart(3, '0');

  const novaSenha = {
    id: Date.now(),
    numero: proximoNum,
    servico,
    local: state.localSelecionado,
    tipo: state.tipoAtendimento,
    data,
    hora: hora || '08:00',
    status: 'Ativa',
    criadaEm: new Date().toLocaleDateString('pt-BR'),
    motivo: document.getElementById('sol-motivo').value.trim(),
  };
  state.senhas.push(novaSenha);
  state.senhaAtual = novaSenha;
  renderMeusAgendamentos();
  mostrarModalSucesso();
}

function mostrarModalSucesso() {
  // criar modal de sucesso dinâmico
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay center';
  overlay.innerHTML = `
    <div class="modal-box center-box">
      <p class="modal-title">Solicitação concluída com sucesso!</p>
      <p class="modal-body">Aguarde atualizações do sistema sobre sua senha.<br><strong>Status da sua senha: Pendente</strong></p>
      <button class="btn-primary" onclick="this.closest('.modal-overlay').remove(); verSenha(state.senhaAtual);">Ok</button>
    </div>`;
  document.getElementById('screen-solicitar').appendChild(overlay);
}

function verSenha(senha) {
  if (!senha) return;
  state.senhaAtual = senha;
  document.getElementById('view-senha-num').textContent = senha.numero;
  document.getElementById('view-senha-updated').textContent = `Atualizada em ${senha.criadaEm}`;
  document.getElementById('view-senha-nome').textContent = state.usuario.nome;
  document.getElementById('view-senha-nasc').textContent = formatDate(state.usuario.nasc);
  document.getElementById('view-senha-cpf').textContent = state.usuario.cpf;
  document.getElementById('view-senha-tipo').textContent = senha.tipo;
  document.getElementById('view-senha-data').textContent = formatDate(senha.data);
  document.getElementById('view-senha-hora').textContent = senha.hora + ' Horas';
  const statusEl = document.getElementById('view-senha-status');
  statusEl.textContent = senha.status;
  statusEl.className = 'badge ' + (senha.status === 'Ativa' ? 'ativa' : senha.status === 'Cancelada' ? 'cancelada' : 'pendente');
  // mostrar/ocultar botão cancelar
  document.getElementById('btn-cancelar-wrapper').style.display = senha.status === 'Ativa' ? 'block' : 'none';
  // atualizar card da senha
  const card = document.querySelector('#screen-sua-senha .senha-card');
  card.style.background = senha.status === 'Cancelada' ? '#5d2b2b' : 'var(--navy)';
  goTo('screen-sua-senha');
}

function mostrarModalCancelar() {
  document.getElementById('modal-cancelar-2-text').textContent =
    `Confirmar Cancelamento da senha Nº ${state.senhaAtual.numero} para atendimento ${state.senhaAtual.servico}, no dia ${formatDate(state.senhaAtual.data)}?`;
  document.getElementById('modal-cancelar-1').style.display = 'flex';
}

function confirmarCancelamento() {
  fecharModal('modal-cancelar-1');
  document.getElementById('modal-cancelar-2').style.display = 'flex';
}

function executarCancelamento() {
  fecharModal('modal-cancelar-2');
  state.senhaAtual.status = 'Cancelada';
  renderMeusAgendamentos();
  document.getElementById('modal-cancelado-ok').style.display = 'flex';
}

function posCancelamento() {
  fecharModal('modal-cancelado-ok');
  verSenha(state.senhaAtual);
}

// ══════════════════════════════════════════════════
// RENDER AGENDAMENTOS
// ══════════════════════════════════════════════════
function renderMeusAgendamentos() {
  const ativas = state.senhas.filter(s => s.status === 'Ativa');
  const todas = state.senhas;
  const listaEl = document.getElementById('meus-ag-list');
  const histEl = document.getElementById('historico-list');

  if (ativas.length === 0) {
    listaEl.innerHTML = '<p style="color:var(--text-gray);font-size:14px;margin-top:8px;">Nenhum agendamento ativo.</p>';
  } else {
    listaEl.innerHTML = ativas.map(s => `
      <div class="agendamento-card" onclick="verSenha(state.senhas.find(x=>x.id===${s.id}))">
        <div class="ag-header">
          <span class="ag-number">Senha ${s.numero}</span>
          <span class="badge ativa">Ativa</span>
        </div>
        <div class="ag-service">${s.servico}</div>
        <div class="ag-date">${s.local} · ${formatDate(s.data)} às ${s.hora}</div>
      </div>
    `).join('');
  }

  if (todas.length === 0) {
    histEl.innerHTML = '<p style="color:var(--text-gray);font-size:14px;margin-top:8px;">Nenhum histórico ainda.</p>';
  } else {
    histEl.innerHTML = todas.map(s => `
      <div class="hist-item" onclick="verSenha(state.senhas.find(x=>x.id===${s.id}))">
        <div class="hist-info">
          <div class="hist-senha">Senha ${s.numero}</div>
          <div class="hist-service">${s.servico} — ${s.local}</div>
        </div>
        <div>
          <div class="hist-date">${formatDate(s.data)}</div>
          <div style="text-align:right;margin-top:4px;">
            <span class="badge ${s.status === 'Ativa' ? 'ativa' : 'cancelada'}">${s.status}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // lembretes na home
  const lembretesEl = document.getElementById('lembretes-list');
  if (state.lembretes.length === 0) {
    lembretesEl.innerHTML = '<div class="lembrete-item">Nenhum lembrete no momento</div>';
  } else {
    lembretesEl.innerHTML = state.lembretes.map(l =>
      `<div class="lembrete-item">${l}</div>`
    ).join('');
  }
}

// ══════════════════════════════════════════════════
// CALENDARIO
// ══════════════════════════════════════════════════
const DIAS_SEMANA = ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sáb'];
const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

// Serviços disponíveis demo
const SERVICOS_DEMO = [
  { dia: 4, prof: 'Dr. Carlos Silva' },
  { dia: 7, prof: 'Enf. Maria Souza' },
  { dia: 11, prof: 'Dr. Carlos Silva' },
  { dia: 13, prof: 'Psic. Ana Lima' },
  { dia: 21, prof: 'Dr. Carlos Silva' },
  { dia: 22, prof: 'Enf. Maria Souza' },
  { dia: 26, prof: 'Dr. João Neto' },
  { dia: 28, prof: 'Dent. Paula Rios' },
];

function renderCalendario() {
  const now = new Date(2026, 4, 1); // Maio 2026
  const mes = now.getMonth();
  const ano = now.getFullYear();
  document.getElementById('cal-mes-titulo').textContent = `${MESES[mes]} ${ano}`;

  // Header
  const headerEl = document.getElementById('cal-header');
  headerEl.innerHTML = DIAS_SEMANA.map(d => `<div class="cal-day-name">${d}</div>`).join('');

  // Days
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const diasDisponiveis = SERVICOS_DEMO.map(s => s.dia);
  const hoje = 23;

  let daysHTML = '';
  for (let i = 0; i < primeiroDia; i++) daysHTML += `<div class="cal-day empty"></div>`;
  for (let d = 1; d <= diasNoMes; d++) {
    const isWeekend = new Date(ano, mes, d).getDay() === 0 || new Date(ano, mes, d).getDay() === 6;
    const isAvail = diasDisponiveis.includes(d);
    const isHoje = d === hoje;
    let cls = 'cal-day';
    if (isWeekend) cls += ' weekend';
    else if (isAvail) cls += ' available';
    else cls += ' normal';
    if (isHoje) cls += ' selected';
    daysHTML += `<div class="${cls}" onclick="selecionarDiaCal(${d})">${d}</div>`;
  }
  document.getElementById('cal-days').innerHTML = daysHTML;

  // Serviços disponíveis
  const mesStr = String(mes + 1).padStart(2, '0');
  document.getElementById('servicos-disponiveis').innerHTML = SERVICOS_DEMO.map(s => `
    <div class="service-list-item" onclick="mostrarSalvarLembrete('Dia ${String(s.dia).padStart(2,'0')}/${mesStr} - ${s.prof}')">
      <span class="service-list-text">Dia ${String(s.dia).padStart(2,'0')}/${mesStr} — ${s.prof}</span>
      <span class="bookmark-icon">🔖</span>
    </div>
  `).join('');
}

function selecionarDiaCal(dia) {
  document.querySelectorAll('.cal-day').forEach(d => {
    if (d.textContent == dia) d.classList.add('selected');
  });
}

function mostrarSalvarLembrete(texto) {
  state.lembreteTemp = texto;
  document.getElementById('modal-salvar-lembrete').style.display = 'flex';
}

function salvarLembrete() {
  fecharModal('modal-salvar-lembrete');
  if (state.lembreteTemp) {
    state.lembretes.push(state.lembreteTemp);
    renderMeusAgendamentos();
    state.lembreteTemp = null;
  }
  document.getElementById('modal-lembrete-ok').style.display = 'flex';
}

// ══════════════════════════════════════════════════
// UTILITIES
// ══════════════════════════════════════════════════
function fecharModal(id) {
  document.getElementById(id).style.display = 'none';
}

function formatDate(val) {
  if (!val) return '—';
  if (val.includes('-')) {
    const [y, m, d] = val.split('-');
    return `${d}/${m}/${y}`;
  }
  return val;
}

// ══════════════════════════════════════════════════
// PWA INSTALL
// ══════════════════════════════════════════════════
let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
});
function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => { deferredPrompt = null; });
  } else {
    alert('Para instalar: abra no Chrome/Safari e use "Adicionar à tela inicial".');
  }
}

// ══════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════
renderCalendario();
renderMeusAgendamentos();

// Gerar manifest dinamicamente
const manifest = {
  name: "SaúdeFácil — Agendamento de Saúde",
  short_name: "SaúdeFácil",
  description: "Agendamento digital de senhas para UBS e Secretarias de Saúde",
  start_url: ".",
  display: "standalone",
  background_color: "#dce9f8",
  theme_color: "#0d1b5e",
  orientation: "portrait",
  icons: [
    { src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'><rect width='192' height='192' rx='32' fill='%230d1b5e'/><text x='96' y='130' text-anchor='middle' font-size='90' fill='white' font-family='sans-serif'>SF</text></svg>", sizes: "192x192", type: "image/svg+xml" },
  ]
};
const blob = new Blob([JSON.stringify(manifest)], {type: 'application/json'});
const manifestURL = URL.createObjectURL(blob);
const link = document.createElement('link');
link.rel = 'manifest';
link.href = manifestURL;
document.head.appendChild(link);
