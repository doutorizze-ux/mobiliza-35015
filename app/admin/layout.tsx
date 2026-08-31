import Link from 'next/link';
import { BarChart3, ExternalLink, FileText, ShieldCheck, UsersRound } from 'lucide-react';
import MobileMenu from './MobileMenu';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="logo-mark">LL</span>
          <div>
            <strong>Mobiliza 35015</strong>
            <small>Painel privado</small>
          </div>
        </div>
        <nav aria-label="Navegação principal">
          <Link href="/admin"><BarChart3 size={17} /> Visão geral</Link>
          <Link href="/admin/liderancas"><UsersRound size={17} /> Lideranças</Link>
          <Link href="/admin/relatorio/raimundo-verissimo"><FileText size={17} /> Relatório PDF</Link>
        </nav>
        <div className="privacy-card">
          <ShieldCheck size={18} />
          <strong>Área restrita</strong>
          <p>Acesso exclusivo do diretor. Os dados são exibidos de forma agregada.</p>
        </div>
        <div className="sidebar-footer">
          <span>Uso interno</span>
          <Link href="/"><ExternalLink size={12} /> Ver formulário</Link>
        </div>
      </aside>
      <div className="dashboard">
        <header className="dash-header">
          <MobileMenu />
          <div>
            <p>Mobiliza 35015 · Operação de campo</p>
            <h1>Painel do diretor</h1>
          </div>
          <div className="user-chip">
            <span>DR</span>
            <div><strong>Diretor</strong><small>Administrador</small></div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
