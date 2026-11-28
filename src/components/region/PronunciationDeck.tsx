import { useEffect, useRef, useState } from 'react';
import { LANGUAGES, RECORDINGS, type Language, type Recording } from '../../data/media';

type Status = 'idle' | 'loading' | 'playing' | 'error';

/**
 * Real recordings of single words by speakers, from the Lingua Libre project. They are pronunciation
 * samples, not music, and no translation is offered because we have not verified one.
 */
export default function PronunciationDeck({ language }: { language: Language }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [now, setNow] = useState<{ file: string; status: Status }>({ file: '', status: 'idle' });
  const [volume, setVolume] = useState(0.9);
  const list = RECORDINGS[language] ?? [];

  useEffect(() => () => audio.current?.pause(), [language]);
  useEffect(() => { if (audio.current) audio.current.volume = volume; }, [volume]);

  const toggle = (r: Recording) => {
    const playing = now.file === r.file && now.status === 'playing';
    audio.current?.pause();
    if (playing) return setNow({ file: '', status: 'idle' });
    const a = new Audio(`./${r.file}`);
    a.volume = volume;
    audio.current = a;
    setNow({ file: r.file, status: 'loading' });
    const own = (status: Status) => () => { if (audio.current === a) setNow({ file: r.file, status }); };
    a.onplaying = own('playing');
    a.onended = own('idle');
    a.onerror = own('error');
    a.play().catch(own('error'));
  };

  if (!list.length) return null;
  const credits = [...new Map(list.map((r) => [r.speaker + r.license, r])).values()];

  return (
    <div className="rounded-lg border border-ink/15 bg-cream p-5">
      <p className="eyebrow m-0 text-terracotta-700">Rekaman asli penutur · bukan musik</p>
      <h3 className="mt-1 mb-1 text-2xl">Dengar bahasa {LANGUAGES[language]}</h3>
      <p className="m-0 max-w-2xl text-sm">Ketuk sebuah kata untuk mendengar pelafalannya. Arti kata tidak dicantumkan karena belum kami verifikasi. Bahasa ini dituturkan melampaui batas satu kabupaten atau kota.</p>
      <ul className="mt-4 flex flex-wrap gap-2 p-0">
        {list.map((r) => {
          const on = now.file === r.file;
          const state = on ? now.status : 'idle';
          return (
            <li key={r.file} className="list-none">
              <button type="button" className="chip bg-ivory" aria-pressed={state === 'playing'} aria-label={`${state === 'playing' ? 'Hentikan' : 'Putar'} pelafalan kata ${r.word}`} onClick={() => toggle(r)}>
                <span aria-hidden="true">{state === 'playing' ? '■ ' : state === 'loading' ? '… ' : '▶ '}</span>
                <span lang={language} className="font-display text-lg">{r.word}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="m-0 min-h-5 text-sm" role="status">
        {now.status === 'loading' && 'Memuat rekaman…'}
        {now.status === 'error' && 'Rekaman ini tidak dapat diputar di perangkat Anda. Coba lagi atau buka halaman sumbernya.'}
      </p>
      <label className="mt-2 flex items-center gap-3 text-sm font-semibold">
        Volume
        <input type="range" min={0} max={1} step={0.05} value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-44 accent-terracotta-500" />
        <span className="tabular-nums">{Math.round(volume * 100)}%</span>
      </label>
      <p className="mt-3 mb-0 text-xs leading-relaxed opacity-75">
        Sumber: Lingua Libre via Wikimedia Commons.{' '}
        {credits.map((r, i) => (
          <span key={r.file}>
            {i > 0 && '; '}
            <a className="underline" href={r.page} target="_blank" rel="noreferrer">penutur {r.speaker}</a> ({r.licenseUrl ? <a className="underline" href={r.licenseUrl} target="_blank" rel="noreferrer">{r.license}</a> : r.license})
          </span>
        ))}
        .
      </p>
    </div>
  );
}
