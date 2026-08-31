import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ArrowLeft, BarChart3, FileText, MapPin, UsersRound } from 'lucide-react';
import { verifySession } from '@/lib/auth';
import { db } from '@/lib/db';
import PrintButton from '@/components/PrintButton';

export const dynamic = 'force-dynamic';

type ReportRow = { action_date: string; city: string; neighborhood?: string; activity_type: string; conversations: number; support: number; undecided: number };

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '');
}

export default async function Relatorio({ params }: { params: Promise<{ slug: string }> }) {
  if (!await verifySession((await cookies()).get('mobiliza_session')?.value)) redirect('/admin/login');
  const { slug } = await params;
  let name = slug;
  let rows: ReportRow[] = [];

  try {
    const leader = (await db.query('SELECT name FROM leaders WHERE slug=$1', [slug])).rows[0];
    if (leader) name = leader.name;
    rows = (await db.query('SELECT action_date,city,neighborhood,activity_type,conversations,support,undecided FROM actions WHERE leader_slug=$1 ORDER BY action_date DESC', [slug])).rows as ReportRow[];
  } catch {
    // Render an empty report if the database is temporarily unavailable.
  }

  const totals = rows.reduce((acc, row) => ({
    actions: acc.actions + 1,
    conversations: acc.conversations + Number(row.conversations || 0),
    support: acc.support + Number(row.support || 0),
    undecided: acc.undecided + Number(row.undecided || 0),
  }), { actions: 0, conversations: 0, support: 0, undecided: 0 });

  return (
    <main className="dash-content report-page">
      <div className="overview-title">
        <div>
          <p>Relatório de campo</p>
          <h2>{name}</h2>
          <p className="subtitle">Resumo agregado das ações registradas por esta liderança.</p>
        </div>
        <div className="report-actions no-print">
          <Link className="secondary-button" href="/admin/liderancas"><ArrowLeft size={14} /> Voltar</Link>
          <PrintButton />
        </div>
      </div>

      <section className="report-summary" aria-label="Indicadores da liderança">
        <div><span><FileText size={13} /> Ações registradas</span><strong>{totals.actions}</strong></div>
        <div><span><UsersRound size={13} /> Pessoas abordadas</span><strong>{totals.conversations.toLocaleString('pt-BR')}</strong></div>
        <div><span><BarChart3 size={13} /> Apoios informados</span><strong>{totals.support.toLocaleString('pt-BR')}</strong></div>
        <div><span><MapPin size={13} /> Pessoas indecisas</span><strong>{totals.undecided.toLocaleString('pt-BR')}</strong></div>
      </section>

      <section className="panel">
        <div className="panel-heading"><div><h3>Histórico de ações</h3><p>Gerado em {new Date().toLocaleDateString('pt-BR')}</p></div><span className="list-count">{rows.length} registros</span></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Data</th><th>Local</th><th>Atividade</th><th>Abordadas</th><th>Apoios</th><th>Indecisas</th></tr></thead>
            <tbody>{rows.length ? rows.map((row, index) => <tr key={`${row.action_date}-${index}`}>
              <td>{formatDate(row.action_date)}</td>
              <td>{row.city}{row.neighborhood ? ` · ${row.neighborhood}` : ''}</td>
              <td>{row.activity_type}</td>
              <td>{row.conversations}</td>
              <td><span className="status respondido">{row.support}</span></td>
              <td>{row.undecided}</td>
            </tr>) : <tr><td colSpan={6}><div className="empty-state">Nenhuma ação registrada para esta liderança.</div></td></tr>}</tbody>
          </table>
        </div>
      </section>

      <div className="admin-footnote no-print"><FileText size={14} /> Use “Exportar PDF” para salvar este relatório ou imprimir uma cópia.</div>
    </main>
  );
}
