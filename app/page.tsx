'use client';

import { useState } from 'react';
import { Activity, BarChart3, CalendarDays, Camera, CheckCircle2, ChevronRight, ClipboardList, Copy, FileImage, Filter, Flag, LayoutDashboard, LockKeyhole, MapPin, Menu, Plus, Search, ShieldCheck, Target, TrendingUp, Upload, UsersRound, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const actions = [
  { id:'AC-031', leader:'Raimundo Veríssimo', place:'Aracaju · Centro', type:'Visita de bairro', conversations:48, support:31, undecided:12, date:'31 ago, 08:42' },
  { id:'AC-030', leader:'Maria Oliveira', place:'Nossa Sra. do Socorro', type:'Reunião comunitária', conversations:72, support:46, undecided:19, date:'30 ago, 19:18' },
  { id:'AC-029', leader:'Carlos Santos', place:'Aracaju · Zona Norte', type:'Caminhada', conversations:91, support:57, undecided:23, date:'30 ago, 14:06' },
  { id:'AC-028', leader:'Raimundo Veríssimo', place:'Barra dos Coqueiros', type:'Encontro local', conversations:36, support:22, undecided:9, date:'29 ago, 11:25' },
];

const leaders = [
  { name:'Raimundo Veríssimo', slug:'raimundo-verissimo', actions:18, conversations:614 },
  { name:'Maria Oliveira', slug:'maria-oliveira', actions:14, conversations:481 },
  { name:'Carlos Santos', slug:'carlos-santos', actions:12, conversations:397 },
];

export default function Home(){
  const [view,setView]=useState<'form'|'dashboard'>('form');
  const [sent,setSent]=useState(false);
  const [files,setFiles]=useState<string[]>([]);
  const [sidebar,setSidebar]=useState(false);
  const [copied,setCopied]=useState('');
  const [submitError,setSubmitError]=useState('');
  const submit=async(e:React.FormEvent<HTMLFormElement>)=>{e.preventDefault();setSubmitError('');const response=await fetch('/api/actions',{method:'POST',body:new FormData(e.currentTarget)});if(!response.ok){setSubmitError('Não foi possível salvar. Verifique os campos e tente novamente.');return}setSent(true);window.scrollTo({top:0,behavior:'smooth'})};
  const copyLink=(slug:string)=>{navigator.clipboard?.writeText(`${location.origin}/mobilizacao/${slug}`);setCopied(slug);setTimeout(()=>setCopied(''),1800)};

  if(view==='dashboard') return <main className="app-shell">
    <aside className={sidebar?'sidebar open':'sidebar'}>
      <div className="sidebar-brand"><span className="logo-mark">LL</span><div><strong>Mobiliza 35015</strong><small>Lívio Luciano</small></div><button className="sidebar-close" onClick={()=>setSidebar(false)}><X size={20}/></button></div>
      <nav><button className="active"><LayoutDashboard size={19}/> Visão geral</button><button><Activity size={19}/> Ações registradas <span>44</span></button><button><UsersRound size={19}/> Lideranças</button><button><Target size={19}/> Metas</button><button><BarChart3 size={19}/> Relatórios</button></nav>
      <div className="privacy-card"><ShieldCheck size={22}/><strong>Somente números agregados</strong><p>O sistema não registra nomes, telefones ou preferência individual de eleitores.</p></div>
      <button className="back-link" onClick={()=>setView('form')}>Registrar nova ação <ChevronRight size={16}/></button>
    </aside>
    <section className="dashboard">
      <header className="dash-header"><button className="mobile-nav" onClick={()=>setSidebar(true)}><Menu/></button><div><p>31 de agosto de 2026</p><h1>Painel do Diretor</h1></div><div className="user-chip"><span>DL</span><div><strong>Diretor geral</strong><small>Visão consolidada</small></div></div></header>
      <div className="dash-content">
        <div className="overview-title"><div><h2>Mobilização em campo</h2><p>Resultados agregados enviados pelas lideranças.</p></div><Button><Plus/> Nova liderança</Button></div>
        <div className="metrics">
          <article><div className="metric-icon blue"><UsersRound/></div><p>Pessoas abordadas</p><strong>1.492</strong><small><b>+247</b> nesta semana</small></article>
          <article><div className="metric-icon yellow"><Flag/></div><p>Apoios informados</p><strong>938</strong><small>63% das conversas</small></article>
          <article><div className="metric-icon green"><TrendingUp/></div><p>Indecisos</p><strong>327</strong><small>22% das conversas</small></article>
          <article><div className="metric-icon purple"><Activity/></div><p>Ações realizadas</p><strong>44</strong><small>3 lideranças ativas</small></article>
        </div>
        <div className="dashboard-grid">
          <section className="panel recent"><div className="panel-heading"><div><h3>Ações recentes</h3><p>Registros consolidados, sem dados pessoais de eleitores</p></div><div className="table-actions"><button><Filter size={16}/> Filtrar</button><button><Search size={17}/></button></div></div>
            <div className="table-wrap"><table><thead><tr><th>Ação</th><th>Liderança</th><th>Local</th><th>Tipo</th><th>Conversas</th><th>Apoios</th><th>Indecisos</th><th>Data</th></tr></thead><tbody>{actions.map(a=><tr key={a.id}><td><b>{a.id}</b></td><td>{a.leader}</td><td>{a.place}</td><td>{a.type}</td><td>{a.conversations}</td><td><span className="status respondido">{a.support}</span></td><td>{a.undecided}</td><td>{a.date}</td></tr>)}</tbody></table></div>
          </section>
          <section className="panel channels"><div className="panel-heading"><div><h3>Links das lideranças</h3><p>Um formulário agregado para cada equipe</p></div></div>{leaders.map(l=><article key={l.slug}><span className="channel-avatar">{l.name.charAt(0)}</span><div><strong>{l.name}</strong><small>{l.actions} ações · {l.conversations} conversas</small></div><button title="Copiar link" onClick={()=>copyLink(l.slug)}>{copied===l.slug?<CheckCircle2 size={17}/>:<Copy size={17}/>}</button></article>)}</section>
        </div>
      </div>
    </section>
  </main>;

  return <main className="public-page">
    <header className="public-header"><div className="public-brand"><span className="logo-mark">LL</span><div><strong>Mobiliza 35015</strong><small>Lívio Luciano</small></div></div><button className="admin-access" onClick={()=>location.href='/admin'}><LockKeyhole size={16}/> Painel do diretor</button></header>
    <section className="form-hero"><div className="hero-copy"><span className="channel-pill"><UsersRound size={14}/> Liderança: Raimundo Veríssimo</span><h1>Registro de<br/><em>mobilização.</em></h1><p>Registre os números da sua ação em campo. Informe apenas totais — nunca nomes, telefones ou dados pessoais de eleitores.</p><div className="trust-row"><span><ShieldCheck/> Dados agregados</span><span><Target/> Acompanhamento de metas</span></div></div><div className="portrait"><img src="/livio-atendimento.png" alt="Retrato de Lívio Luciano"/><div className="portrait-gradient"/><div className="portrait-caption"><small>Deputado Estadual · 35015</small><strong>Lívio Luciano</strong></div></div></section>
    <section className="form-area">
      {sent?<div className="success-card"><span><CheckCircle2/></span><p>Ação registrada</p><h2>Registro AC-032</h2><p>Os totais foram adicionados ao painel da liderança e à visão consolidada do diretor.</p><Button onClick={()=>{setSent(false);setFiles([])}}>Registrar outra ação</Button></div>:
      <form className="contact-form" onSubmit={submit}><input type="hidden" name="leader" value="raimundo-verissimo"/>
        <div className="form-heading"><div><p>Raimundo Veríssimo · Link individual</p><h2>Dados da ação em campo</h2></div><span>Campos com * são obrigatórios</span></div>
        <fieldset><legend><MapPin/> Local e atividade</legend><div className="field-grid"><label>Data da ação *<Input name="action_date" required type="date"/></label><label>Município *<Input name="city" required placeholder="Ex.: Aracaju"/></label><label>Bairro ou região<Input name="neighborhood" placeholder="Ex.: Centro"/></label><label>Tipo de atividade *<select name="activity_type" required defaultValue=""><option value="" disabled>Selecione</option><option>Visita de bairro</option><option>Reunião comunitária</option><option>Caminhada</option><option>Encontro local</option><option>Distribuição de material</option><option>Outra atividade</option></select></label></div></fieldset>
        <fieldset><legend><BarChart3/> Resultados agregados</legend><div className="field-grid stats-inputs"><label>Total de pessoas abordadas *<Input name="conversations" required min="0" type="number" placeholder="0"/></label><label>Manifestações de apoio *<Input name="support" required min="0" type="number" placeholder="0"/></label><label>Pessoas indecisas *<Input name="undecided" required min="0" type="number" placeholder="0"/></label><label>Materiais entregues<Input name="materials" min="0" type="number" placeholder="0"/></label></div><p className="upload-note">Informe somente quantidades. Não inclua nomes, telefones ou qualquer identificação individual.</p></fieldset>
        <fieldset><legend><ClipboardList/> Relato da liderança</legend><div className="field-grid one"><label>Observações da ação<Textarea name="notes" rows={5} placeholder="Temas mais comentados, receptividade geral e próximos passos. Não escreva dados pessoais."/></label></div></fieldset>
        <fieldset><legend><Camera/> Fotos da atividade</legend><label className="dropzone"><Upload/><strong>Adicione fotos autorizadas da ação</strong><span>JPG ou PNG · máximo de 10 MB por imagem</span><input name="photos" type="file" accept=".jpg,.jpeg,.png" multiple onChange={e=>setFiles(Array.from(e.target.files||[]).map(f=>f.name))}/></label>{files.length>0&&<ul className="file-list">{files.map(f=><li key={f}><FileImage size={17}/>{f}<CheckCircle2 size={17}/></li>)}</ul>}<p className="upload-note">Envie apenas imagens cujas pessoas tenham autorizado o uso pela equipe.</p></fieldset>
        <label className="consent"><Checkbox required/><span><strong>Confirmo que informei apenas dados agregados *</strong><small>Declaro que este registro não contém nomes, telefones, documentos ou preferência política individual.</small></span></label>
        {submitError&&<p role="alert" style={{color:'#b91c1c',fontSize:12,textAlign:'center'}}>{submitError}</p>}<Button className="submit-button" type="submit">Registrar ação <ChevronRight/></Button>
        <p className="security-note"><ShieldCheck/> Registro agregado para acompanhamento interno da mobilização.</p>
      </form>}
    </section>
    <footer className="public-footer"><div><span className="logo-mark">LL</span><strong>Mobiliza 35015</strong></div><p>Uso interno · Privacidade · Dados agregados</p></footer>
  </main>;
}
