import { useEffect, useRef, useState } from 'react';
import Activity from '../components/Activity';
import Quiz from '../components/Quiz';
import { Credit, Photo, SectionHead, SourceLinks } from '../components/ui';
import { MODULES, type Module } from '../data/modules';
import { REGIONS } from '../data/regions';
import { ARTIFACTS } from '../data/artifacts';
import { STORIES } from '../data/stories';
import { go, href } from '../lib/router';
import { passedModules, useProgress, type ProgressState } from '../lib/progress';

const EXPLORER = { regions: 5, artifacts: 3, stories: 2 };

const isExplorer = (s: ProgressState) =>
  s.visited.region.length >= EXPLORER.regions && s.visited.artifact.length >= EXPLORER.artifacts && s.visited.story.length >= EXPLORER.stories;

function ModuleView({ module }: { module: Module }) {
  const { visit, state } = useProgress();
  return (
    <article className="paper rounded-3xl p-5 sm:p-10">
      <p className="eyebrow text-terracotta-700">Learning module</p>
      <h2 className="display mt-2 mb-6">{module.title}</h2>
      <h3 className="text-2xl">Learning objectives</h3>
      <ul className="list-disc pl-5">{module.objectives.map((o) => <li key={o}>{o}</li>)}</ul>

      {module.lessons.map((l, i) => {
        const key = `${module.id}-${i}`;
        const read = state.visited.lesson.includes(key);
        return (
          <section key={key} className="mt-10 grid gap-6 border-t border-ink/15 pt-8 md:grid-cols-[1fr_1.4fr]">
            <figure className="m-0">
              <Photo id={l.photo} className="aspect-[4/3] w-full rounded-2xl" />
              <figcaption><Credit id={l.photo} /></figcaption>
            </figure>
            <div>
              <h3 className="mt-0 text-2xl">{i + 1}. {l.title}</h3>
              <p className="leading-relaxed">{l.body}</p>
              <button type="button" className="btn btn-line" disabled={read} onClick={() => visit('lesson', key)}>{read ? '✓ Read' : 'Mark as read (+10)'}</button>
            </div>
          </section>
        );
      })}

      <div className="mt-8"><SourceLinks ids={module.sources} /></div>
      <section className="mt-10 border-t border-ink/15 pt-8"><Activity key={module.id} data={module.activity} /></section>
      <section className="mt-10 rounded-2xl bg-cream p-5 sm:p-8"><Quiz key={module.id} module={module} /></section>
    </article>
  );
}

function Achievements() {
  const { state, points, setName, reset } = useProgress();
  const [confirming, setConfirming] = useState(false);
  const passed = passedModules(state);
  const complete = passed.length === MODULES.length;
  const meters = [
    ['Modules passed', passed.length, MODULES.length],
    ['Places visited', state.visited.region.length, REGIONS.length],
    ['Artifacts explored', state.visited.artifact.length, ARTIFACTS.length],
    ['Stories completed', state.visited.story.length, STORIES.length],
  ] as const;
  const badges = [
    { name: 'Cultural Explorer', how: `Visit ${EXPLORER.regions} places, explore ${EXPLORER.artifacts} artifacts and complete ${EXPLORER.stories} stories.`, earned: isExplorer(state) },
    ...MODULES.map((m) => ({ name: m.badge, how: `Pass the quiz in “${m.title}”.`, earned: passed.includes(m.id) })),
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-forest-900 p-6 sm:p-10">
        <p className="eyebrow text-gold-300">Your journey</p>
        <h2 className="mt-2 mb-6 text-4xl">{points} exploration points</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {meters.map(([label, n, total]) => (
            <label key={label} className="text-sm font-semibold">
              <span className="flex justify-between"><span>{label}</span><span>{n}/{total}</span></span>
              <progress className="mt-1.5 h-2 w-full accent-gold-500" value={n} max={total} />
            </label>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl">Badges</h2>
        <ul className="grid gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((b) => (
            <li key={b.name} className={`flex list-none gap-4 rounded-2xl border p-4 ${b.earned ? 'border-gold-500 bg-forest-800' : 'border-ivory/15 opacity-65'}`}>
              <svg viewBox="0 0 48 48" className="size-12 shrink-0" aria-hidden="true">
                <path d="M24 2L43 13V35L24 46L5 35V13Z" fill={b.earned ? '#c9a24b' : 'none'} stroke="#c9a24b" strokeWidth="2" />
                <path d="M24 12L36 24L24 36L12 24Z" fill="none" stroke={b.earned ? '#0f231b' : '#c9a24b'} strokeWidth="2.5" />
              </svg>
              <div>
                <p className="m-0 font-display text-xl">{b.name}</p>
                <p className="m-0 text-sm opacity-80">{b.earned ? 'Earned. ' : 'Locked. '}{b.how}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-3xl">Certificate of completion</h2>
        {complete ? (
          <>
            <label className="mb-4 flex max-w-md flex-col gap-1 text-sm font-semibold">
              Name to show on the certificate
              <input className="min-h-11 rounded-lg border border-ivory/30 bg-forest-900 px-3 text-base" value={state.name} maxLength={60} onChange={(e) => setName(e.target.value)} />
            </label>
            <div id="certificate" className="paper border-[10px] border-double border-gold-700 p-8 text-center sm:p-14">
              <p className="eyebrow">RuangNusantara</p>
              <h3 className="mt-3 text-3xl sm:text-4xl">Certificate of Completion</h3>
              <p>This records that</p>
              <p className="font-display text-3xl break-words text-terracotta-700">{state.name.trim() || 'Your name'}</p>
              <p>passed all {MODULES.length} learning modules on the cultural heritage of North Sumatra.</p>
              <div className="weave mx-auto my-4 w-60" />
              <p className="mb-0 text-xs">Self-guided learning record · {points} points · Not an accredited qualification.</p>
            </div>
            <button type="button" className="btn btn-gold mt-4" onClick={() => window.print()}>Print or save as PDF</button>
          </>
        ) : (
          <p className="rounded-2xl border border-dashed border-ivory/30 p-6">Pass all {MODULES.length} modules to unlock your certificate. {MODULES.length - passed.length} to go.</p>
        )}
      </section>

      <section className="border-t border-ivory/15 pt-5">
        {confirming ? (
          <div className="flex flex-wrap items-center gap-3">
            <span>Erase all points, badges and quiz scores in this browser?</span>
            <button type="button" className="btn btn-terra" onClick={() => { reset(); setConfirming(false); }}>Yes, erase</button>
            <button type="button" className="btn btn-line" onClick={() => setConfirming(false)}>Keep my progress</button>
          </div>
        ) : (
          <button type="button" className="btn btn-line" onClick={() => setConfirming(true)}>Reset progress</button>
        )}
      </section>
    </div>
  );
}

export default function Learn({ params }: { params: URLSearchParams }) {
  const { state } = useProgress();
  const passed = passedModules(state);
  const showProgress = params.get('view') === 'progress';
  const requested = MODULES.find((m) => m.id === params.get('module'));
  const module = requested ?? MODULES[0];
  const locked = passed.length < module.requires && !passed.includes(module.id);
  const body = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!params.get('module') && !params.get('view')) return;
    const t = window.setTimeout(() => body.current?.scrollIntoView(), 80);
    return () => window.clearTimeout(t);
  }, [params.get('module'), params.get('view')]);

  return (
    <div className="pt-30 pb-20">
      <div className="wrap">
        <SectionHead as="h1" eyebrow="Learning paths" title="Learn at your own pace">
          Read, try an activity, then take a short quiz. Passing modules opens further paths.
        </SectionHead>

        <div ref={body} className="mt-10 grid scroll-mt-24 grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
          <nav aria-label="Learning modules" className="min-w-0 lg:sticky lg:top-22 lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto">
            <button type="button" className="chip mb-3 w-full" aria-pressed={showProgress} onClick={() => go('/learn', { view: 'progress' })}>Progress, badges and certificate</button>
            <ol className="m-0 flex gap-2 overflow-x-auto p-0 lg:block lg:space-y-2">
              {MODULES.map((m, i) => {
                const isPassed = passed.includes(m.id);
                const isLocked = !isPassed && passed.length < m.requires;
                const active = !showProgress && m.id === module.id;
                const read = m.lessons.filter((_, n) => state.visited.lesson.includes(`${m.id}-${n}`)).length;
                return (
                  <li key={m.id} className="w-64 shrink-0 list-none lg:w-auto">
                    <a href={href('/learn', { module: m.id })} aria-current={active ? 'step' : undefined} className={`flex h-full gap-3 rounded-2xl border p-3.5 ${active ? 'border-gold-500 bg-forest-800' : 'border-ivory/15 hover:border-ivory/40'}`}>
                      <span className="font-display text-2xl text-gold-300">{i + 1}</span>
                      <span>
                        <span className="block text-sm leading-snug font-bold">{m.title}</span>
                        <span className="text-xs opacity-70">
                          {isPassed ? `✓ Passed · ${state.scores[m.id]}%` : isLocked ? `🔒 Pass ${m.requires} module${m.requires > 1 ? 's' : ''}` : `${read}/${m.lessons.length} lessons read`}
                        </span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="min-w-0">
            {showProgress ? (
              <Achievements />
            ) : locked ? (
              <div className="paper rounded-3xl p-8 sm:p-14">
                <h2 className="mt-0 text-4xl">{module.title} is still locked</h2>
                <p>Pass {module.requires - passed.length} more module{module.requires - passed.length > 1 ? 's' : ''} to open this path.</p>
                <a className="btn btn-terra" href={href('/learn', { module: MODULES.find((m) => !passed.includes(m.id) && passed.length >= m.requires)?.id ?? 'intro' })}>Go to an open module</a>
              </div>
            ) : (
              <ModuleView key={module.id} module={module} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
