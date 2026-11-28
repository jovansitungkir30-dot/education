/** "Sumber & Kredit": references, photo credits and audio credits in one place, built from structured data. */
import { useEffect, useState } from 'react';
import { LANGUAGES, RELATIONS, type Language, type MediaItem, type Recording } from '../../data/media';
import { CHECK_LABEL, SOURCES, checkOf, type Source, type SourceId } from '../../data/sources';
import Drawer from './Drawer';

export interface AudioCredit extends Recording {
  language: Language;
}

type Tab = 'ref' | 'foto' | 'audio';

const GROUPS: [string, Source['type'][]][] = [
  ['Publikasi akademik', ['Akademik']],
  ['Pemerintah dan lembaga budaya', ['Lembaga warisan budaya', 'Pemerintah / media publik']],
  ['Pers', ['Pers']],
  ['Ensiklopedia', ['Ensiklopedia']],
];

interface Props {
  open: boolean;
  onClose: () => void;
  references: SourceId[];
  photos: MediaItem[];
  audio?: AudioCredit[];
  /** Reference to scroll to when opened from a citation number. */
  focus?: SourceId;
}

export default function SourcesPanel({ open, onClose, references, photos, audio = [], focus }: Props) {
  const [tab, setTab] = useState<Tab>('ref');

  useEffect(() => {
    if (!open || !focus) return;
    setTab('ref');
    const t = window.setTimeout(() => document.getElementById(`src-${focus}`)?.scrollIntoView({ block: 'center' }), 60);
    return () => window.clearTimeout(t);
  }, [open, focus]);

  const tabs: [Tab, string, number][] = [['ref', 'Referensi budaya', references.length], ['foto', 'Kredit foto', photos.length], ['audio', 'Kredit audio', audio.length]];

  return (
    <Drawer open={open} title="Sumber & Kredit" onClose={onClose}>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Jenis sumber">
        {tabs.map(([key, label, n]) => (
          <button key={key} type="button" role="tab" aria-selected={tab === key} className="chip" onClick={() => setTab(key)}>{label} ({n})</button>
        ))}
      </div>

      {tab === 'ref' && (
        <div className="mt-4">
          <p className="mt-0 text-sm">Status menunjukkan sejauh mana sumber sudah kami periksa. Belum ada yang ditinjau ahli.</p>
          {GROUPS.map(([label, types]) => {
            const list = references.filter((r) => types.includes(SOURCES[r].type));
            if (!list.length) return null;
            return (
              <section key={label} className="mt-4">
                <h3 className="mt-0 mb-1 text-lg">{label}</h3>
                <ul className="m-0 p-0">
                  {list.map((r) => (
                    <li key={r} id={`src-${r}`} className={`list-none border-t border-ink/15 py-2.5 text-sm ${focus === r ? '-mx-2 bg-cream px-2' : ''}`}>
                      <span className="mr-2 font-extrabold tabular-nums">[{references.indexOf(r) + 1}]</span>
                      <a className="font-bold underline underline-offset-2" href={SOURCES[r].url} target="_blank" rel="noreferrer">{SOURCES[r].title}</a>
                      <span className="block text-xs opacity-75">{SOURCES[r].publisher} · {CHECK_LABEL[checkOf(r)]}</span>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
          {!references.length && <p>Belum ada sumber terlampir.</p>}
        </div>
      )}

      {tab === 'foto' && (
        <ul className="mt-4 mb-0 p-0">
          {photos.map((p) => (
            <li key={p.file} className="flex list-none gap-3 border-t border-ink/15 py-3 text-sm">
              <img src={`./${p.file}`} alt="" loading="lazy" className="size-16 shrink-0 rounded object-cover" />
              <span>
                <span className="block font-bold">{p.alt}</span>
                <span className="block text-xs">{RELATIONS[p.relation].label}{p.place ? ` · ${p.place}` : ''}</span>
                <span className="block text-xs opacity-80">
                  <a className="underline" href={p.page} target="_blank" rel="noreferrer">{p.author} (berkas asli)</a>,{' '}
                  {p.licenseUrl ? <a className="underline" href={p.licenseUrl} target="_blank" rel="noreferrer">{p.license}</a> : p.license}, via Wikimedia Commons, ukuran diubah
                </span>
              </span>
            </li>
          ))}
          {!photos.length && <li className="list-none">Halaman ini tidak memuat foto.</li>}
        </ul>
      )}

      {tab === 'audio' && (
        <div className="mt-4">
          <p className="mt-0 text-sm">Rekaman asli di bawah ini adalah pelafalan kata oleh penutur, bukan musik. Bunyi pada simulasi alat musik dan narasi disintesis komputer, bukan rekaman.</p>
          <ul className="m-0 p-0">
            {audio.map((a) => (
              <li key={a.file} className="list-none border-t border-ink/15 py-2.5 text-sm">
                <strong>Rekaman asli:</strong> “{a.word}” ({LANGUAGES[a.language]}), penutur {a.speaker} ·{' '}
                <a className="underline" href={a.page} target="_blank" rel="noreferrer">sumber di Wikimedia Commons (Lingua Libre)</a> ·{' '}
                {a.licenseUrl ? <a className="underline" href={a.licenseUrl} target="_blank" rel="noreferrer">{a.license}</a> : a.license}
              </li>
            ))}
            {!audio.length && <li className="list-none text-sm">Halaman ini tidak memuat rekaman.</li>}
          </ul>
        </div>
      )}
    </Drawer>
  );
}
