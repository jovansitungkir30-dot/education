import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Credit, FactBlock, KindTag, Narrate, Photo, Reveal, SectionHead, SoundDesk } from '../components/ui';
import { STORIES, type Story } from '../data/stories';
import { REGIONS } from '../data/regions';
import { KNOWLEDGE, type Knowledge } from '../data/types';
import { go, href } from '../lib/router';
import { useProgress } from '../lib/progress';

/** Scroll-driven reader: the image follows whichever chapter is in the middle of the screen. */
function Reader({ story }: { story: Story }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const { visit, state } = useProgress();
  const done = state.visited.story.includes(story.id);
  const current = story.chapters[Math.min(active, story.chapters.length - 1)];

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.i))),
      { rootMargin: '-45% 0px -45% 0px' },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [story]);

  const narration = `${story.title}. ${KNOWLEDGE[story.kind].label}. ${story.intro} ${story.chapters.map((c) => `${c.title}. ${c.fact.text}`).join(' ')}`;

  return (
    <div className="paper py-16">
      <div className="wrap">
        <header className="max-w-2xl">
          <KindTag kind={story.kind} />
          <h2 className="display mt-3 mb-3">{story.title}</h2>
          <p className="text-lg opacity-80">{story.intro}</p>
          <div className="mt-4"><Narrate text={narration} /></div>
        </header>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="hidden lg:block">
            <div className="sticky top-26 h-[calc(100dvh-9rem)]">
              <div className="relative h-[calc(100%-2rem)] overflow-hidden rounded-t-[10rem] rounded-b-3xl bg-forest-900">
                <AnimatePresence>
                  <motion.div key={`${story.id}-${active}`} className="absolute inset-0" initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
                    <Photo id={current.photo} className="size-full" eager />
                  </motion.div>
                </AnimatePresence>
              </div>
              <p className="mt-2"><Credit id={current.photo} /> {story.kind === 'folklore' && <span className="text-[11px]">· Photos set the mood and do not depict the legend.</span>}</p>
            </div>
          </div>

          <ol className="m-0 p-0">
            {story.chapters.map((c, i) => (
              <li key={`${story.id}-${i}`} ref={(el) => { refs.current[i] = el; }} data-i={i} className="flex list-none flex-col justify-center border-l-2 border-ink/15 py-10 pl-6 lg:min-h-[62dvh]">
                <p className="eyebrow text-terracotta-700">Chapter {i + 1} of {story.chapters.length}</p>
                <h3 className="mt-2 mb-4 text-3xl sm:text-4xl">{c.title}</h3>
                <figure className="mt-0 mb-5 lg:hidden">
                  <Photo id={c.photo} className="aspect-video w-full rounded-2xl" />
                  <figcaption><Credit id={c.photo} /></figcaption>
                </figure>
                <div className="text-lg"><FactBlock item={c.fact} /></div>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-8 text-center">
          <button type="button" className="btn btn-terra" disabled={done} onClick={() => visit('story', story.id)}>
            {done ? '✓ Story completed' : 'Mark story as completed (+15 points)'}
          </button>
        </div>
      </div>
    </div>
  );
}

const TIMELINE: { when: string; what: string; kind: Knowledge }[] = [
  { when: 'About 74,000 years ago', what: 'Most recent giant eruption at the Toba caldera (estimates vary).', kind: 'history' },
  { when: 'About 1887–1892', what: 'Istana Maimun is built for the Sultanate of Deli (sources vary slightly).', kind: 'history' },
  { when: 'Early 1900s', what: 'Colonial administration places Pakpak customary areas in separate units.', kind: 'history' },
  { when: '2004–2005', what: 'Earthquakes strike Nias; traditional houses largely perform well.', kind: 'history' },
  { when: '2009', what: 'Bawomataluo enters the UNESCO Tentative List. The Tjong A Fie Mansion opens as a museum.', kind: 'contemporary' },
  { when: 'After 2020', what: 'A UNESCO project supports ulos weavers and gorga carvers during pandemic recovery.', kind: 'contemporary' },
];

export default function Cultures({ params }: { params: URLSearchParams }) {
  const story = STORIES.find((s) => s.id === params.get('story')) ?? STORIES[0];
  const readerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!params.get('story')) return;
    const t = window.setTimeout(() => readerRef.current?.scrollIntoView(), 120);
    return () => window.clearTimeout(t);
  }, [params.get('story')]);

  return (
    <>
      <section className="pt-30 pb-14">
        <div className="wrap">
          <SectionHead as="h1" eyebrow="Cultures and storytelling" title="Stories That Shape Identity">
            Every passage is labelled, so a legend is never mistaken for history and an interpretation is never presented as settled fact.
          </SectionHead>
          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-3 p-0">
            {(Object.keys(KNOWLEDGE) as Knowledge[]).map((k) => (
              <li key={k} className="max-w-xs list-none text-sm"><KindTag kind={k} /><p className="mt-1.5 opacity-70">{KNOWLEDGE[k].hint}</p></li>
            ))}
          </ul>
          <div className="mt-8 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Choose a story">
            {STORIES.map((s) => (
              <button key={s.id} type="button" className="chip" aria-pressed={s.id === story.id} onClick={() => go('/cultures', { story: s.id })}>{s.title}</button>
            ))}
          </div>
        </div>
      </section>

      <div ref={readerRef} className="scroll-mt-18"><Reader key={story.id} story={story} /></div>

      <section className="py-24">
        <div className="wrap">
          <SectionHead eyebrow="Timeline" title="A few dated moments">A selection, not a complete history of any community.</SectionHead>
          <ol className="mt-10 grid gap-x-8 p-0 md:grid-cols-3">
            {TIMELINE.map((t, i) => (
              <li key={t.when} className="list-none border-t border-gold-500/50 py-6">
                <Reveal delay={(i % 3) * 0.08}>
                  <p className="font-display text-2xl text-gold-300">{t.when}</p>
                  <p className="my-3 opacity-85">{t.what}</p>
                  <KindTag kind={t.kind} />
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="paper py-24">
        <div className="wrap">
          <SectionHead eyebrow="Peoples and places" title="Meet them one at a time" />
          <ul className="mt-10 p-0">
            {REGIONS.filter((r) => r.category === 'Cultural community').map((r) => (
              <li key={r.id} className="list-none border-t border-ink/20">
                <a className="group grid gap-2 py-6 sm:grid-cols-[1fr_2fr_auto] sm:items-center" href={href('/explore', { region: r.id })}>
                  <h3 className="m-0 text-3xl group-hover:text-terracotta-700">{r.name}</h3>
                  <p className="m-0 opacity-75">{r.summary}</p>
                  <span className="text-sm font-bold">Open on map →</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20"><div className="wrap"><SoundDesk /></div></section>
    </>
  );
}
