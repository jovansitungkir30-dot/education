/** One guided journey: look, compare, then do something with what you saw, station by station. */
import { useEffect, useRef, useState } from 'react';
import type { Journey } from '../../data/journeys';
import { JOURNEYS } from '../../data/journeys';
import { RELATIONS, type MediaItem } from '../../data/media';
import { useProgress } from '../../lib/progress';
import { href } from '../../lib/router';
import SourcesPanel from '../credits/SourcesPanel';
import { Question } from './questions';
import StationImage from './StationImage';

const photosIn = (j: Journey) => [
  ...new Map(j.stations.flatMap((s) => [s.photo, ...(s.compare ?? []).map((c) => c.photo)]).filter((p): p is MediaItem => !!p).map((p) => [p.file, p])).values(),
];

export default function JourneyPlayer({ journey }: { journey: Journey }) {
  const { state, visit } = useProgress();
  const key = (n: number) => `jalur-${journey.id}-${n}`;
  const firstOpen = journey.stations.findIndex((_, n) => !state.visited.lesson.includes(key(n)));
  const [at, setAt] = useState(() => Math.max(0, firstOpen));
  const [results, setResults] = useState<(boolean | null)[]>(() => journey.stations.map(() => null));
  const [finished, setFinished] = useState(false);
  const [panel, setPanel] = useState(false);
  const top = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const station = journey.stations[at];
  const next = JOURNEYS[(JOURNEYS.indexOf(journey) + 1) % JOURNEYS.length];

  useEffect(() => {
    document.title = `${journey.title} · RuangNusantara`;
  }, [journey]);
  useEffect(() => {
    if (!moved.current) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
    top.current?.focus({ preventScroll: true });
  }, [at, finished]);

  const goTo = (n: number) => {
    moved.current = true;
    setFinished(false);
    setAt(n);
  };
  const answer = (ok: boolean) => {
    setResults((r) => r.map((x, i) => (i === at ? ok : x)));
    visit('lesson', key(at));
  };
  const answered = results.filter((r) => r !== null).length;

  return (
    <div className="paper min-h-dvh pb-16 text-ink">
      <header className="bg-forest-900 pt-24 pb-5 text-ivory">
        <div className="wrap">
          <a className="inline-flex min-h-11 items-center text-sm font-bold text-gold-300 hover:underline" href={href('/learn')}>← Semua jalur</a>
          <h1 className="mt-1 mb-3 text-3xl sm:text-4xl">{journey.title}</h1>
          <ol className="m-0 flex gap-1.5 overflow-x-auto p-0 pb-1" aria-label="Perhentian">
            {journey.stations.map((s, i) => {
              const seen = state.visited.lesson.includes(key(i));
              return (
                <li key={s.title} className="min-w-28 flex-1 list-none">
                  <button type="button" aria-current={i === at && !finished ? 'step' : undefined} onClick={() => goTo(i)} className={`block min-h-14 w-full cursor-pointer border-t-4 pt-2 pr-2 text-left text-xs ${i === at && !finished ? 'border-gold-300 font-extrabold' : seen ? 'border-gold-700 opacity-90' : 'border-ivory/25 opacity-70'}`}>
                    {seen ? '✓ ' : `${i + 1}. `}{s.title}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </header>

      <div ref={top} tabIndex={-1} className="wrap pt-8 outline-none">
        {finished ? (
          <div className="mx-auto max-w-2xl py-8 text-center" role="status">
            <p className="eyebrow m-0 text-terracotta-700">Perjalanan selesai</p>
            <h2 className="mt-2 mb-3 text-4xl">{journey.title}</h2>
            <p className="text-lg">{answered ? `Dalam sesi ini Anda menjawab tepat ${results.filter(Boolean).length} dari ${answered} tantangan.` : 'Anda sudah menyelesaikan semua perhentian.'}</p>
            <ul className="mx-auto my-5 max-w-md p-0 text-left">
              {journey.stations.map((s) => <li key={s.title} className="list-none border-t border-ink/15 py-2.5"><a className="font-bold underline underline-offset-2" href={href(s.more.path, s.more.params)}>{s.title}</a><span className="block text-sm opacity-80">{s.why}</span></li>)}
            </ul>
            <div className="flex flex-wrap justify-center gap-3">
              <a className="btn btn-terra" href={href('/learn', { jalur: next.id })}>Jalur berikutnya: {next.title} →</a>
              <a className="btn btn-line" href={href('/explore')}>Jelajahi peta</a>
            </div>
          </div>
        ) : (
          <article key={at} className="animate-[rise_0.4s_ease-out]">
            <p className="eyebrow m-0 text-terracotta-700">Perhentian {at + 1} dari {journey.stations.length}</p>
            <h2 className="mt-1 mb-2 text-4xl">{station.title}</h2>
            <p className="mt-0 max-w-[65ch] border-l-4 border-terracotta-500 pl-4 text-lg"><strong>Mengapa penting: </strong>{station.why}</p>
            <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
              <div className="min-w-0">
                {station.photo && (
                  <figure className="m-0 mb-5">
                    <StationImage photo={station.photo} className="max-h-[52dvh] w-full rounded-xl" />
                    <figcaption className="mt-1.5 text-xs"><strong>{RELATIONS[station.photo.relation].label}:</strong> {station.photo.alt}</figcaption>
                  </figure>
                )}
                {station.text.map((t) => <p key={t} className="max-w-[62ch] text-[1.05rem] leading-[1.75]">{t}</p>)}
                {station.compare && (
                  <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-ink/20" aria-label="Perbandingan">
                    {station.compare.map((side) => (
                      <section key={side.title} className="bg-cream p-4">
                        {side.photo && <StationImage photo={side.photo} className="mb-3 aspect-[4/3] w-full rounded-md" />}
                        <h3 className="mt-0 mb-2 text-xl">{side.title}</h3>
                        <ul className="m-0 list-disc space-y-1 pl-4 text-sm">{side.points.map((p) => <li key={p}>{p}</li>)}</ul>
                      </section>
                    ))}
                  </div>
                )}
                <a className="btn btn-line mt-5" href={href(station.more.path, station.more.params)}>{station.more.label} →</a>
              </div>
              <div className="min-w-0 rounded-xl border-2 border-ink/15 bg-white/55 p-5 lg:self-start">
                <p className="eyebrow mt-0 mb-3 text-terracotta-700">Giliran Anda</p>
                <Question ask={station.ask} result={results[at]} onAnswer={answer} />
                <div className="mt-5 flex flex-wrap gap-2">
                  {at > 0 && <button type="button" className="btn btn-line" onClick={() => goTo(at - 1)}>← Sebelumnya</button>}
                  <button type="button" className={`btn ${results[at] === null ? 'btn-line' : 'btn-terra'}`} onClick={() => { if (at === journey.stations.length - 1) { moved.current = true; setFinished(true); } else goTo(at + 1); }}>
                    {results[at] === null ? 'Lewati dulu' : at === journey.stations.length - 1 ? 'Selesaikan perjalanan' : 'Perhentian berikutnya →'}
                  </button>
                </div>
              </div>
            </div>
            <button type="button" className="mt-8 min-h-11 cursor-pointer text-sm font-bold underline" onClick={() => setPanel(true)}>Kredit foto jalur ini</button>
          </article>
        )}
      </div>
      <SourcesPanel open={panel} onClose={() => setPanel(false)} references={[]} photos={photosIn(journey)} />
    </div>
  );
}
