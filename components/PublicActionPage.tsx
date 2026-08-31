'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Camera,
  Check,
  CheckCircle2,
  ClipboardList,
  FileImage,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  Target,
  Upload,
  UsersRound,
} from 'lucide-react';

type PublicActionPageProps = {
  leaderName: string;
  leaderSlug: string;
};

const activities = [
  'Visita de bairro',
  'Reunião comunitária',
  'Caminhada',
  'Encontro local',
  'Distribuição de material',
  'Outra atividade',
];

export default function PublicActionPage({ leaderName, leaderSlug }: PublicActionPageProps) {
  const [sent, setSent] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionId, setActionId] = useState<number | null>(null);

  async function submit(event: { preventDefault: () => void; currentTarget: HTMLFormElement }) {
    event.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/actions', {
        method: 'POST',
        body: new FormData(event.currentTarget),
      });
      const payload = await response.json() as { error?: string; id?: number };

      if (!response.ok) {
        setSubmitError(payload.error || 'Não foi possível salvar. Verifique os campos e tente novamente.');
        return;
      }

      setActionId(payload.id ?? null);
      setSent(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setSubmitError('Não foi possível conectar ao sistema. Tente novamente em instantes.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setSent(false);
    setFiles([]);
    setActionId(null);
    setSubmitError('');
  }

  return (
    <main className="public-page">
      <header className="public-header">
        <Link className="public-brand" href="/" aria-label="Voltar para o início">
          <span className="logo-mark">LL</span>
          <span>
            <strong>Mobiliza 35015</strong>
            <small>Lívio Luciano</small>
          </span>
        </Link>
        <Link className="admin-access" href="/admin">
          <LockKeyhole size={15} />
          <span>Painel do diretor</span>
        </Link>
      </header>

      <section className="form-hero">
        <div className="hero-copy">
          <span className="eyebrow eyebrow-light">
            <UsersRound size={14} /> Link individual de liderança
          </span>
          <h1>Registro de<br /><em>mobilização.</em></h1>
          <p>Registre os resultados da sua ação em campo com rapidez e segurança. Informe apenas totais — nunca nomes, telefones ou dados pessoais de eleitores.</p>
          <div className="trust-row">
            <span><ShieldCheck /> Dados agregados</span>
            <span><Target /> Acompanhamento de metas</span>
          </div>
        </div>
        <div className="portrait">
          <Image src="/livio-atendimento.png" alt="Lívio Luciano em atendimento" fill priority sizes="(max-width: 820px) 100vw, 48vw" />
          <div className="portrait-gradient" />
          <div className="portrait-caption">
            <small>Deputado estadual · 35015</small>
            <strong>Lívio Luciano</strong>
          </div>
        </div>
      </section>

      <section className="form-area">
        <div className="form-intro">
          <span className="section-kicker">Registro seguro de campo</span>
          <h2>Transforme uma ação em visão.</h2>
          <p>Preencha os quatro blocos abaixo. Leva menos de dois minutos e ajuda a equipe a acompanhar o trabalho realizado.</p>
        </div>

        {sent ? (
          <div className="success-card">
            <span className="success-icon"><CheckCircle2 /></span>
            <span className="success-kicker">Registro enviado com sucesso</span>
            <h2>{actionId ? `Ação AC-${String(actionId).padStart(4, '0')}` : 'Ação registrada'}</h2>
            <p>Os números foram adicionados ao acompanhamento de <strong>{leaderName}</strong>. Obrigado por manter o registro organizado.</p>
            <button className="primary-button compact-button" type="button" onClick={resetForm}>Registrar outra ação <ArrowRight size={17} /></button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={submit}>
            <input type="hidden" name="leader" value={leaderSlug} />
            <div className="form-heading">
              <div>
                <span className="section-kicker">{leaderName} · link individual</span>
                <h2>Dados da ação em campo</h2>
              </div>
              <span className="required-note">* Campos obrigatórios</span>
            </div>

            <fieldset>
              <legend><span className="legend-number">01</span><MapPin /> Local e atividade</legend>
              <div className="field-grid">
                <label>Data da ação *<input name="action_date" required type="date" /></label>
                <label>Município *<input name="city" required placeholder="Ex.: Aracaju" /></label>
                <label>Bairro ou região<input name="neighborhood" placeholder="Ex.: Centro" /></label>
                <label>Tipo de atividade *<select name="activity_type" required defaultValue=""><option value="" disabled>Selecione uma atividade</option>{activities.map(activity => <option key={activity}>{activity}</option>)}</select></label>
              </div>
            </fieldset>

            <fieldset>
              <legend><span className="legend-number">02</span><BarChart3 /> Resultados agregados</legend>
              <div className="field-grid stats-inputs">
                <label>Total de pessoas abordadas *<input name="conversations" required min="0" type="number" placeholder="0" /></label>
                <label>Manifestações de apoio *<input name="support" required min="0" type="number" placeholder="0" /></label>
                <label>Pessoas indecisas *<input name="undecided" required min="0" type="number" placeholder="0" /></label>
                <label>Materiais entregues<input name="materials" min="0" type="number" placeholder="0" /></label>
              </div>
              <p className="helper-note"><ShieldCheck size={14} /> Informe somente quantidades. Não inclua nomes, telefones ou qualquer identificação individual.</p>
            </fieldset>

            <fieldset>
              <legend><span className="legend-number">03</span><ClipboardList /> Relato da liderança</legend>
              <div className="field-grid one">
                <label>Observações da ação<textarea name="notes" rows={5} placeholder="Temas mais comentados, receptividade geral e próximos passos. Não escreva dados pessoais." /></label>
              </div>
            </fieldset>

            <fieldset>
              <legend><span className="legend-number">04</span><Camera /> Fotos da atividade <span className="optional-label">opcional</span></legend>
              <label className="dropzone">
                <span className="upload-icon"><Upload /></span>
                <strong>Adicione fotos autorizadas da ação</strong>
                <span>JPG ou PNG · máximo de 10 MB por imagem</span>
                <input name="photos" type="file" accept=".jpg,.jpeg,.png" multiple onChange={event => setFiles(Array.from(event.target.files || []).map(file => file.name))} />
              </label>
              {files.length > 0 && <ul className="file-list">{files.map(file => <li key={file}><FileImage size={16} />{file}<Check size={16} /></li>)}</ul>}
              <p className="helper-note">Envie apenas imagens cujas pessoas tenham autorizado o uso pela equipe.</p>
            </fieldset>

            <label className="consent">
              <input required type="checkbox" name="consent" aria-label="Confirmo que informei apenas dados agregados" />
              <span><strong>Confirmo que informei apenas dados agregados *</strong><small>Declaro que este registro não contém nomes, telefones, documentos ou preferência política individual.</small></span>
            </label>

            {submitError && <p className="form-error" role="alert">{submitError}</p>}
            <button className="primary-button submit-button" disabled={isSubmitting} type="submit">{isSubmitting ? 'Enviando registro...' : 'Registrar ação'} <ArrowRight size={18} /></button>
            <p className="security-note"><ShieldCheck size={15} /> Ambiente interno · informações tratadas de forma agregada</p>
          </form>
        )}
      </section>

      <footer className="public-footer">
        <div><span className="logo-mark">LL</span><strong>Mobiliza 35015</strong></div>
        <p>Uso interno · Privacidade · Dados agregados</p>
      </footer>
    </main>
  );
}
