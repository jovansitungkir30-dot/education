import { useEffect, useSyncExternalStore, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { KNOWLEDGE, type Fact, type Knowledge } from '../data/types';
import { SOURCES, CHECK_LABEL, checkOf, type SourceId } from '../data/sources';
import { photo, type PhotoId } from '../data/photos';
import { SAMPLES, audioState, play, setVolume, stop } from '../lib/audio';

const TONE: Record<Knowledge, string> = {
  history: 'border-emerald-700 bg-emerald-100 text-emerald-950',
  tradition: 'border-amber-700 bg-amber-100 text-amber-950',
  folklore: 'border-purple-700 bg-purple-100 text-purple-950',
  interpretation: 'border-sky-700 bg-sky-100 text-sky-950',
  contemporary: 'border-stone-600 bg-stone-100 text-stone-900',
};

export function KindTag({ kind }: { kind: Knowledge }) {
  return (
    <span title={KNOWLEDGE[kind].hint} className={`inline-block rounded border-l-4 px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wider ${TONE[kind]}`}>
      {KNOWLEDGE[kind].label}
    </span>
  );
}

export function SourceLinks({ ids }: { ids: SourceId[] }) {
  if (!ids.length) return <p className="mt-1 text-xs italic opacity-70">Belum ada sumber. Menunggu tinjauan ahli.</p>;
  return (
    <p className="mt-1 text-xs opacity-75">
      Sumber:{' '}
      {ids.map((id, i) => (
        <span key={id}>
          {i > 0 && '; '}
          <a className="underline underline-offset-2 hover:opacity-100" href={SOURCES[id].url} target="_blank" rel="noreferrer">
            {SOURCES[id].publisher}
          </a>
          {checkOf(id) !== 'read' && <span> ({CHECK_LABEL[checkOf(id)]})</span>}
        </span>
      ))}
    </p>
  );
}

/** For summaries, activities and notes that are not tied sentence by sentence to a source. */
export function ReviewNote({ className = '' }: { className?: string }) {
  return (
    <p className={`rounded-lg border border-dashed border-current/35 px-3 py-2 text-xs leading-relaxed opacity-80 ${className}`}>
      Ditulis untuk situs ini dan belum ditinjau ahli. Tautan sumber dipakai untuk pengecekan lebih lanjut dan tidak membuktikan setiap kalimat di sini.
    </p>
  );
}

export function FactBlock({ item }: { item: Fact }) {
  return (
    <div className="space-y-1.5">
      <KindTag kind={item.kind} />
      <p className="leading-relaxed">{item.text}</p>
      <SourceLinks ids={item.sources} />
    </div>
  );
}

export function Credit({ id, className = '' }: { id: PhotoId; className?: string }) {
  const p = photo(id);
  return (
    <span className={`text-[11px] leading-snug opacity-80 ${className}`}>
      Foto: <a className="underline" href={p.page} target="_blank" rel="noreferrer">{p.author}</a>,{' '}
      {p.licenseUrl ? <a className="underline" href={p.licenseUrl} target="_blank" rel="noreferrer">{p.license}</a> : p.license}
      , via Wikimedia Commons
    </span>
  );
}

export function Photo({ id, className = '', eager = false }: { id: PhotoId; className?: string; eager?: boolean }) {
  const p = photo(id);
  return <img src={`./${p.file}`} alt={p.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" className={`object-cover ${className}`} />;
}

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.65, delay }}>
      {children}
    </motion.div>
  );
}

export function SectionHead({ eyebrow, title, children, as: Tag = 'h2' }: { eyebrow: string; title: string; children?: ReactNode; as?: 'h1' | 'h2' }) {
  return (
    <Reveal className="max-w-3xl">
      <p className="eyebrow text-terracotta-400">{eyebrow}</p>
      <Tag className="display mt-3 mb-0">{title}</Tag>
      {children && <p className="mt-4 text-lg leading-relaxed opacity-80">{children}</p>}
    </Reveal>
  );
}

export function SoundDesk() {
  const current = useSyncExternalStore(audioState.subscribe, audioState.current);
  const volume = useSyncExternalStore(audioState.subscribe, audioState.volume);
  useEffect(() => stop, []);
  return (
    <div className="rounded-3xl border border-gold-500/30 bg-forest-900 p-6 text-ivory sm:p-8">
      <p className="eyebrow text-gold-300">Meja suara · contoh sintetis</p>
      <p className="mt-2 max-w-2xl text-sm opacity-80">
        Suara ini dibuat oleh browser Anda. Ini bukan rekaman pemusik tradisional dan tidak meniru komposisi gondang atau gordang mana pun. Tidak ada yang berbunyi sebelum Anda menekan Putar.
      </p>
      <ul className="mt-5 grid gap-3 p-0 md:grid-cols-3">
        {SAMPLES.map((s) => {
          const on = current === s.id;
          return (
            <li key={s.id} className="flex list-none flex-col justify-between gap-4 rounded-2xl bg-forest-800 p-5">
              <div>
                <h3 className="m-0 text-xl">{s.title}</h3>
                <p className="mt-1 text-sm opacity-75">{s.note}</p>
              </div>
              <button type="button" className={`btn self-start ${on ? 'btn-terra' : 'btn-gold'}`} aria-pressed={on} onClick={() => (on ? stop() : play(s.id))}>
                {on ? 'Jeda' : 'Putar'}
                <span className="sr-only"> {s.title}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <label className="mt-6 flex items-center gap-3 text-sm font-semibold">
        Volume suara
        <input type="range" min={0} max={1} step={0.05} value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-56 accent-gold-500" />
        <span className="tabular-nums">{Math.round(volume * 100)}%</span>
      </label>
    </div>
  );
}

/** Reads text aloud with the browser's own speech voice. */
export function Narrate({ text, label = 'Dengarkan narasi' }: { text: string; label?: string }) {
  const [state, setState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const supported = 'speechSynthesis' in window;

  useEffect(() => {
    setState('idle');
    return () => {
      if (supported) window.speechSynthesis.cancel();
    };
  }, [text, supported]);

  if (!supported) return <p className="text-sm opacity-70">Browser ini tidak mendukung narasi suara.</p>;

  const start = () => {
    const synth = window.speechSynthesis;
    if (state === 'paused') {
      synth.resume();
    } else {
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'id-ID';
      const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith('id'));
      if (voice) u.voice = voice;
      u.volume = audioState.volume();
      u.onend = () => setState('idle');
      synth.speak(u);
    }
    setState('playing');
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {state === 'playing' ? (
        <button type="button" className="btn btn-line" onClick={() => { window.speechSynthesis.pause(); setState('paused'); }}>Jeda narasi</button>
      ) : (
        <button type="button" className="btn btn-line" onClick={start}>{state === 'paused' ? 'Lanjutkan narasi' : label}</button>
      )}
      {state !== 'idle' && (
        <button type="button" className="btn btn-line" onClick={() => { window.speechSynthesis.cancel(); setState('idle'); }}>Berhenti</button>
      )}
      <span className="text-xs opacity-65">Suara komputer</span>
    </div>
  );
}
