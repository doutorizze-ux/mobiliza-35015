import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Activity, ArrowUpRight, FileText, Flag, Plus, ShieldCheck, TrendingUp, UsersRound } from 'lucide-react';
import { verifySession } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

type Totals = { actions: number; conversations: number; support: number; undecided: number };
type Leader = { slug: string; name: string; actions?: number; conversations?: number };
type ActionRow = { id: number; leader: string; leader_slug: string; city: string; neighborhood?: string; activity_type: string; conversations: number; support: number; undecided: number; action_date: string };

const fallbackLeaders: Leader[] = [
  { slug: 'raimundo-verissimo', name: 'Raimundo Veríssimo' },
  { slug: 'maria-oliveira', name: 'Maria Oliveira' },
  { slug: 'carlos-santos', name: 'Carlos Santos' },
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
}

export default async function Admin() {
  const token = (await cookies()).get('mobiliza_session')?.value;
  if (!await verifySession(token)) redirect('/admin/login');

  let totals: Totals = { actions: 0, conversations: 0, support: 0, undecided: 0 };
  let actions: ActionRow[] = [];
  let leaders: Leader[] = fallbackLeaders;

  try {
    const totalsResult = await db.query('SELECT COUNT(*)::int actions, COALESCE(SUM(conversations),0)::int conversations, COALESCE(SUM(support),0)::int support, COALESCE(SUM(undecided),0)::int undecided FROM actions');
    const actionsResult = await db.query('SELECT a.id, l.name leader, l.slug leader_slug, a.city, a.neighborhood, a.activity_type, a.conversations, a.support, a.undecided, a.action_date FROM actions a JOIN leaders l ON l.slug=a.leader_slug ORDER BY a.created_at DESC LIMIT 8');
    const leadersResult = await db.query('SELECT l.slug, l.name, COUNT(a.id)::int actions, COALESCE(SUM(a.conversations),0)::int conversations FROM leaders l LEFT JOIN actions a ON a.leader_slug=l.slug WHERE l.active=true GROUP BY l.slug,l.name ORDER BY l.name');
    totals = (totalsResult.rows[0] as Totals) || totals;
    actions = actionsResult.rows as ActionRow[];
    if (leadersResult.rows.length) leaders = leadersResult.rows as Leader[];
  } catch {
    // The seeded fallback keeps the dashboard usable while the database is unavailable.
  }

  return (
    <main className="dash-content">
      <div className="overview-title">
        <div>
          <p>Visão consolidada</p>
          <h2>Mobilização em campo</h2>
          <p className="subtitle">Acompanhe os resultados agregados enviados pelas lideranças.</p>
        </div>
        <div className="overview-actions">
          <Link className="secondary-button" href="/admin/relatorio/raimundo-verissimo"><FileText size={15} /> Relatório PDF</Link>
          <Link className="primary-button" href="/admin/liderancas"><Plus size={17} /> Nova liderança</Link>
        </div>
      </div>

      <section className="metrics" aria-label="Resumo da mobilização">
        <article><div className="metric-icon blue"><UsersRound size={18} /></div><p>Pessoas abordadas</p><strong>{Number(totals.conversations).toLocaleString('pt-BR')}</strong><small><b>Dados agregados</b> no período</small></article>
        <article><div className="metric-icon yellow"><Flag size={18} /></div><p>Apoios informados</p><strong>{Number(totals.support).toLocaleString('pt-BR')}</strong><small>{totals.conversations ? Math.round(Number(totals.support) / Number(totals.conversations) * 100) : 0}% das conversas</small></article>
        <article><div className="metric-icon green"><TrendingUp size={18} /></div><p>Pessoas indecisas</p><strong>{Number(totals.undecided).toLocaleString('pt-BR')}</strong><small>{totals.conversations ? Math.round(Number(totals.undecided) / Number(totals.conversations) * 100) : 0}% das conversas</small></article>
        <article><div className="metric-icon purple"><Activity size={18} /></div><p>Ações realizadas</p><strong>{Number(totals.actions).toLocaleString('pt-BR')}</strong><small>{leaders.length} lideranças ativas</small></article>
      </section>

      <div className="dashboard-grid">
        <section className="panel recent">
          <div className="panel-heading">
            <div><h3>Ações recentes</h3><p>Últimos registros enviados pelas equipes.</p></div>
            <Link className="text-button" href="/admin/relatorio/raimundo-verissimo">Ver relatório <ArrowUpRight size={14} /></Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Ação</th><th>Liderança</th><th>Local</th><th>Atividade</th><th>Abordadas</th><th>Apoios</th><th>Data</th></tr></thead>
              <tbody>
                {actions.length ? actions.map(action => <tr key={action.id}>
                  <td><b>AC-{String(action.id).padStart(4, '0')}</b></td>
                  <td>{action.leader}</td>
                  <td>{action.city}{action.neighborhood ? ` · ${action.neighborhood}` : ''}</td>
                  <td>{action.activity_type}</td>
                  <td>{action.conversations}</td>
                  <td><span className="status respondido">{action.support}</span></td>
                  <td>{formatDate(action.action_date)}</td>
                </tr>) : <tr><td colSpan={7}><div className="empty-state">Ainda não há ações registradas.</div></td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel channels">
          <div className="panel-heading"><div><h3>Lideranças ativas</h3><p>Links individuais e relatórios.</p></div><Link className="text-button" href="/admin/liderancas">Gerenciar</Link></div>
          {leaders.map(leader => <article key={leader.slug}>
            <span className="channel-avatar">{leader.name.charAt(0)}</span>
            <div><strong>{leader.name}</strong><small>{leader.actions || 0} ações · {leader.conversations || 0} pessoas abordadas</small></div>
            <Link className="icon-button" href={`/admin/relatorio/${leader.slug}`} title={`Abrir relatório de ${leader.name}`} aria-label={`Abrir relatório de ${leader.name}`}><FileText size={16} /></Link>
          </article>)}
        </section>
      </div>

      <div className="admin-footnote"><ShieldCheck size={15} /> O sistema trabalha apenas com totais agregados, sem dados pessoais de eleitores.</div>
    </main>
  );
}
