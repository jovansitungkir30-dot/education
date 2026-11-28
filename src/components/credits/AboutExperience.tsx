import { useState } from 'react';
import { KNOWLEDGE, type Knowledge } from '../../data/types';
import { href } from '../../lib/router';
import { KindTag } from '../ui';
import Drawer from './Drawer';

/** The short version of how to read this atlas. The details open only when asked for. */
export const ESSENTIALS: [string, string][] = [
  ['Model 3D adalah tafsiran seni', 'Bentuknya disederhanakan dan bukan replika terukur.'],
  ['Wilayah bukan batas budaya', 'Satu tradisi bisa hidup di banyak daerah, dan satu daerah punya banyak komunitas.'],
  ['Cek sumbernya', 'Nomor kecil di samping teks membuka rujukan. Sebagian masih berupa ensiklopedia atau belum dibaca utuh.'],
  ['Belum ditinjau ahli', 'Koreksi dari warga dan komunitas setempat patut diutamakan.'],
];

export default function AboutExperience({ className = '', label = 'Tentang pengalaman ini' }: { className?: string; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={`inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm font-bold underline-offset-4 hover:underline ${className}`} onClick={() => setOpen(true)}>
        <span aria-hidden="true" className="grid size-5 place-items-center rounded-full border-2 border-current font-display text-xs">i</span>
        {label}
      </button>
      <Drawer open={open} title="Tentang pengalaman ini" onClose={() => setOpen(false)}>
        <dl className="m-0">
          {ESSENTIALS.map(([title, text]) => (
            <div key={title} className="border-t border-ink/15 py-3 first:border-t-0 first:pt-0">
              <dt className="font-extrabold">{title}</dt>
              <dd className="m-0">{text}</dd>
            </div>
          ))}
        </dl>
        <details className="mt-3">
          <summary className="min-h-11 cursor-pointer py-2 font-extrabold">Arti label pada teks</summary>
          <dl className="m-0 space-y-3">
            {(Object.keys(KNOWLEDGE) as Knowledge[]).map((k) => (
              <div key={k}><dt><KindTag kind={k} /></dt><dd className="mt-1 ml-0 text-sm">{KNOWLEDGE[k].hint}</dd></div>
            ))}
          </dl>
        </details>
        <a className="btn btn-terra mt-4" href={href('/about')} onClick={() => setOpen(false)}>Keterangan lengkap</a>
      </Drawer>
    </>
  );
}
