/** Learning mode: guided journeys first, with the longer modules and personal progress alongside. */
import { useEffect, useRef, useState } from 'react';
import Activity from '../components/Activity';
import CulturalGalleryImage from '../components/learn/StationImage';
import JourneyPlayer from '../components/learn/JourneyPlayer';
import Achievements from '../components/learn/Achievements';
import Quiz from '../components/Quiz';
import { Credit, Photo, ReviewNote, SectionHead, SourceLinks } from '../components/ui';
import { JOURNEYS, journeyById } from '../data/journeys';
import { MODULES, type Module } from '../data/modules';
import { go, href } from '../lib/router';
import { passedModules, useProgress } from '../lib/progress';

export const stationKey = (journey: string, n: number) => `jalur-${journey}-${n}`;

function ModuleView({ module }: { module: Module }) {
  const { visit, state } = useProgress();
  return (
    <article className="paper rounded-xl p-5 sm:p-10">
      <p className="eyebrow text-terracotta-700">Modul mendalam</p>
      <h2 className="display mt-2 mb-6">{module.title}</h2>
      <ReviewNote className="mb-6" />
      <h3 className="text-2xl">Tujuan belajar</h3>
      <ul className="list-disc pl-5">{module.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
      {module.lessons.map((l, i) => {
        const key = `${module.id}-${i}`;
        const read = state.visited.lesson.includes(key);
        return (
          <section key={key} className="mt-10 grid gap-6 border-t border-ink/15 pt-8 md:grid-cols-[1fr_1.4fr]">
            <figure className="m-0">
              <Photo id={l.photo} className="aspect-[4/3] w-full rounded-lg" />
              <figcaption><Credit id={l.photo} /></figcaption>
            </figure>
            <div>
              <h3 className="mt-0 text-2xl">{i + 1}. {l.title}</h3>
              <p className="leading-relaxed">{l.body}</p>
              <button type="button" className="btn btn-line" disabled={read} onClick={() => visit('lesson', key)}>{read ? '✓ Sudah dibaca' : 'Tandai sudah dibaca (+10)'}</button>
            </div>
          </section>
        );
      })}
      <div className="mt-8"><SourceLinks ids={module.sources} /></div>
      <section className="mt-10 border-t border-ink/15 pt-8"><Activity key={module.id} data={module.activity} /></section>
      <section className="mt-10 rounded-lg bg-cream p-5 sm:p-8"><Quiz key={module.id} module={module} /></section>
    </article>
  );
}

function JourneyList() {
  const { state } = useProgress();
  const done = (id: string, n: number) => state.visited.lesson.includes(stationKey(id, n));
  return (
    <ol className="m-0 p-0">
      {JOURNEYS.map((j, i) => {
        const count = j.stations.filter((_, n) => done(j.id, n)).length;
        return (
          <li key={j.id} className="list-none border-t border-ivory/20">
            <a href={href('/learn', { jalur: j.id })} className="group grid items-center gap-4 py-5 sm:grid-cols-[3.5rem_13rem_minmax(0,1fr)_9rem] sm:gap-6">
              <span aria-hidden="true" className="font-display text-4xl text-gold-300 max-sm:hidden">{String(i + 1).padStart(2, '0')}</span>
              <CulturalGalleryImage photo={j.cover} className="aspect-[16/10] w-full rounded-lg transition-transform duration-500 group-hover:scale-[1.03]" />
              <span>
                <span className="block font-display text-3xl leading-tight group-hover:text-gold-300">{j.title}</span>
                <span className="mt-1 block opacity-80">{j.promise}</span>
              </span>
              <span className="text-sm font-bold">
                {count === j.stations.length ? '✓ Selesai' : count ? `Lanjutkan · ${count}/${j.stations.length}` : `Mulai · ${j.stations.length} perhentian`}
                <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-ivory/20"><span className="block h-full bg-gold-500" style={{ width: `${(count / j.stations.length) * 100}%` }} /></span>
              </span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}

export default function Learn({ params }: { params: URLSearchParams }) {
  const { state } = useProgress();
  const passed = passedModules(state);
  const journey = journeyById(params.get('jalur'));
  const requested = MODULES.find((m) => m.id === params.get('module'));
  const tab = params.get('view') === 'progress' ? 'kemajuan' : requested || params.get('view') === 'modul' ? 'modul' : 'jalur';
  const module = requested ?? MODULES[0];
  const locked = passed.length < module.requires && !passed.includes(module.id);
  const body = useRef<HTMLDivElement>(null);
  const [first] = useState(() => params.toString());

  useEffect(() => {
    if (journey || params.toString() === first) return;
    body.current?.scrollIntoView();
  }, [params.toString()]);

  if (journey) return <JourneyPlayer key={journey.id} journey={journey} />;

  return (
    <div className="pt-30 pb-20">
      <div className="wrap">
        <SectionHead as="h1" eyebrow="Mode belajar" title="Pilih satu perjalanan">
          Setiap perhentian mengajak Anda melihat, membandingkan, mengurutkan, atau menunjuk di peta, lalu menjelaskan mengapa itu penting.
        </SectionHead>
        <div ref={body} className="mt-8 flex scroll-mt-24 flex-wrap gap-2" role="group" aria-label="Bagian mode belajar">
          <button type="button" className="chip" aria-pressed={tab === 'jalur'} onClick={() => go('/learn')}>Jalur jelajah ({JOURNEYS.length})</button>
          <button type="button" className="chip" aria-pressed={tab === 'modul'} onClick={() => go('/learn', { view: 'modul' })}>Modul mendalam ({passed.length}/{MODULES.length})</button>
          <button type="button" className="chip" aria-pressed={tab === 'kemajuan'} onClick={() => go('/learn', { view: 'progress' })}>Kemajuan dan lencana</button>
        </div>

        <div className="mt-7">
          {tab === 'jalur' && <JourneyList />}
          {tab === 'kemajuan' && <Achievements />}
          {tab === 'modul' && (
            <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
              <nav aria-label="Modul belajar" className="min-w-0 lg:sticky lg:top-22">
                <ol className="m-0 flex gap-2 overflow-x-auto p-0 lg:block lg:space-y-2">
                  {MODULES.map((m, i) => {
                    const isPassed = passed.includes(m.id);
                    const isLocked = !isPassed && passed.length < m.requires;
                    const read = m.lessons.filter((_, n) => state.visited.lesson.includes(`${m.id}-${n}`)).length;
                    return (
                      <li key={m.id} className="w-64 shrink-0 list-none lg:w-auto">
                        <a href={href('/learn', { module: m.id })} aria-current={m.id === module.id ? 'step' : undefined} className={`flex h-full gap-3 rounded-lg border p-3.5 ${m.id === module.id ? 'border-gold-500 bg-forest-800' : 'border-ivory/15 hover:border-ivory/40'}`}>
                          <span className="font-display text-2xl text-gold-300">{i + 1}</span>
                          <span>
                            <span className="block text-sm leading-snug font-bold">{m.title}</span>
                            <span className="text-xs opacity-70">{isPassed ? `✓ Lulus · ${state.scores[m.id]}%` : isLocked ? `🔒 Luluskan ${m.requires} modul` : `${read}/${m.lessons.length} materi dibaca`}</span>
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ol>
              </nav>
              <div className="min-w-0">
                {locked ? (
                  <div className="paper rounded-xl p-8 sm:p-14">
                    <h2 className="mt-0 text-4xl">{module.title} masih terkunci</h2>
                    <p>Luluskan {module.requires - passed.length} modul lagi untuk membuka modul ini. Jalur jelajah dan halaman wilayah tidak pernah dikunci.</p>
                    <a className="btn btn-terra" href={href('/learn', { module: MODULES.find((m) => !passed.includes(m.id) && passed.length >= m.requires)?.id ?? 'intro' })}>Buka modul yang tersedia</a>
                  </div>
                ) : (
                  <ModuleView key={module.id} module={module} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
