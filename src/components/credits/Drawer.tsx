import { useEffect, useId, useRef, type ReactNode } from 'react';

/** A side panel built on the native dialog: focus stays inside, Escape closes, the page behind is inert. */
export default function Drawer({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const heading = useId();

  useEffect(() => {
    const d = ref.current!;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={heading}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
      className="paper my-0 mr-0 ml-auto h-dvh max-h-none w-[min(100vw,34rem)] max-w-none p-0 text-ink shadow-2xl backdrop:bg-black/60"
    >
      {open && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-3 border-b-2 border-ink/80 px-5 py-3">
            <h2 id={heading} className="m-0 text-2xl">{title}</h2>
            <button type="button" className="chip" onClick={() => ref.current!.close()}>Tutup</button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
        </div>
      )}
    </dialog>
  );
}
