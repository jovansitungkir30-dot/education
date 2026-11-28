import { lazy, Suspense, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SourcesPanel from '../components/credits/SourcesPanel';
import ExplorationProgress from '../components/region/ExplorationProgress';
import RegionShowcase from '../components/home/RegionShowcase';
import { Reveal } from '../components/ui';
import { ADMIN, DISTRICTS } from '../data/atlas';
import { INSTRUMENTS } from '../data/instruments';
import { JOURNEYS } from '../data/journeys';
import { HERITAGE_PHOTOS } from '../data/media';
import { HALF_HEIGHT, HALF_WIDTH, svgPath } from '../lib/geo';
import { go, href } from '../lib/router';
import type { Look } from '../three/HeroMapScene';

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
    <section className="relative h-[92dvh] min-h-[620px] overflow-hidden">
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
      <motion.div style={{ y: textY, opacity: textFade }} className="wrap pointer-events-none relative flex h-full flex-col justify-end pb-20 lg:justify-center lg:pb-0">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.15 }} className="max-w-xl [text-shadow:0_2px_16px_rgb(0_0_0/0.45)]">
          <p className="eyebrow text-gold-300">Atlas budaya Sumatera Utara</p>
          <h1 className="mt-4 mb-0 text-4xl leading-[1.02] sm:text-6xl xl:text-7xl">33 wilayah, banyak suara</h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-cream sm:text-lg">Putar rumah adat dan candi dalam 3D, telusuri sejarahnya, kenali sajiannya, dan mainkan alat musiknya.</p>
          <div className="pointer-events-auto mt-7 flex flex-wrap gap-3">
            <button type="button" className="btn btn-gold" onClick={() => go('/explore')}>Jelajahi peta</button>
            <button type="button" className="btn btn-line text-ivory" onClick={() => go('/learn')}>Mulai belajar</button>
          </div>
        </motion.div>
      </motion.div>
      <div className="absolute right-4 bottom-5 flex items-center gap-2 text-xs sm:right-8">
        <span className="hidden opacity-75 sm:inline">Geser untuk memutar · label berganti tiap hari</span>
        <button type="button" className="chip bg-forest-950/70" aria-label="Putar pandangan ke kiri" onClick={() => turn(-0.35)}>←</button>
        <button type="button" className="chip bg-forest-950/70" aria-label="Putar pandangan ke kanan" onClick={() => turn(0.35)}>→</button>
      </div>
    </section>
  );
}

/** Editorial spread of finds from different parts of the province. */
const FINDS = [
  { photo: 'fahombo', kind: 'Tradisi · Nias', title: 'Melompati batu', text: 'Dahulu penanda kedewasaan, kini simbol budaya.', area: 'nias-selatan', span: 'md:col-span-2 md:row-span-2' },
  { photo: 'bika', kind: 'Kuliner · Medan', title: 'Bika Ambon', text: 'Namanya Ambon, rumahnya Medan.', area: 'kota-medan', span: '' },
  { photo: 'pelleng', kind: 'Kuliner · Pakpak', title: 'Pelleng', text: 'Nasi kuning pedas yang membawa doa.', area: 'pakpak-bharat', span: '' },
  { photo: 'gubang', kind: 'Seni · Asahan', title: 'Tari Gubang', text: 'Legendanya bermula dari nelayan yang menanti angin.', area: 'asahan', span: 'md:col-span-2' },
  { photo: 'ulos', kind: 'Tradisi · Toba', title: 'Mangulosi', text: 'Kain sebagai ungkapan berkat.', area: 'toba', span: '' },
  { photo: 'cimpa', kind: 'Kuliner · Karo', title: 'Cimpa', text: 'Penganan penting di acara adat Karo.', area: 'karo', span: 'md:col-span-3' },
];

export default function Home() {
  const [panel, setPanel] = useState(false);
  return (
    <>
      <Hero />
      <div className="weave" aria-hidden="true" />
      <RegionShowcase />

      <section className="paper py-20" aria-labelledby="temuan">
        <div className="wrap">
          <h2 id="temuan" className="display mt-0 mb-2">Temuan dari berbagai penjuru</h2>
          <p className="mt-0 max-w-[62ch]">Tiap temuan membuka halaman wilayah tempat Anda bisa menelusurinya. Satu tradisi atau makanan bisa hidup jauh melampaui satu daerah.</p>
          <div className="mt-8 grid auto-rows-[15rem] gap-3 md:grid-cols-4">
            {FINDS.map((f, i) => {
              const p = HERITAGE_PHOTOS[f.photo];
              return (
                <Reveal key={f.title} delay={(i % 3) * 0.06} className={`${f.span} min-h-0`}>
                  <a href={href('/wilayah', { id: f.area })} className="group relative block size-full overflow-hidden rounded-lg bg-forest-900 text-ivory">
                    <img src={`./${p.file}`} alt={p.alt} loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-105" />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 pt-14">
                      <span className="block text-[11px] font-extrabold tracking-wider text-gold-300 uppercase">{f.kind}</span>
                      <span className="block font-display text-2xl leading-tight">{f.title}</span>
                      <span className="block text-sm leading-snug">{f.text}</span>
                    </span>
                  </a>
                </Reveal>
              );
            })}
          </div>
          <button type="button" className="mt-3 min-h-11 cursor-pointer text-sm font-bold underline" onClick={() => setPanel(true)}>Kredit foto temuan</button>
        </div>
      </section>

      <section className="bg-forest-900 py-20" aria-labelledby="bunyi">
        <div className="wrap grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="eyebrow m-0 text-gold-300">Ruang alat musik 3D</p>
            <h2 id="bunyi" className="display mt-2 mb-4">Pukul, petik, dengarkan</h2>
            <p className="mt-0 max-w-[52ch] leading-relaxed opacity-85">Setiap alat dimainkan menurut caranya sendiri. Bunyinya disintesis komputer, sedangkan cara mainnya mengikuti sumber.</p>
            <ul className="mt-5 mb-0 grid grid-cols-2 gap-x-4 p-0">
              {INSTRUMENTS.map((x) => (
                <li key={x.id} className="list-none border-t border-ivory/20"><a className="flex min-h-14 flex-col justify-center py-2 hover:text-gold-300" href={href('/alat-musik', { id: x.id })}><span className="font-display text-xl">{x.name}</span><span className="text-xs opacity-75">{x.community}</span></a></li>
              ))}
            </ul>
          </div>
          <a href={href('/alat-musik')} className="group relative block overflow-hidden rounded-xl">
            <img src={`./${HERITAGE_PHOTOS.i_gordang.file}`} alt={HERITAGE_PHOTOS.i_gordang.alt} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-5 pt-16 font-display text-2xl">Mulai dari Gordang Sambilan →</span>
          </a>
        </div>
      </section>

      <section className="paper py-20" aria-labelledby="jalur">
        <div className="wrap">
          <h2 id="jalur" className="display mt-0 mb-6">Atau ikuti satu perjalanan</h2>
          <ol className="m-0 grid gap-x-10 p-0 md:grid-cols-2">
            {JOURNEYS.map((j, i) => (
              <li key={j.id} className="list-none border-t border-ink/20">
                <a href={href('/learn', { jalur: j.id })} className="group grid grid-cols-[3rem_minmax(0,1fr)] items-baseline gap-2 py-5">
                  <span aria-hidden="true" className="font-display text-3xl text-terracotta-500">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <span className="block font-display text-2xl group-hover:text-terracotta-700">{j.title}</span>
                    <span className="block text-sm opacity-80">{j.promise} {j.stations.length} perhentian.</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
          <div className="mt-8 grid items-center gap-6 rounded-xl bg-forest-900 p-6 text-ivory md:grid-cols-[1fr_auto]">
            <ExplorationProgress />
            <a className="btn btn-gold" href={href('/wilayah')}>Lihat {ADMIN.length} wilayah</a>
          </div>
        </div>
      </section>
      <SourcesPanel open={panel} onClose={() => setPanel(false)} references={[]} photos={FINDS.map((f) => HERITAGE_PHOTOS[f.photo])} />
    </>
  );
}
