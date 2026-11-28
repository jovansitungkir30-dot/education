/** Pick a dish or a practice, then explore it: picture, parts, and the order in which it happens. */
import { useState } from 'react';
import type { Link } from '../../data/area-content';
import { CUSTOMS, FOODS, type Custom, type CustomId, type Food, type FoodId } from '../../data/heritage';
import { HERITAGE_PHOTOS, RELATIONS } from '../../data/media';
import { KindTag, SourceLinks } from '../ui';

const BASIS = {
  daerah: 'Sumber menyebut daerah ini',
  komunitas: 'Lewat komunitas yang tinggal di sini; bukan milik khusus wilayah ini',
} as const;

function Picker({ items, at, onPick, label }: { items: { id: string; name: string; basis: keyof typeof BASIS }[]; at: number; onPick: (i: number) => void; label: string }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2" role="group" aria-label={label}>
      {items.map((x, i) => {
        const photo = HERITAGE_PHOTOS[x.id];
        return (
          <button key={x.id} type="button" aria-pressed={i === at} onClick={() => onPick(i)} className={`w-36 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 text-left ${i === at ? 'border-terracotta-500' : 'border-transparent hover:border-ink/30'}`}>
            {photo ? <img src={`./${photo.file}`} alt="" loading="lazy" className="block h-24 w-full object-cover" /> : <span aria-hidden="true" className="grid h-24 w-full place-items-center bg-forest-900 font-display text-4xl text-gold-300">{x.name[0]}</span>}
            <span className="block bg-white/70 px-2.5 py-2 text-sm leading-tight font-extrabold">{x.name}</span>
          </button>
        );
      })}
    </div>
  );
}

function Steps({ title, steps }: { title: string; steps: string[] }) {
  const [at, setAt] = useState(0);
  return (
    <div className="mt-5">
      <h4 className="m-0 mb-2 text-lg">{title}</h4>
      <ol className="m-0 grid gap-2 p-0 sm:grid-cols-[repeat(auto-fit,minmax(8.5rem,1fr))]">
        {steps.map((s, i) => (
          <li key={s} className="list-none">
            <button type="button" aria-current={i === at ? 'step' : undefined} onClick={() => setAt(i)} className={`h-full w-full cursor-pointer rounded-md border-t-4 p-3 text-left text-sm ${i <= at ? 'border-terracotta-500 bg-cream' : 'border-ink/20 bg-white/50'}`}>
              <span className="block font-display text-2xl text-terracotta-700">{i + 1}</span>
              {s}
            </button>
          </li>
        ))}
      </ol>
      {at < steps.length - 1 && <button type="button" className="chip mt-2" onClick={() => setAt(at + 1)}>Langkah berikutnya →</button>}
    </div>
  );
}

function Picture({ id, name }: { id: string; name: string }) {
  const p = HERITAGE_PHOTOS[id];
  if (!p) return <div className="grid min-h-40 place-items-center rounded-lg border border-dashed border-ink/35 p-4 text-center text-sm"><span><strong className="block font-display text-xl">{name}</strong>Belum ada foto berlisensi terbuka yang kami pastikan.</span></div>;
  return (
    <figure className="m-0">
      <img src={`./${p.file}`} alt={p.alt} loading="lazy" className="block w-full rounded-lg" />
      <figcaption className="mt-1.5 text-xs"><strong>{RELATIONS[p.relation].label}:</strong> {p.alt}</figcaption>
    </figure>
  );
}

function Shell({ id, name, basis, why, children }: { id: string; name: string; basis: keyof typeof BASIS; why: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 grid gap-6 border-t-2 border-ink/15 pt-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <div className="min-w-0">
        <h3 className="m-0 text-3xl">{name}</h3>
        <p className={`mt-2 mb-3 border-l-4 py-1.5 pr-2 pl-3 text-sm ${basis === 'daerah' ? 'border-emerald-700 bg-emerald-50' : 'border-terracotta-500 bg-cream'}`}>
          <strong>{BASIS[basis]}.</strong> {why}
        </p>
        {children}
      </div>
      <Picture id={id} name={name} />
    </div>
  );
}

export function FoodExplorer({ links }: { links: Link<FoodId>[] }) {
  const [at, setAt] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [id, basis, why] = links[at];
  const food: Food = FOODS[id];
  return (
    <>
      <Picker label="Pilih hidangan" at={at} onPick={(i) => { setAt(i); setPicked(null); }} items={links.map(([x, b]) => ({ id: x, name: FOODS[x].name, basis: b }))} />
      <Shell key={id} id={id} name={food.name} basis={basis} why={why}>
        <p className="mt-0 text-sm font-bold">{food.from}</p>
        <p className="mt-0 max-w-[62ch] leading-[1.75]">{food.about}<SourceLinks ids={food.sources} /></p>
        <h4 className="mt-4 mb-2 text-lg">Bahan utama</h4>
        <ul className="m-0 flex flex-wrap gap-2 p-0">
          {food.ingredients.map((x) => (
            <li key={x} className="list-none"><button type="button" className="chip bg-white/60" aria-pressed={picked === x} onClick={() => setPicked(picked === x ? null : x)}>{x}</button></li>
          ))}
        </ul>
        <p className="mt-1.5 mb-0 min-h-5 text-sm" role="status">{picked ? `${picked} ditandai. Ketuk bahan untuk menandainya selagi membaca cara membuat.` : ''}</p>
        {food.steps && <Steps title="Garis besar cara membuat" steps={food.steps} />}
        {food.context && <p className="mt-5 mb-0 max-w-[62ch] leading-[1.75]"><strong>Penyajian dan konteks. </strong>{food.context}</p>}
        <p className="mt-3 mb-0 text-xs opacity-70">Ini pengenalan budaya, bukan resep lengkap. Takaran dan cara memasak berbeda antardapur.</p>
      </Shell>
    </>
  );
}

export function CustomExplorer({ links }: { links: Link<CustomId>[] }) {
  const [at, setAt] = useState(0);
  const [id, basis, why] = links[at];
  const c: Custom = CUSTOMS[id];
  return (
    <>
      <Picker label="Pilih tradisi" at={at} onPick={setAt} items={links.map(([x, b]) => ({ id: x, name: CUSTOMS[x].name, basis: b }))} />
      <Shell key={id} id={id} name={c.name} basis={basis} why={why}>
        <p className="mt-0 flex flex-wrap items-center gap-2 text-sm font-bold"><KindTag kind={c.kind} /> {c.community}</p>
        <p className="mt-2 max-w-[62ch] leading-[1.75]">{c.about}<SourceLinks ids={c.sources} /></p>
        {c.practice && <Steps title="Bagaimana berlangsung" steps={c.practice} />}
        {c.meaning && <p className="mt-5 mb-0 max-w-[62ch] leading-[1.75]"><strong>Fungsi dan makna yang disebut sumber. </strong>{c.meaning}</p>}
        {c.today && <p className="mt-3 mb-0 max-w-[62ch] leading-[1.75]"><strong>Perlu diingat. </strong>{c.today}</p>}
        {c.related && <p className="mt-3 mb-0 text-sm"><strong>Terkait:</strong> {c.related.join(', ')}</p>}
      </Shell>
    </>
  );
}
