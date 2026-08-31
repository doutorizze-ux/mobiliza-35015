'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-menu-wrap">
      <button className="mobile-nav" type="button" aria-label="Abrir menu" onClick={() => setOpen(value => !value)}>
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      {open && (
        <div className="mobile-menu">
          <Link href="/admin" onClick={() => setOpen(false)}>Visão geral</Link>
          <Link href="/admin/liderancas" onClick={() => setOpen(false)}>Lideranças</Link>
          <Link href="/admin/relatorio/raimundo-verissimo" onClick={() => setOpen(false)}>Relatório PDF</Link>
        </div>
      )}
    </div>
  );
}
