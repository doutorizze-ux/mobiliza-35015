'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

export default function CopyLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/lideranca/${slug}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button className="icon-button" type="button" title="Copiar link" aria-label="Copiar link" onClick={copyLink}>
      {copied ? <Check size={15} /> : <Copy size={15} />}
    </button>
  );
}
