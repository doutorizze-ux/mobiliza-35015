'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export default function AdminLogin() {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: { preventDefault: () => void; currentTarget: HTMLFormElement }) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: form.get('email'), password: form.get('password') }) });
    if (!response.ok) {
      setError('E-mail ou senha inválidos.');
      setIsSubmitting(false);
      return;
    }
    window.location.href = '/admin';
  }

  return (
    <main className="login-page">
      <section className="login-brand">
        <div className="public-brand"><span className="logo-mark">LL</span><span><strong>Mobiliza 35015</strong><small>Lívio Luciano</small></span></div>
        <div><span className="eyebrow eyebrow-light"><LockKeyhole size={13} /> Acesso restrito</span><h1>Decisões melhores<br /><em>começam no campo.</em></h1><p>Uma visão simples e segura para acompanhar as ações das equipes e transformar registros em direção.</p></div>
        <span className="login-note"><ShieldCheck size={14} /> Dados agregados · ambiente interno</span>
      </section>
      <section className="login-card-wrap">
        <div className="login-card">
          <span className="logo-mark">LL</span>
          <h2>Entrar no painel</h2>
          <p>Use as credenciais do diretor para acessar a visão consolidada da mobilização.</p>
          <form className="login-form" onSubmit={submit}>
            <label>E-mail administrativo<input name="email" type="email" required placeholder="diretor@exemplo.com" autoComplete="username" /></label>
            <label>Senha<input name="password" type="password" required placeholder="Digite sua senha" autoComplete="current-password" /></label>
            {error && <div className="login-error" role="alert">{error}</div>}
            <button className="primary-button" disabled={isSubmitting} type="submit">{isSubmitting ? 'Entrando...' : 'Acessar painel'} <ArrowRight size={17} /></button>
          </form>
          <Link className="login-back" href="/"><ArrowLeft size={14} /> Voltar ao formulário</Link>
        </div>
      </section>
    </main>
  );
}
