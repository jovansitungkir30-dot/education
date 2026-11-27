import { lazy, Suspense, useRef, useState, type PointerEvent, type KeyboardEvent } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { go, href } from '../lib/router';
import { useProgress, passedModules } from '../lib/progress';
import { REGIONS } from '../data/regions';
import { ARTIFACTS } from '../data/artifacts';
import { STORIES } from '../data/stories';
import { MODULES } from '../data/modules';
import { Credit, KindTag, Photo, Reveal, SectionHead, SoundDesk } from '../components/ui';
import type { Look } from '../three/HeroScene';

const HeroCanvas = lazy(() => import('../three/HeroCanvas'));

/** Painted-style SVG scene shown while 3D loads and on devices without WebGL. */
export function HeroFallback() {
  return (
    <svg className="absolute inset-0 size-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="1200" height="800" fill="#1d423d" />
      <circle cx="250" cy="230" r="55" fill="#f2c47c" />
      <path d="M0 450L180 300L330 410L520 270L760 430L940 290L1200 420V800H0Z" fill="#35594a" />
      <path d="M0 500C200 450 420 540 650 480S1000 470 1200 500V800H0Z" fill="#2b6168" />
      <path d="M0 690C300 600 700 720 1200 610V800H0Z" fill="#16352a" />
      <g transform="translate(760 440)">
        <path d="M0 20Q150 150 300 20L255 150H45Z" fill="#3a2d22" />
        <path d="M45 150L150 70L255 150Z" fill="#7e2a1c" />
        <path d="M60 150H240V215H60Z" fill="#6b4326" />
        <path d="M80 215V270M120 215V270M180 215V270M220 215V270" stroke="#3f2718" strokeWidth="12" />
      </g>
    </svg>
  );
}

function Hero() {
  const look = useRef<Look>({ yaw: 0, px: 0, py: 0 });
  const drag = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 600], [0, -70]);
  const textFade = useTransform(scrollY, [0, 520], [1, 0.15]);

  const turn = (delta: number) => {
    look.current.yaw = Math.max(-1.5, Math.min(1.5, look.current.yaw + delta));
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') {
      look.current.px = (e.clientX / window.innerWidth) * 2 - 1;
      look.current.py = (e.clientY / window.innerHeight) * 2 - 1;
    }
    if (drag.current !== null) {
      turn((drag.current - e.clientX) * 0.005);
      drag.current = e.clientX;
    }
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') turn(-0.2);
    if (e.key === 'ArrowRight') turn(0.2);
  };

  return (
    <section className="relative h-dvh min-h-[640px] overflow-hidden">
      <div
        className="absolute inset-0 cursor-grab touch-pan-y select-none active:cursor-grabbing"
        tabIndex={0}
        aria-label="Interactive landscape. Drag, or use the left and right arrow keys, to look around."
        role="application"
        onPointerDown={(e) => { drag.current = e.clientX; e.currentTarget.setPointerCapture(e.pointerId); }}
        onPointerMove={onMove}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
        onKeyDown={onKey}
      >
        <HeroFallback />
        <Suspense fallback={null}>
          <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}>
            <HeroCanvas look={look} onReady={() => setReady(true)} fallback={<HeroFallback />} />
          </div>
        </Suspense>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/45 via-35% to-transparent lg:bg-gradient-to-r lg:from-forest-950/90 lg:via-forest-950/45 lg:to-transparent lg:to-65%" />
      <motion.div style={{ y: textY, opacity: textFade }} className="wrap pointer-events-none relative flex h-full flex-col justify-end pb-24 lg:justify-center lg:pb-0">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.15 }} className="max-w-xl [text-shadow:0_2px_16px_rgb(0_0_0/0.45)]">
          <p className="eyebrow text-gold-300">RuangNusantara · North Sumatra</p>
          <h1 className="mt-4 mb-0 text-4xl leading-[1.02] sm:text-6xl xl:text-7xl">Discover the Living Heritage of North Sumatra.</h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-cream sm:text-lg">Explore traditions, stories, architecture, and cultural identities through an immersive digital journey.</p>
          <div className="pointer-events-auto mt-7 flex flex-wrap gap-3">
            <button type="button" className="btn btn-gold" onClick={() => go('/explore')}>Explore Culture</button>
            <button type="button" className="btn btn-line text-ivory" onClick={() => document.getElementById('journey')?.scrollIntoView()}>Begin Your Journey</button>
          </div>
        </motion.div>
      </motion.div>
      <div className="absolute right-4 bottom-5 flex items-center gap-2 text-xs sm:right-8">
        <span className="hidden opacity-75 sm:inline">Drag to look around · stylised scene</span>
        <button type="button" className="chip bg-forest-950/70" aria-label="Turn view left" onClick={() => turn(-0.35)}>←</button>
        <button type="button" className="chip bg-forest-950/70" aria-label="Turn view right" onClick={() => turn(0.35)}>→</button>
      </div>
    </section>
  );
}

const STOPS = [
  { to: '/explore', n: '01', title: 'Travel the map', text: 'Choose a landscape, community or city and read what is known about it.', done: (v: Record<string, string[]>) => v.region.length, total: REGIONS.length },
  { to: '/explore?view=artifacts', n: '02', title: 'Turn the objects', text: 'Rotate houses, drums and textiles in 3D.', done: (v: Record<string, string[]>) => v.artifact.length, total: ARTIFACTS.length },
  { to: '/cultures', n: '03', title: 'Follow the stories', text: 'History, tradition and folklore, each clearly labelled.', done: (v: Record<string, string[]>) => v.story.length, total: STORIES.length },
];

export default function Home() {
  const { state, points } = useProgress();
  const passed = passedModules(state).length;
  return (
    <>
      <Hero />

      <section id="journey" className="paper scroll-mt-16 py-24">
        <div className="wrap">
          <SectionHead eyebrow="Your virtual journey" title="Four ways into a many-voiced province">
            You have {points} exploration points. Progress is saved only in this browser.
          </SectionHead>
          <ol className="mt-14 p-0">
            {[...STOPS, { to: '/learn', n: '04', title: 'Learn and earn badges', text: 'Short modules, activities, quizzes and a certificate.', done: () => passed, total: MODULES.length }].map((s) => {
              const done = s.done(state.visited);
              return (
                <li key={s.n} className="list-none border-t border-ink/20">
                  <Reveal>
                    <a href={`#${s.to}`} className="group grid items-center gap-3 py-8 sm:grid-cols-[5rem_1fr_1fr_8rem]">
                      <span className="font-display text-3xl text-terracotta-500">{s.n}</span>
                      <h3 className="m-0 text-3xl transition-transform group-hover:translate-x-2 sm:text-4xl">{s.title}</h3>
                      <p className="m-0 max-w-sm opacity-75">{s.text}</p>
                      <span className="text-sm font-bold sm:text-right">
                        {done}/{s.total}
                        <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-ink/15">
                          <span className="block h-full bg-terracotta-500" style={{ width: `${(done / s.total) * 100}%` }} />
                        </span>
                      </span>
                    </a>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="relative py-28">
        <div className="wrap grid items-center gap-12 lg:grid-cols-2">
          <SectionHead eyebrow="Not one culture, but many" title="Each community has its own name, place and voice.">
            Batak Toba, Karo, Simalungun, Pakpak, Angkola and Mandailing are not interchangeable. Nias is not a Batak culture, and Medan is home to many peoples.
          </SectionHead>
          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            {([['karo', 'karo-house'], ['mandailing', 'gordang-sambilan'], ['nias', 'nias-dance'], ['medan', 'maimun']] as const).map(([id, img], i) => (
              <Reveal key={id} delay={i * 0.08} className={i % 2 ? 'translate-y-8' : ''}>
                <a href={href('/explore', { region: id })} className="group relative block aspect-[3/4] overflow-hidden rounded-t-full rounded-b-2xl">
                  <Photo id={img} className="size-full transition duration-700 group-hover:scale-110" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-4 pt-12 font-display text-2xl">{REGIONS.find((r) => r.id === id)!.name}</span>
                </a>
                <Credit id={img} className="mt-1.5 block" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="paper py-24">
        <div className="wrap">
          <SectionHead eyebrow="Cultural discovery" title="Stories that shape identity" />
          <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-3">
            {STORIES.slice(0, 3).map((s, i) => (
              <Reveal key={s.id} delay={i * 0.1}>
                <a href={href('/cultures', { story: s.id })} className="group block border-t-4 border-terracotta-500 pt-5">
                  <KindTag kind={s.kind} />
                  <h3 className="mt-3 mb-2 text-3xl group-hover:text-terracotta-700">{s.title}</h3>
                  <p className="opacity-75">{s.intro}</p>
                  <span className="text-sm font-bold">Read the story →</span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="wrap"><SoundDesk /></div>
      </section>
    </>
  );
}
