import { useEffect, useRef, useState } from 'react';
import { RELATIONS, type MediaItem } from '../../data/media';

function Attribution({ item }: { item: MediaItem }) {
  return (
    <span className="text-xs leading-snug opacity-75">
      Foto: <a className="underline" href={item.page} target="_blank" rel="noreferrer">{item.author}</a>,{' '}
      {item.licenseUrl ? <a className="underline" href={item.licenseUrl} target="_blank" rel="noreferrer">{item.license}</a> : item.license}, via Wikimedia Commons (ukuran diubah)
    </span>
  );
}

function Provenance({ item }: { item: MediaItem }) {
  return (
    <dl className="m-0 mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs">
      <dt className="font-bold">Jenis</dt><dd className="m-0">{RELATIONS[item.relation].label}. {RELATIONS[item.relation].hint}</dd>
      {item.place && <><dt className="font-bold">Tempat</dt><dd className="m-0">{item.place}</dd></>}
      <dt className="font-bold">Pengecekan</dt>
      <dd className="m-0">{item.verification === 'koordinat' ? 'Koordinat pada berkas berada di dalam wilayah ini.' : 'Berdasarkan keterangan pengunggah; tidak kami cek di lapangan.'}</dd>
    </dl>
  );
}

/** Photos with short captions. Opening one shows it uncropped with credit and provenance; arrow keys move between them. */
export default function CulturalGallery({ items }: { items: MediaItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const current = open === null ? null : items[open];
  const step = (d: number) => setOpen((i) => (i === null ? i : (i + d + items.length) % items.length));

  useEffect(() => {
    if (current && !dialog.current!.open) dialog.current!.showModal();
  }, [current]);

  return (
    <>
      <ul className="m-0 columns-1 gap-6 p-0 sm:columns-2 xl:columns-3">
        {items.map((item, i) => (
          <li key={item.file} className="mb-8 list-none break-inside-avoid">
            <figure className="m-0">
              <button type="button" className="relative block w-full cursor-zoom-in overflow-hidden rounded-sm bg-ink/10" onClick={() => setOpen(i)} aria-label={`Perbesar foto: ${item.alt}`}>
                <img src={`./${item.file}`} alt={item.alt} loading="lazy" decoding="async" className="block w-full transition-transform duration-500 hover:scale-[1.03]" />
              </button>
              <figcaption className="mt-2 border-l-2 border-gold-500 pl-3">
                <span className="block text-[11px] font-extrabold tracking-wider text-terracotta-700 uppercase">{RELATIONS[item.relation].label}</span>
                <span className="block text-sm leading-snug">{item.alt}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <dialog
        ref={dialog}
        aria-label="Foto diperbesar"
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); }}
        className="m-auto max-h-[94dvh] w-[min(94vw,66rem)] rounded-lg bg-forest-950 p-0 text-ivory backdrop:bg-black/85"
      >
        {current && (
          <div className="p-4">
            <img src={`./${current.file}`} alt={current.alt} className="mx-auto block max-h-[60dvh] max-w-full" />
            <p className="mt-3 mb-1" aria-live="polite">{current.alt}</p>
            <Attribution item={current} />
            <Provenance item={current} />
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {items.length > 1 && (
                <>
                  <button type="button" className="btn btn-line" onClick={() => step(-1)}>← Sebelumnya</button>
                  <button type="button" className="btn btn-line" onClick={() => step(1)}>Berikutnya →</button>
                  <span className="text-sm tabular-nums">{open! + 1} / {items.length}</span>
                </>
              )}
              <button type="button" className="btn btn-gold ml-auto" onClick={() => dialog.current!.close()}>Tutup</button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
