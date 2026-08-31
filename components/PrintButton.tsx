'use client';

import { Printer } from 'lucide-react';

export default function PrintButton() {
  return <button className="print-button" type="button" onClick={() => window.print()}><Printer size={15} /> Exportar PDF</button>;
}
