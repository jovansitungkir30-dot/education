import { SectionHead, Credit, KindTag } from '../components/ui';
import { SOURCES } from '../data/sources';
import { ALL_PHOTOS } from '../data/photos';
import { KNOWLEDGE, type Knowledge } from '../data/types';

const LIMITS = [
  'Sources were located by web search and reviewed through summaries and excerpts, not full texts. Treat every citation as a starting point to verify.',
  'Some statements have no source attached. They are marked “Pending expert review” where facts are shown, and still need confirmation.',
  'No community representative or subject specialist has reviewed this content yet.',
  'Angkola, Pakpak and several other topics are thinly covered. Gaps are shown openly instead of being filled with guesses.',
  '3D models are simplified, procedural representations. They are not measured or historically exact replicas.',
  'Audio samples are synthesised in the browser. They are not recordings or traditional compositions. Narration uses your device’s computer voice and may mispronounce local names.',
  'Map points are approximate reference locations, not cultural or administrative boundaries.',
  'Interface and content are in English only. Local spellings and terms vary.',
];

export default function About() {
  return (
    <div className="pt-30 pb-24">
      <div className="wrap">
        <SectionHead as="h1" eyebrow="About" title="A digital space for careful cultural learning">
          RuangNusantara introduces the heritage of North Sumatra to students, travellers and curious people. It aims to be vivid without flattening differences between communities.
        </SectionHead>

        <section className="paper mt-12 rounded-3xl p-6 sm:p-10">
          <h2 className="mt-0 text-3xl">How to read the labels</h2>
          <dl className="grid gap-5 md:grid-cols-2">
            {(Object.keys(KNOWLEDGE) as Knowledge[]).map((k) => (
              <div key={k}><dt><KindTag kind={k} /></dt><dd className="mt-1.5 ml-0">{KNOWLEDGE[k].hint}</dd></div>
            ))}
          </dl>
          <h2 className="mt-10 text-3xl">Known limitations</h2>
          <ul className="list-disc space-y-1.5 pl-5">{LIMITS.map((l) => <li key={l}>{l}</li>)}</ul>
          <p>If you belong to one of these communities and see something wrong or missing, your knowledge should take priority in a revision.</p>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl">References</h2>
          <ul className="grid gap-4 p-0 md:grid-cols-2">
            {Object.values(SOURCES).map((s) => (
              <li key={s.url} className="list-none rounded-2xl border border-ivory/15 p-4">
                <a className="font-bold underline underline-offset-2" href={s.url} target="_blank" rel="noreferrer">{s.title}</a>
                <span className="mt-1 block text-sm opacity-70">{s.publisher} · {s.type}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl">Photo credits</h2>
          <p className="text-sm opacity-75">Resized by Wikimedia Commons; some are cropped by the page layout. Each remains under its stated licence.</p>
          <ul className="grid gap-3 p-0 md:grid-cols-2">
            {ALL_PHOTOS.map((p) => (
              <li key={p.id} className="list-none text-sm"><strong>{p.alt}.</strong> <Credit id={p.id} /></li>
            ))}
          </ul>
          <p className="mt-6 text-sm opacity-75">Map data © OpenStreetMap contributors. Typefaces: Fraunces and Manrope (SIL Open Font License).</p>
        </section>
      </div>
    </div>
  );
}
