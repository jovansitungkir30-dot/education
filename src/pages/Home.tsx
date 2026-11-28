import { lazy, Suspense, useRef, useState, type PointerEvent, type KeyboardEvent } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { go, href } from '../lib/router';
import { useProgress, passedModules } from '../lib/progress';
import { REGIONS } from '../data/regions';
import { ADMIN } from '../data/atlas';
import { ARTIFACTS } from '../data/artifacts';
import { STORIES } from '../data/stories';
import { MODULES } from '../data/modules';
import { Credit, KindTag, Photo, Reveal, SectionHead, SoundDesk } from '../components/ui';
import type { Look } from '../three/HeroMapScene';
import { DISTRICTS } from '../data/atlas';
import { HALF_HEIGHT, HALF_WIDTH, svgPath } from '../lib/geo';

const HeroCanvas = lazy(() => import('../three/HeroCanvas'));

/** Flat map of the real boundaries, shown while 3D loads and on devices without WebGL. */
export function HeroFallback() {
  return (
    <svg className="absolute inset-0 size-full bg-[#103236]" viewBox={`${-HALF_WIDTH * 2.9} ${-HALF_HEIGHT * 1.12} ${HALF_WIDTH * 4.1} ${HALF_HEIGHT * 2.3}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {DISTRICTS.map((d) => (
        <path key={d.id} d={svgPath(d)} fill={d.type === 'air' ? '#3a93a8' : d.type === 'kota' ? '#b4603f' : '#4f7a4d'} stroke="#e9dcb8" strokeOpacity="0.4" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      ))}
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
        aria-label="Peta 3D Sumatera Utara. Geser, atau gunakan tombol panah kiri dan kanan, untuk memutar."
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
      <p className="pointer-events-none absolute bottom-1 left-3 z-10 m-0 max-w-[60%] text-[9px] leading-tight opacity-60">Citra: Sentinel-2 cloudless 2016, EOX (CC BY 4.0) · Ketinggian: Mapzen/SRTM</p>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/45 via-35% to-transparent lg:bg-gradient-to-r lg:from-forest-950/90 lg:via-forest-950/45 lg:to-transparent lg:to-65%" />
      <motion.div style={{ y: textY, opacity: textFade }} className="wrap pointer-events-none relative flex h-full flex-col justify-end pb-24 lg:justify-center lg:pb-0">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.15 }} className="max-w-xl [text-shadow:0_2px_16px_rgb(0_0_0/0.45)]">
          <p className="eyebrow text-gold-300">RuangNusantara · Atlas budaya</p>
          <h1 className="mt-4 mb-0 text-4xl leading-[1.02] sm:text-6xl xl:text-7xl">Jelajahi Kekayaan Budaya Sumatera Utara</h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-cream sm:text-lg">Setiap wilayah menyimpan cerita, tradisi, dan warisan budaya. Jelajahi keberagamannya melalui perjalanan interaktif.</p>
          <div className="pointer-events-auto mt-7 flex flex-wrap gap-3">
            <button type="button" className="btn btn-gold" onClick={() => go('/explore')}>Mulai Jelajahi</button>
            <button type="button" className="btn btn-line text-ivory" onClick={() => go('/about')}>Tentang Eksplorasi</button>
          </div>
        </motion.div>
      </motion.div>
      <div className="absolute right-4 bottom-5 flex items-center gap-2 text-xs sm:right-8">
        <span className="hidden opacity-75 sm:inline">Geser untuk memutar · pilih label untuk masuk diorama</span>
        <button type="button" className="chip bg-forest-950/70" aria-label="Putar pandangan ke kiri" onClick={() => turn(-0.35)}>←</button>
        <button type="button" className="chip bg-forest-950/70" aria-label="Putar pandangan ke kanan" onClick={() => turn(0.35)}>→</button>
      </div>
    </section>
  );
}

const STOPS = [
  { to: '/explore', n: '01', title: 'Jelajahi peta', text: 'Pilih kabupaten atau kota, lalu jelajahi diorama dan materi budayanya.', done: (v: Record<string, string[]>) => ADMIN.filter((d) => v.region.includes(d.id)).length, total: ADMIN.length },
  { to: '/explore?view=artifacts', n: '02', title: 'Putar objeknya', text: 'Putar rumah adat, gendang, dan kain dalam 3D.', done: (v: Record<string, string[]>) => v.artifact.length, total: ARTIFACTS.length },
  { to: '/cultures', n: '03', title: 'Ikuti ceritanya', text: 'Sejarah, tradisi, dan cerita rakyat, masing-masing diberi label jelas.', done: (v: Record<string, string[]>) => v.story.length, total: STORIES.length },
];

export default function Home() {
  const { state, points } = useProgress();
  const passed = passedModules(state).length;
  return (
    <>
      <Hero />

      <section className="relative border-y border-gold-500/25 bg-forest-900 py-14">
        <div className="wrap grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <p className="eyebrow text-gold-300">Pengantar Sumatera Utara</p>
            <p className="mt-3 mb-0 font-display text-2xl leading-snug sm:text-3xl">Dari pesisir timur, dataran tinggi di sekitar Danau Toba, hingga Kepulauan Nias, banyak komunitas dengan bahasa dan adatnya sendiri hidup di provinsi ini.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <dl className="m-0 grid grid-cols-3 gap-4 text-center">
              {([[ADMIN.filter((d) => d.type === 'kabupaten').length, 'kabupaten'], [ADMIN.filter((d) => d.type === 'kota').length, 'kota'], [4, 'diorama 3D']] as const).map(([n, label]) => (
                <div key={label}><dd className="m-0 font-display text-5xl text-gold-300">{n}</dd><dt className="text-sm opacity-75">{label}</dt></div>
              ))}
            </dl>
            <a className="btn btn-gold mt-6 w-full" href={href('/explore')}>Buka peta interaktif →</a>
          </Reveal>
        </div>
      </section>

      <section id="journey" className="paper scroll-mt-16 py-24">
        <div className="wrap">
          <SectionHead eyebrow="Perjalanan virtual Anda" title="Empat jalan masuk ke provinsi dengan banyak suara">
            Anda punya {points} poin jelajah. Kemajuan hanya disimpan di browser ini.
          </SectionHead>
          <ol className="mt-14 p-0">
            {[...STOPS, { to: '/learn', n: '04', title: 'Belajar dan raih lencana', text: 'Modul singkat, aktivitas, kuis, dan sertifikat.', done: () => passed, total: MODULES.length }].map((s) => {
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
          <SectionHead eyebrow="Bukan satu budaya, melainkan banyak" title="Tiap komunitas punya nama, tempat, dan suaranya sendiri.">
            Batak Toba, Karo, Simalungun, Pakpak, Angkola, dan Mandailing tidak bisa disamakan. Nias bukan budaya Batak, dan Medan dihuni banyak suku bangsa.
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
          <SectionHead eyebrow="Temuan budaya" title="Cerita yang membentuk identitas" />
          <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-3">
            {STORIES.slice(0, 3).map((s, i) => (
              <Reveal key={s.id} delay={i * 0.1}>
                <a href={href('/cultures', { story: s.id })} className="group block border-t-4 border-terracotta-500 pt-5">
                  <KindTag kind={s.kind} />
                  <h3 className="mt-3 mb-2 text-3xl group-hover:text-terracotta-700">{s.title}</h3>
                  <p className="opacity-75">{s.intro}</p>
                  <span className="text-sm font-bold">Baca ceritanya →</span>
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
