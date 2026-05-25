import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TopBar from '../components/TopBar';

const ESTADOS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

export default function Cadastro() {
  const nav = useNavigate();
  const { registro } = useAuth();
  const [passo, setPasso] = useState(1);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [dados, setDados] = useState({
    nome: '', cpf: '', data_nascimento: '', telefone: '', email: '', password: '',
    rua: '', numero: '', bairro: '', complemento: '', cidade: '', estado: 'CE', ubs_preferida: 'UBS Centro',
  });

  const set = (k, v) => setDados(d => ({ ...d, [k]: v }));

  const irPasso2 = () => {
    if (!dados.nome || !dados.cpf || !dados.password) { setErro('Preencha nome, CPF e senha.'); return; }
    setErro(''); setPasso(2);
  };

  const concluir = async () => {
    if (!dados.cidade) { setErro('Preencha sua cidade.'); return; }
    setErro(''); setLoading(true);
    try {
      await registro(dados);
      nav('/home');
    } catch (e) {
      const erros = e.response?.data;
      setErro(erros ? JSON.stringify(erros) : 'Erro ao criar conta.');
    } finally { setLoading(false); }
  };

  return (
    <div className="screen">
      <TopBar title="Criar conta" backTo={passo === 2 ? undefined : '/'} />
      <div className="screen-body">
        <div className="wizard-steps">
          <div className={`step-dot ${passo >= 1 ? 'active' : ''}`} />
          <div className={`step-dot ${passo >= 2 ? 'active' : ''}`} />
        </div>

        {erro && <div className="error-msg">{erro}</div>}

        {passo === 1 && (
          <>
            <p className="form-section-title">Informações pessoais</p>
            <div className="form-group">
              <label className="form-label">Nome completo</label>
              <input className="form-input" placeholder="Nome completo" value={dados.nome} onChange={e => set('nome', e.target.value)} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Data de nascimento</label>
                <input className="form-input" type="date" value={dados.data_nascimento} onChange={e => set('data_nascimento', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">CPF</label>
                <input className="form-input" placeholder="000.000.000-00" value={dados.cpf} onChange={e => set('cpf', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Telefone</label>
                <input className="form-input" placeholder="(85) 90000-0000" value={dados.telefone} onChange={e => set('telefone', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">E-mail</label>
                <input className="form-input" type="email" placeholder="email@exemplo.com" value={dados.email} onChange={e => set('email', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Senha</label>
              <input className="form-input" type="password" placeholder="Mínimo 6 caracteres" value={dados.password} onChange={e => set('password', e.target.value)} />
            </div>
            <div style={{ marginTop: 24 }}>
              <button className="btn-primary" onClick={irPasso2}>Próximo ›</button>
            </div>
          </>
        )}

        {passo === 2 && (
          <>
            <p className="form-section-title">Endereço</p>
            <div className="form-row">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Rua / Avenida</label>
                <input className="form-input" placeholder="Rua das Flores" value={dados.rua} onChange={e => set('rua', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Número</label>
                <input className="form-input" placeholder="123" value={dados.numero} onChange={e => set('numero', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Complemento</label>
                <input className="form-input" placeholder="Apto 2" value={dados.complemento} onChange={e => set('complemento', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Bairro</label>
              <input className="form-input" placeholder="Centro" value={dados.bairro} onChange={e => set('bairro', e.target.value)} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Cidade</label>
                <input className="form-input" placeholder="Fortaleza" value={dados.cidade} onChange={e => set('cidade', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Estado</label>
                <select className="form-input" value={dados.estado} onChange={e => set('estado', e.target.value)}>
                  {ESTADOS.map(uf => <option key={uf}>{uf}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">UBS de preferência</label>
              <select className="form-input" value={dados.ubs_preferida} onChange={e => set('ubs_preferida', e.target.value)}>
                <option>UBS Centro</option>
                <option>UBS do Santo Antonio</option>
                <option>Secretaria de Saúde Municipal</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button className="btn-soft" style={{ flex: 1 }} onClick={() => setPasso(1)}>‹ Voltar</button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={concluir} disabled={loading}>
                {loading ? 'Criando...' : 'Criar conta'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
