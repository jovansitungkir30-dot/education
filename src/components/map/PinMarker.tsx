import type { Pin, PinIcon } from '../../data/pins';

const PATHS: Record<PinIcon, string> = {
  house: 'M2 8Q12 15 22 8L19 13H5ZM6 13v7h12v-7M10 20v-4h4v4',
  lake: 'M3 15q3-3 6 0t6 0 6 0M3 20q3-3 6 0t6 0 6 0M5 11l5-6 3 4 2-2 4 4',
  drum: 'M6 6a6 2.4 0 1 0 12 0a6 2.4 0 1 0-12 0M6 6l2 13q4 2.4 8 0l2-13M7 9l5 9 5-9',
  stone: 'M3 20h18M5 20v-4h14v4M7 16v-4h10v4M9 12V8h6v4M8 5h8',
  cloth: 'M5 3h14v15H5zM9 3v15M15 3v15M6 18v3M10 18v3M14 18v3M18 18v3',
  bowl: 'M3 11h18q-1 8-9 8t-9-8zM8 8q-1-2 1-4M13 8q-1-2 1-4',
  city: 'M3 21V10l5-3v14M8 21V4h8v17M16 21v-9l5 2v7M2 21h20M11 8h2M11 12h2M11 16h2',
  people: 'M9 8a3 3 0 1 0 0-.1M17 10a2.4 2.4 0 1 0 0-.1M3 20q0-7 6-7t6 7M15 20q0-5 3-5t3 5',
  leaf: 'M5 19C4 9 11 4 20 4c0 10-6 16-15 15zM5 19l9-9',
};

export function Icon({ name, className = 'size-6' }: { name: PinIcon; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}

/** Floating marker: a rounded white tile over a pale label, anchored by its lower edge. */
export default function PinMarker({ pin, active, done }: { pin: Pin; active: boolean; done: boolean }) {
  const main = !!pin.stop;
  return (
    <span className="flex flex-col items-center gap-1">
      <span className={`pin-tile relative grid place-items-center rounded-2xl border-[3px] shadow-[0_8px_18px_#00000066] transition group-hover:-translate-y-1 group-hover:scale-105 ${main ? 'size-10 sm:size-13' : 'size-8 sm:size-9'} ${active ? 'border-[#ffd45e] bg-[#fff4cf]' : 'border-[#bfe4ee] bg-white'} text-[#14657a]`}>
        <Icon name={pin.icon} className={main ? 'size-6 sm:size-8' : 'size-4.5 sm:size-5'} />
        {done && <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full border-2 border-white bg-emerald-600 text-[11px] font-black text-white">✓</span>}
      </span>
      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold whitespace-nowrap shadow-md sm:text-xs ${active ? 'bg-[#ffd45e] text-[#3a2a00]' : 'bg-[#bfe4ee] text-[#0d3f4f]'} ${main ? '' : 'max-sm:sr-only'}`}>
        {pin.stop ? `${pin.stop} · ` : ''}{pin.label}
      </span>
    </span>
  );
}
