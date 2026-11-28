import { useState } from 'react';
import type { Moment } from '../../data/area-content';
import { KindTag, SourceLinks } from '../ui';

/** Walk through an area's history one moment at a time. The rail keeps the order visible. */
export default function HistoryTimeline({ moments }: { moments: Moment[] }) {
  const [at, setAt] = useState(0);
  const m = moments[at];
  return (
    <div className="grid gap-6 md:grid-cols-[15rem_minmax(0,1fr)]">
      <ol className="relative m-0 flex gap-2 overflow-x-auto p-0 pb-2 md:block md:overflow-visible md:pb-0" aria-label="Garis waktu">
        <span aria-hidden="true" className="absolute top-3 bottom-3 left-[0.6875rem] hidden w-0.5 bg-ink/20 md:block" />
        {moments.map((x, i) => (
          <li key={x.when + x.title} className="shrink-0 list-none">
            <button type="button" aria-current={i === at ? 'step' : undefined} onClick={() => setAt(i)} className={`relative flex min-h-12 w-full cursor-pointer items-start gap-3 rounded-md py-2 pr-3 text-left max-md:border max-md:border-ink/20 max-md:px-3 ${i === at ? 'bg-cream' : 'hover:bg-cream/60'}`}>
              <span aria-hidden="true" className={`relative z-10 mt-1 size-6 shrink-0 rounded-full border-4 border-ivory max-md:hidden ${i <= at ? 'bg-terracotta-500' : 'bg-ink/25'}`} />
              <span>
                <span className="block font-display text-lg leading-tight whitespace-nowrap">{x.when}</span>
                <span className="block text-xs opacity-75 max-md:sr-only">{x.title}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <div className="min-w-0 border-l-4 border-terracotta-500 bg-white/60 p-5 sm:p-7">
        <div aria-live="polite">
          <p className="m-0 font-display text-4xl leading-none text-terracotta-700 sm:text-5xl">{m.when}</p>
          <h3 className="mt-3 mb-2 text-2xl">{m.title}</h3>
          <KindTag kind={m.kind} />
          <p className="mt-3 mb-0 max-w-[60ch] text-[1.05rem] leading-[1.75]">{m.text}<SourceLinks ids={m.sources} /></p>
        </div>
        <div className="mt-5 flex items-center gap-2">
          <button type="button" className="btn btn-line" disabled={at === 0} onClick={() => setAt(at - 1)}>← Sebelumnya</button>
          <button type="button" className="btn btn-terra" disabled={at === moments.length - 1} onClick={() => setAt(at + 1)}>Berikutnya →</button>
          <span className="ml-auto text-sm tabular-nums">{at + 1}/{moments.length}</span>
        </div>
      </div>
    </div>
  );
}
