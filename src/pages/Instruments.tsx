/** The instrument room: play a model the way the instrument is played, and read what that action means. */
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CitationContext } from '../components/credits/citations';
import SourcesPanel from '../components/credits/SourcesPanel';
import { SourceLinks } from '../components/ui';
import { INSTRUMENTS } from '../data/instruments';
import { HERITAGE_PHOTOS, RELATIONS } from '../data/media';
import type { SourceId } from '../data/sources';
import { play, setInstrumentVolume } from '../lib/instrumentAudio';
import { useProgress } from '../lib/progress';
import { go } from '../lib/router';

const InstrumentStage = lazy(() => import('../three/instruments/InstrumentStage'));

export default function Instruments({ params }: { params: URLSearchParams }) {
  const instrument = INSTRUMENTS.find((x) => x.id === params.get('id')) ?? INSTRUMENTS[0];
  const hits = useRef<Record<string, number>>({});
  const [last, setLast] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [reset, setReset] = useState(0);
  const [tried, setTried] = useState<string[]>([]);
  const [panel, setPanel] = useState<{ focus?: SourceId } | null>(null);
  const timers = useRef<number[]>([]);
  const { visit } = useProgress();
  const photo = instrument.photo ? HERITAGE_PHOTOS[instrument.photo] : undefined;

  const references = useMemo(() => [...instrument.sources], [instrument]);
  const citations = useMemo(() => ({ number: (s: SourceId) => references.indexOf(s) + 1, open: (focus?: SourceId) => setPanel({ focus }) }), [references]);

  const strike = useCallback((partId: string) => {
    const part = instrument.parts.find((p) => p.id === partId);
    if (!part) return;
    hits.current[partId] = performance.now();
    play(part.voice, part.pitch);
    setLast(part.label);
    setTried((t) => (t.includes(partId) ? t : [...t, partId]));
  }, [instrument]);

  const stopDemo = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };
  /** Plays every part once in order, so their differences can be compared. It is not a traditional piece. */
  const compare = () => {
    stopDemo();
    timers.current = instrument.parts.map((p, i) => window.setTimeout(() => strike(p.id), i * (instrument.id === 'aramba' ? 1800 : 520)));
  };

  useEffect(() => {
    hits.current = {};
    setLast(null);
    setTried([]);
    return stopDemo;
  }, [instrument.id]);

  useEffect(() => {
    if (tried.length === instrument.parts.length) visit('lesson', `alat-${instrument.id}`);
  }, [tried, instrument, visit]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || (e.target as HTMLElement).closest('input,select,textarea,dialog')) return;
      const part = instrument.parts.find((p) => p.key === e.key);
      if (part) strike(part.id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [instrument, strike]);

  return (
    <CitationContext.Provider value={citations}>
      <div className="bg-forest-950 pt-22">
        <div className="wrap">
          <p className="eyebrow m-0 text-gold-300">Ruang alat musik</p>
          <h1 className="mt-1 mb-2 text-4xl sm:text-5xl">Mainkan, lalu pahami caranya</h1>
          <p className="m-0 max-w-2xl text-sm opacity-80">Bentuk dan cara main mengikuti sumber. <strong>Bunyinya disintesis komputer</strong>, bukan rekaman alat musik asli.</p>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Pilih alat musik">
            {INSTRUMENTS.map((x) => (
              <button key={x.id} type="button" className="chip whitespace-nowrap" aria-pressed={x.id === instrument.id} onClick={() => go('/alat-musik', { id: x.id })}>{x.name}</button>
            ))}
          </div>
        </div>

        <div className="relative mt-2 h-[56dvh] min-h-[340px] touch-none">
          <Suspense fallback={<div className="grid h-full place-items-center" role="status">Menyiapkan alat musik…</div>}>
            <InstrumentStage instrument={instrument} hits={hits} onPlay={strike} reset={reset} fallback={<div className="grid h-full place-items-center p-8 text-center">Perangkat ini tidak dapat menampilkan 3D. Alat tetap bisa dibunyikan dengan tombol di bawah.</div>} />
          </Suspense>
          <p className="pointer-events-none absolute top-2 left-1/2 m-0 w-max max-w-[92%] -translate-x-1/2 rounded-md bg-forest-950/80 px-3 py-1.5 text-center text-xs">
            {instrument.id === 'hasapi' ? 'Ketuk atau seret melintasi senar untuk memetik' : 'Ketuk permukaan alat untuk memukul'} · geser latar untuk melihat dari samping
          </p>
          <p className="pointer-events-none absolute bottom-2 left-1/2 m-0 -translate-x-1/2 font-display text-2xl whitespace-nowrap text-gold-300" role="status">{last ?? ''}</p>
        </div>

        <div className="wrap pb-6">
          <div className="grid grid-cols-2 gap-2 pt-3 sm:flex sm:flex-wrap sm:justify-center" role="group" aria-label={`Bagian ${instrument.name}`}>
            {instrument.parts.map((p) => (
              <button key={p.id} type="button" className="min-h-12 cursor-pointer rounded-md border border-ivory/30 px-3 py-1.5 text-left text-sm hover:border-gold-300 active:bg-gold-500 active:text-forest-950" onClick={() => strike(p.id)} aria-keyshortcuts={p.key}>
                <kbd className="mr-2 rounded bg-ivory/15 px-1.5 font-sans text-xs font-extrabold">{p.key}</kbd>{p.label}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button type="button" className="btn btn-gold" onClick={compare}>Bandingkan semua bunyi</button>
            <button type="button" className="btn btn-line" onClick={() => setReset((n) => n + 1)}>Atur ulang sudut</button>
            <label className="flex items-center gap-2 text-sm font-bold">
              Volume
              <input type="range" min={0} max={1} step={0.05} value={volume} onChange={(e) => { setVolume(Number(e.target.value)); setInstrumentVolume(Number(e.target.value)); }} className="w-36 accent-gold-500" />
            </label>
          </div>
          <p className="mt-3 mb-0 text-center text-sm" role="status">
            {tried.length === instrument.parts.length ? '✓ Semua bagian sudah Anda coba.' : `${tried.length} dari ${instrument.parts.length} bagian sudah dicoba.`}
          </p>
        </div>
      </div>

      <section className="paper py-12 text-ink">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div>
            <p className="eyebrow m-0 text-terracotta-700">{instrument.community} · {instrument.family}</p>
            <h2 className="mt-1 mb-4 text-4xl">{instrument.name}</h2>
            <dl className="m-0 max-w-[62ch] space-y-5 leading-[1.75]">
              <div><dt className="font-extrabold">Cara memainkan</dt><dd className="m-0">{instrument.how}<SourceLinks ids={instrument.sources} /></dd></div>
              <div><dt className="font-extrabold">Konteks budaya</dt><dd className="m-0">{instrument.context}</dd></div>
              <div className="border-l-4 border-terracotta-500 bg-cream py-2 pr-3 pl-4"><dt className="font-extrabold">Yang bisa Anda pelajari dari simulasi</dt><dd className="m-0">{instrument.teaches}</dd></div>
              <div className="text-sm opacity-80"><dt className="font-extrabold">Batas simulasi</dt><dd className="m-0">{instrument.limits}</dd></div>
            </dl>
            <button type="button" className="btn btn-line mt-5" onClick={() => setPanel({})}>Sumber &amp; Kredit</button>
          </div>
          <div>
            {photo ? (
              <figure className="m-0">
                <img src={`./${photo.file}`} alt={photo.alt} className="block w-full rounded-lg" />
                <figcaption className="mt-1.5 text-xs"><strong>{RELATIONS[photo.relation].label}:</strong> {photo.alt}</figcaption>
              </figure>
            ) : (
              <p className="m-0 rounded-lg border border-dashed border-ink/35 p-4 text-sm">Belum ada foto {instrument.name} berlisensi terbuka yang kami pastikan.</p>
            )}
          </div>
        </div>
      </section>
      <SourcesPanel open={!!panel} focus={panel?.focus} onClose={() => setPanel(null)} references={references} photos={photo ? [photo] : []} />
    </CitationContext.Provider>
  );
}
