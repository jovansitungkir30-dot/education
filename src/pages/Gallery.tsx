import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Credit, Photo, ReviewNote, SectionHead, SourceLinks } from '../components/ui';
import { GALLERY, THEMES, type Theme, type GalleryItem } from '../data/gallery';
import type { PhotoId } from '../data/photos';
import { useProgress } from '../lib/progress';

/** A native modal dialog, which provides focus trapping and Escape to close. */
function Viewer({ items, index, onIndex, onOpen, onClose }: { items: GalleryItem[]; index: number; onIndex: (i: number) => void; onOpen: (id: PhotoId) => void; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const item = items[index];
  const { visit } = useProgress();
  const step = (d: number) => onIndex((index + d + items.length) % items.length);

  useEffect(() => {
    const dialog = ref.current!;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
  useEffect(() => visit('gallery', item.id), [item.id, visit]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') step(1);
        if (e.key === 'ArrowLeft') step(-1);
      }}
      aria-labelledby="viewer-title"
      className="m-0 h-dvh max-h-none w-screen max-w-none overflow-y-auto bg-forest-950 p-0 text-ivory"
    >
      <div className="grid min-h-full lg:h-full lg:grid-cols-[1.6fr_1fr]">
        <div className="flex min-h-[45dvh] flex-col bg-black lg:min-h-0">
          <div className="relative min-h-0 flex-1">
            <AnimatePresence mode="wait">
              <motion.div key={item.id} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Photo id={item.id} className="size-full !object-contain" eager />
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="p-3 text-center"><Credit id={item.id} /></p>
        </div>
        <div className="paper p-6 sm:p-10 lg:overflow-y-auto">
          <div className="flex flex-wrap gap-2">
            <button type="button" className="chip" onClick={() => step(-1)}>← Previous</button>
            <button type="button" className="chip" onClick={() => step(1)}>Next →</button>
            <button type="button" className="chip ml-auto" onClick={() => ref.current?.close()} autoFocus>Close</button>
          </div>
          <p className="eyebrow mt-8 text-terracotta-700">{item.theme} · {index + 1} of {items.length}</p>
          <h2 id="viewer-title" className="mt-2 mb-4 text-4xl">{item.title}</h2>
          <dl className="space-y-4">
            <div><dt className="text-sm font-extrabold">Origin</dt><dd className="m-0">{item.origin}</dd></div>
            <div><dt className="text-sm font-extrabold">Cultural context</dt><dd className="m-0">{item.context}</dd></div>
            <div><dt className="text-sm font-extrabold">Look and learn</dt><dd className="m-0 leading-relaxed">{item.learn}</dd></div>
          </dl>
          <SourceLinks ids={item.sources} />
          <ReviewNote className="mt-3" />
          <h3 className="mt-8 mb-3 text-xl">Related</h3>
          <div className="grid grid-cols-3 gap-2">
            {item.related.map((id) => {
              const rel = GALLERY.find((g) => g.id === id)!;
              return (
                <button key={id} type="button" className="cursor-pointer text-left" onClick={() => onOpen(id)}>
                  <Photo id={id} className="aspect-square w-full rounded-lg" />
                  <span className="mt-1 block text-xs font-bold">{rel.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </dialog>
  );
}

const SHAPES = ['h-[26rem] w-72 rounded-t-full', 'h-80 w-[28rem] rounded-2xl', 'h-[23rem] w-80 rounded-2xl', 'h-[28rem] w-64 rounded-t-[8rem]'];

export default function Gallery() {
  const [theme, setTheme] = useState<Theme | 'All'>('All');
  const [open, setOpen] = useState<{ list: GalleryItem[]; index: number } | null>(null);
  const hall = useRef<HTMLDivElement>(null);
  const { state } = useProgress();
  const items = theme === 'All' ? GALLERY : GALLERY.filter((g) => g.theme === theme);

  useEffect(() => {
    hall.current?.scrollTo({ left: 0 });
  }, [theme]);

  const walk = (dir: number) => hall.current?.scrollBy({ left: dir * Math.min(hall.current.clientWidth * 0.8, 700), behavior: 'smooth' });

  return (
    <div className="min-h-dvh bg-[radial-gradient(ellipse_at_50%_0%,#2b4a3b,#0a1812_70%)] pt-30 pb-20">
      <div className="wrap">
        <SectionHead as="h1" eyebrow="Virtual cultural gallery" title="Walk the long hall">
          Scroll or drag sideways, then step up to any work to read it. You have viewed {state.visited.gallery.length} of {GALLERY.length}.
        </SectionHead>
        <div className="mt-7 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Gallery rooms">
          {(['All', ...THEMES] as const).map((t) => (
            <button key={t} type="button" className="chip" aria-pressed={theme === t} onClick={() => setTheme(t)}>{t}</button>
          ))}
        </div>
      </div>

      <div ref={hall} className="mt-10 flex snap-x snap-mandatory items-end gap-10 overflow-x-auto px-[max(1.25rem,calc((100vw-78rem)/2+2rem))] pb-10 sm:gap-20" tabIndex={0} aria-label="Exhibition hall">
        {items.map((g, i) => (
          <motion.figure key={g.id} className="m-0 shrink-0 snap-center" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 6) * 0.07 }}>
            <button type="button" className="group block cursor-pointer" onClick={() => setOpen({ list: items, index: i })} aria-label={`View ${g.title}`}>
              <span className={`block max-w-[80vw] overflow-hidden border-[6px] border-gold-700 shadow-[0_40px_60px_-20px_#000c,0_-30px_90px_-30px_#e2c47c55] transition duration-500 group-hover:-translate-y-3 ${SHAPES[i % SHAPES.length]}`}>
                <Photo id={g.id} className="size-full transition duration-700 group-hover:scale-105" eager={i < 3} />
              </span>
            </button>
            <figcaption className="mt-6 max-w-64 border-l-2 border-gold-500 pl-3">
              <span className="block font-display text-xl">{g.title}</span>
              <span className="block text-xs opacity-70">{g.origin}{state.visited.gallery.includes(g.id) && ' · ✓ viewed'}</span>
            </figcaption>
          </motion.figure>
        ))}
      </div>

      <div className="wrap flex items-center justify-between gap-4">
        <button type="button" className="btn btn-line" onClick={() => walk(-1)}>← Walk back</button>
        <button type="button" className="btn btn-line" onClick={() => walk(1)}>Walk on →</button>
      </div>
      <p className="wrap mt-8 text-sm opacity-65">Photographs are from Wikimedia Commons and may be cropped in the hall. Open a work to see it uncropped with its photographer and licence. A photo shows one occasion or object, not every practice of a community.</p>

      {open && (
        <Viewer
          items={open.list}
          index={open.index}
          onIndex={(index) => setOpen({ ...open, index })}
          onOpen={(id) => setOpen({ list: GALLERY, index: GALLERY.findIndex((g) => g.id === id) })}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}
