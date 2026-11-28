/** Close-up study of individual objects. */
import { lazy, Suspense, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FactBlock, ReviewNote, SectionHead } from '../components/ui';
import { ARTIFACTS } from '../data/artifacts';
import { regionById } from '../data/regions';
import { useProgress } from '../lib/progress';
import { href } from '../lib/router';
import type { ViewCommand } from '../three/ArtifactViewer';

const ArtifactViewer = lazy(() => import('../three/ArtifactViewer'));

function Viewer({ requested }: { requested: string | null }) {
  const [id, setId] = useState(() => ARTIFACTS.find((a) => a.id === requested)?.id ?? ARTIFACTS[0].id);
  const [hotspot, setHotspot] = useState<number | null>(null);
  const [spin, setSpin] = useState(true);
  const [dots, setDots] = useState(true);
  const [command, setCommand] = useState<ViewCommand>(null);
  const [engaged, setEngaged] = useState(false);
  const { visit, state } = useProgress();
  const artifact = ARTIFACTS.find((a) => a.id === id)!;

  useEffect(() => {
    const found = ARTIFACTS.find((a) => a.id === requested);
    if (found) {
      setId(found.id);
      setHotspot(null);
      setCommand(null);
      setEngaged(true);
    }
  }, [requested]);

  // Only count an artifact once the visitor has interacted with this section.
  useEffect(() => {
    if (engaged) visit('artifact', id);
  }, [engaged, id, visit]);

  const send = (type: NonNullable<ViewCommand>['type']) => {
    setEngaged(true);
    setSpin(false);
    setCommand((c) => ({ type, n: (c?.n ?? 0) + 1 }));
  };
  const pick = (i: number) => {
    setEngaged(true);
    setSpin(false);
    setHotspot(i);
  };

  return (
    <section id="artifacts" className="pt-30 pb-20">
      <div className="wrap">
        <SectionHead as="h1" eyebrow="Jelajahi artefak budaya" title="Putar dan amati dari dekat">
          Ini model prosedural untuk belajar. Bentuk dan proporsinya disederhanakan dan bukan replika sejarah yang akurat.
        </SectionHead>
        <div className="mt-8 flex gap-2 overflow-x-auto pb-3" role="group" aria-label="Pilih artefak">
          {ARTIFACTS.map((a) => (
            <button key={a.id} type="button" className="chip" aria-pressed={a.id === id} onClick={() => { setId(a.id); setHotspot(null); setCommand(null); setSpin(true); setEngaged(true); }}>
              {state.visited.artifact.includes(a.id) && <span aria-label="Sudah dijelajahi">✓ </span>}
              {a.name}
            </button>
          ))}
        </div>

        <div className="mt-4 grid items-start rounded-3xl border border-gold-500/25 bg-ivory lg:grid-cols-[1.5fr_1fr]">
          <div className="flex flex-col overflow-hidden rounded-t-3xl bg-forest-900 lg:sticky lg:top-22 lg:h-[calc(100dvh-7rem)] lg:rounded-3xl">
            <div className="relative h-[55dvh] min-h-[360px] lg:h-auto lg:flex-1" onPointerDown={() => setEngaged(true)}>
              <Suspense fallback={<div className="grid h-full place-items-center" role="status">Menyiapkan model 3D…</div>}>
                {<ArtifactViewer artifact={artifact} hotspot={hotspot} onHotspot={pick} spin={spin} command={command} showHotspots={dots} />}
              </Suspense>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 border-t border-ivory/10 p-3">
              <button type="button" className="chip" aria-label="Putar ke kiri" onClick={() => send('left')}>⟲</button>
              <button type="button" className="chip" aria-label="Putar ke kanan" onClick={() => send('right')}>⟳</button>
              <button type="button" className="chip" aria-label="Perbesar" onClick={() => send('in')}>＋</button>
              <button type="button" className="chip" aria-label="Perkecil" onClick={() => send('out')}>－</button>
              <button type="button" className="chip" onClick={() => send('reset')}>Atur ulang</button>
              <button type="button" className="chip" aria-pressed={spin} onClick={() => setSpin(!spin)}>Putar otomatis</button>
              <button type="button" className="chip" aria-pressed={dots} onClick={() => setDots(!dots)}>Titik info</button>
            </div>
          </div>

          <div className="p-6 text-ink sm:p-8">
            <p className="eyebrow text-terracotta-700">{artifact.origin}</p>
            <h3 className="mt-2 mb-3 text-3xl">{artifact.name}</h3>
            <p className="leading-relaxed">{artifact.description}</p>

            <h4 className="mt-6 mb-2 text-xl">Titik info</h4>
            <ReviewNote className="mb-3" />
            <ol className="m-0 space-y-2 p-0">
              {artifact.hotspots.map((h, i) => (
                <li key={h.label} className="list-none">
                  <button type="button" className={`w-full cursor-pointer rounded-xl border p-3 text-left ${hotspot === i ? 'border-terracotta-500 bg-cream' : 'border-ink/15'}`} aria-expanded={hotspot === i} onClick={() => pick(i)}>
                    <span className="font-bold">{i + 1}. {h.label}</span>
                    <AnimatePresence initial={false}>
                      {hotspot === i && (
                        <motion.span className="block overflow-hidden text-sm leading-relaxed" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                          <span className="block pt-2">{h.text}</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </li>
              ))}
            </ol>

            <h4 className="mt-6 mb-2 text-xl">Konteks sejarah</h4>
            <FactBlock item={artifact.history} />
            <h4 className="mt-6 mb-2 text-xl">Makna budaya</h4>
            <FactBlock item={artifact.significance} />
            <h4 className="mt-6 mb-2 text-xl">Bahan dan pengerjaan</h4>
            {artifact.materials ? <FactBlock item={artifact.materials} /> : <p className="text-sm opacity-75">Belum ada keterangan terverifikasi tentang bahan objek ini, sehingga tidak ada klaim yang dibuat.</p>}
            <a className="btn btn-terra mt-6" href={href('/explore', { region: artifact.regionId })}>
              Lihat {regionById(artifact.regionId)?.name} di peta
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Artifacts({ params }: { params: URLSearchParams }) {
  return <Viewer requested={params.get('id')} />;
}
