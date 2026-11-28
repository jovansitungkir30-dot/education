import { useEffect, useRef, useState } from 'react';

export interface GalleryItem {
  file: string;
  alt: string;
  author: string;
  license: string;
  licenseUrl: string;
  page: string;
}

function Attribution({ item }: { item: GalleryItem }) {
  return (
    <span className="text-[11px] leading-snug opacity-75">
      Foto: <a className="underline" href={item.page} target="_blank" rel="noreferrer">{item.author}</a>,{' '}
      {item.licenseUrl ? <a className="underline" href={item.licenseUrl} target="_blank" rel="noreferrer">{item.license}</a> : item.license}, via Wikimedia Commons
    </span>
  );
}

/** Documentary photos with attribution. Selecting one shows it uncropped. */
export default function CulturalGallery({ items }: { items: GalleryItem[] }) {
  const [open, setOpen] = useState<GalleryItem | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open && !dialog.current!.open) dialog.current!.showModal();
  }, [open]);

  return (
    <>
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {items.map((item) => (
          <figure key={item.file} className="m-0 mb-5 break-inside-avoid">
            <button type="button" className="block w-full cursor-zoom-in overflow-hidden rounded-xl" onClick={() => setOpen(item)} aria-label={`Perbesar foto: ${item.alt}`}>
              <img src={`./${item.file}`} alt={item.alt} loading="lazy" decoding="async" className="block w-full transition-transform duration-500 hover:scale-[1.03]" />
            </button>
            <figcaption className="mt-1.5">
              <span className="block text-sm">{item.alt}</span>
              <Attribution item={item} />
            </figcaption>
          </figure>
        ))}
      </div>
      <dialog ref={dialog} onClose={() => setOpen(null)} onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()} className="m-auto max-h-[92dvh] max-w-[min(94vw,70rem)] rounded-2xl bg-forest-950 p-0 text-ivory backdrop:bg-black/80">
        {open && (
          <div className="p-3">
            <img src={`./${open.file}`} alt={open.alt} className="mx-auto block max-h-[72dvh] max-w-full rounded-lg" />
            <p className="mt-2 mb-0">{open.alt}</p>
            <Attribution item={open} />
            <button type="button" className="btn btn-gold mt-3 block" onClick={() => dialog.current!.close()}>Tutup</button>
          </div>
        )}
      </dialog>
    </>
  );
}
