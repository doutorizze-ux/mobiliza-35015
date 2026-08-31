import { notFound } from 'next/navigation';
import PublicActionPage from '@/components/PublicActionPage';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

const fallbackLeaders: Record<string, string> = {
  'raimundo-verissimo': 'Raimundo Veríssimo',
  'maria-oliveira': 'Maria Oliveira',
  'carlos-santos': 'Carlos Santos',
};

export default async function Lideranca({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let name = fallbackLeaders[slug];

  try {
    const result = await db.query('SELECT name FROM leaders WHERE slug=$1 AND active=true', [slug]);
    if (!result.rows[0] && !name) return notFound();
    if (result.rows[0]) name = result.rows[0].name;
  } catch {
    if (!name) return notFound();
  }

  return <PublicActionPage leaderName={name || slug} leaderSlug={slug} />;
}
