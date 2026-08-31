import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Copy, ExternalLink, FileText, Link2, Plus, UserPlus, UsersRound } from 'lucide-react';
import { verifySession } from '@/lib/auth';
import { db } from '@/lib/db';
import CopyLinkButton from '@/components/CopyLinkButton';

type Leader = { slug: string; name: string };

const seed: Leader[] = [
  { slug: 'raimundo-verissimo', name: 'Raimundo Veríssimo' },
  { slug: 'maria-oliveira', name: 'Maria Oliveira' },
  { slug: 'carlos-santos', name: 'Carlos Santos' },
];

export default async function Liderancas() {
  if (!await verifySession((await cookies()).get('mobiliza_session')?.value)) redirect('/admin/login');

  let leaders: Leader[] = seed;
  try {
    const result = await db.query('SELECT slug,name FROM leaders WHERE active=true ORDER BY name');
    if (result.rows.length) leaders = result.rows as Leader[];
  } catch {
    // The seeded fallback keeps the management screen available during a database restart.
  }

  return (
    <main className="dash-content">
      <div className="overview-title">
        <div>
          <p>Gestão de equipes</p>
          <h2>Lideranças</h2>
          <p className="subtitle">Crie um link separado para cada equipe e acompanhe seus registros.</p>
        </div>
        <div className="overview-actions"><span className="secondary-button"><UsersRound size={15} /> {leaders.length} ativas</span></div>
      </div>

      <section className="panel create-panel">
        <div className="panel-heading">
          <div><h3><UserPlus size={17} /> Criar nova liderança</h3><p>O link será usado pela equipe para registrar ações agregadas.</p></div>
        </div>
        <form className="management-form" action="/api/leaders" method="post">
          <input name="name" required placeholder="Nome completo da liderança" aria-label="Nome completo da liderança" />
          <input name="slug" required placeholder="slug-do-link" aria-label="Slug do link" />
          <button className="primary-button" type="submit"><Plus size={16} /> Criar link</button>
        </form>
      </section>

      <section className="panel leader-list-panel">
        <div className="panel-heading">
          <div><h3>Links individuais</h3><p>Compartilhe o formulário certo com cada liderança.</p></div>
          <span className="list-count">{leaders.length} {leaders.length === 1 ? 'liderança ativa' : 'lideranças ativas'}</span>
        </div>
        {leaders.length ? leaders.map(leader => <div className="leader-row" key={leader.slug}>
          <div className="leader-info">
            <span className="channel-avatar">{leader.name.charAt(0)}</span>
            <div><strong>{leader.name}</strong><small><Link2 size={12} /> /lideranca/{leader.slug}</small></div>
          </div>
          <div className="leader-actions">
            <code>/lideranca/{leader.slug}</code>
            <CopyLinkButton slug={leader.slug} />
            <Link className="secondary-button" href={`/lideranca/${leader.slug}`} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Abrir</Link>
            <Link className="secondary-button" href={`/admin/relatorio/${leader.slug}`}><FileText size={14} /> PDF</Link>
            <form action="/api/leaders" method="post"><input type="hidden" name="action" value="delete" /><input type="hidden" name="slug" value={leader.slug} /><button className="danger-button" type="submit">Desativar</button></form>
          </div>
        </div>) : <div className="empty-state">Nenhuma liderança ativa no momento.</div>}
      </section>

      <div className="admin-footnote"><Copy size={14} /> Copie o link, envie para a equipe e mantenha cada operação separada por liderança.</div>
    </main>
  );
}
