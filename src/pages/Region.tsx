/** The learning page of one regency or city, laid out like an entry in a museum catalogue. */
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import AboutExperience from '../components/credits/AboutExperience';
import { CitationContext } from '../components/credits/citations';
import SourcesPanel, { type AudioCredit } from '../components/credits/SourcesPanel';
import HistoryTimeline from '../components/region/HistoryTimeline';
import { CustomExplorer, FoodExplorer } from '../components/region/HeritageExplorer';
import { AREAS } from '../data/area-content';
import { CUSTOMS, FOODS } from '../data/heritage';
import CulturalGallery from '../components/region/CulturalGallery';
import CulturalQuiz from '../components/region/CulturalQuiz';
import ExplorationProgress from '../components/region/ExplorationProgress';
import PronunciationDeck from '../components/region/PronunciationDeck';
import RegionalLandmark3D from '../components/region/RegionalLandmark3D';
import { KindTag, Narrate, SourceLinks } from '../components/ui';
import { ADMIN, CONTENT_LINKS, districtById, fullName, type District } from '../data/atlas';
import { ARTIFACTS } from '../data/artifacts';
import { GLOSSARY } from '../data/glossary';
import { LANDMARKS, type Section as LandmarkSection } from '../data/landmarks';
import { AREA_LANGUAGES, HERITAGE_PHOTOS, RECORDINGS, photosFor } from '../data/media';
import { THEMES, zoneOf } from '../data/pathways';
import { regionById, type Region, type TopicKey } from '../data/regions';
import { SCENES } from '../data/scenes';
import type { SourceId } from '../data/sources';
import type { Fact } from '../data/types';
import { placementById } from '../lib/placement';
import { useProgress } from '../lib/progress';
import { href } from '../lib/router';
import { prefersReducedMotion } from '../three/device';

interface Group {
  /** Null for facts about this area's own landmark; otherwise the community the facts describe. */
  from: string | null;
  facts: Fact[];
}

/** The landmark's own facts first, then material from linked community pages, always labelled as such. */
function collect(id: string, communities: Region[], own: LandmarkSection[], topics: TopicKey[]): Group[] {
  const landmark = LANDMARKS[id];
  return [
    { from: null, facts: own.flatMap((k) => landmark.facts[k] ?? []) },
    ...communities.map((r) => ({ from: r.name, facts: topics.flatMap((k) => r.topics[k] ?? []) })),
  ].filter((g) => g.facts.length);
}

/** Catalogue entries: the knowledge label sits in the margin, the text keeps a comfortable measure. */
function Entries({ groups }: { groups: Group[] }) {
  return (
    <>
      {groups.map((g) => (
        <div key={g.from ?? 'landmark'} className="mb-8 last:mb-0">
          {g.from && (
            <p className="mt-0 mb-4 max-w-[62ch] border-l-4 border-terracotta-500 bg-cream py-2 pr-3 pl-3 text-sm">
              <strong>Dari materi komunitas: {g.from}.</strong> Berlaku untuk komunitas atau tempat itu, belum tentu khas atau hanya ada di wilayah ini.
            </p>
          )}
          {g.facts.map((f) => (
            <div key={f.text} className="grid gap-2 border-t border-ink/12 py-5 first:border-t-0 first:pt-0 md:grid-cols-[11.5rem_minmax(0,1fr)] md:gap-6">
              <div className="md:pt-1"><KindTag kind={f.kind} /></div>
              <div className="max-w-[62ch]">
                <p className="m-0 text-[1.05rem] leading-[1.75]">{f.text}</p>
                <SourceLinks ids={f.sources} />
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

function Part({ id, title, lead, children }: { id: string; title: string; lead?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-34 border-t-2 border-ink/80 pt-4 pb-14 lg:scroll-mt-24">
      <h2 id={`${id}-h`} className="mt-0 mb-1 text-3xl sm:text-4xl">{title}</h2>
      {lead && <p className="mt-0 mb-0 max-w-[62ch] opacity-75">{lead}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

const jump = (id: string) => {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: prefersReducedMotion() ? 'instant' : 'smooth' });
  el?.setAttribute('tabindex', '-1');
  el?.focus({ preventScroll: true });
};

/** Which section is currently being read. */
function useReading(ids: string[]) {
  const [current, setCurrent] = useState(ids[0]);
  useEffect(() => {
    const onScroll = () => {
      let at = ids[0];
      for (const id of ids) if ((document.getElementById(id)?.getBoundingClientRect().top ?? 1e9) < window.innerHeight * 0.35) at = id;
      setCurrent(at);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ids.join()]);
  return current;
}

function Contents({ items, current }: { items: [string, string][]; current: string }) {
  return (
    <ol className="m-0 flex gap-1 overflow-x-auto p-0 lg:block">
      {items.map(([id, label], i) => (
        <li key={id} className="shrink-0 list-none">
          <button
            type="button"
            onClick={() => jump(id)}
            aria-current={current === id ? 'location' : undefined}
            className={`flex min-h-11 w-full cursor-pointer items-center gap-3 border-b-2 px-3 text-left text-sm font-bold whitespace-nowrap lg:border-b-0 lg:border-l-2 ${current === id ? 'border-terracotta-500 text-terracotta-700' : 'border-transparent opacity-70 hover:opacity-100 lg:border-ink/15'}`}
          >
            <span aria-hidden="true" className="w-5 text-xs tabular-nums max-lg:hidden">{String(i + 1).padStart(2, '0')}</span>
            {label}
          </button>
        </li>
      ))}
    </ol>
  );
}

/** The three closest other landmarks, by position on the map. */
function nearby(id: string) {
  const from = placementById.get(id)!.anchor;
  return ADMIN.filter((d) => d.id !== id)
    .map((d) => ({ d, far: Math.hypot(placementById.get(d.id)!.anchor[0] - from[0], placementById.get(d.id)!.anchor[1] - from[1]) }))
    .sort((a, b) => a.far - b.far)
    .slice(0, 3)
    .map((x) => x.d);
}

function RegionalExplorer({ district }: { district: District }) {
  const id = district.id;
  const landmark = LANDMARKS[id];
  const scene = SCENES[id];
  const links = CONTENT_LINKS[id] ?? [];
  const communities = links.map((x) => regionById(x)!);
  const { visit } = useProgress();

  useEffect(() => {
    visit('region', id);
    document.title = `${fullName(district)} · RuangNusantara`;
  }, [id]);

  const history = collect(id, communities, ['history'], ['identity', 'history']);
  const architecture = collect(id, communities, ['architecture'], ['architecture']);
  const traditions = collect(id, communities, ['traditions'], ['traditions', 'clothing']);
  const arts = collect(id, communities, ['arts'], ['crafts']);
  const culinary = collect(id, communities, ['culinary'], ['food']);
  const stories = collect(id, communities, ['stories'], ['stories']);

  const told = (f: Fact) => f.kind === 'folklore' || f.kind === 'tradition';
  const split = (pick: (f: Fact) => boolean) => stories.map((g) => ({ ...g, facts: g.facts.filter(pick) })).filter((g) => g.facts.length);
  const spoken = split(told);
  const recorded = split((f) => !told(f));

  const area = AREAS[id];
  const photos = photosFor(id);
  const terms = GLOSSARY[id] ?? [];
  const languages = AREA_LANGUAGES[id] ?? [];
  const heritagePhotos = [...area.foods.map((f) => f[0] as string), ...area.traditions.map((t) => t[0] as string)].flatMap((k) => (HERITAGE_PHOTOS[k] ? [HERITAGE_PHOTOS[k]] : []));
  const audio: AudioCredit[] = languages.flatMap((language) => RECORDINGS[language].map((r) => ({ ...r, language })));

  // References are numbered in reading order; a citation number on the page opens the matching entry.
  const references = useMemo(() => [
    ...new Set<SourceId>([
      ...area.people.sources,
      ...area.timeline.flatMap((x) => x.sources),
      ...scene.spots.flatMap((s) => s.info.sources),
      ...[history, architecture].flatMap((groups) => groups.flatMap((g) => g.facts.flatMap((f) => f.sources))),
      ...area.traditions.flatMap(([k]) => CUSTOMS[k].sources),
      ...[traditions, arts].flatMap((groups) => groups.flatMap((g) => g.facts.flatMap((f) => f.sources))),
      ...area.foods.flatMap(([k]) => FOODS[k].sources),
      ...[culinary, stories].flatMap((groups) => groups.flatMap((g) => g.facts.flatMap((f) => f.sources))),
      ...area.places.flatMap((x) => x.sources),
      ...terms.flatMap((t) => t.sources),
    ]),
  ], [id]);
  const [panel, setPanel] = useState<{ focus?: SourceId } | null>(null);
  const citations = useMemo(() => ({ number: (s: SourceId) => references.indexOf(s) + 1, open: (focus?: SourceId) => setPanel({ focus }) }), [references]);

  const topics: [string, string, boolean][] = [
    ['sejarah', 'Sejarah', area.timeline.length > 0],
    ['arsitektur', 'Arsitektur', architecture.length > 0],
    ['tradisi', 'Tradisi', area.traditions.length > 0 || traditions.length > 0],
    ['seni', 'Seni dan bahasa', arts.length > 0 || languages.length > 0],
    ['kuliner', 'Kuliner', area.foods.length > 0 || culinary.length > 0],
    ['tempat', 'Tempat', area.places.length > 0],
    ['cerita', 'Cerita', stories.length > 0],
  ];
  const missing = topics.filter((t) => !t[2]).map((t) => t[1].toLowerCase());
  const present = (key: string) => topics.find((t) => t[0] === key)![2];

  const contents: [string, string][] = [
    ['gambaran', 'Gambaran wilayah'],
    ['landmark', 'Jelajah 3D'],
    ...topics.filter((t) => t[2]).map(([key, label]) => [key, label] as [string, string]),
    ...(terms.length ? [['istilah', 'Istilah lokal'] as [string, string]] : []),
    ['galeri', 'Galeri'],
    ['kuis', 'Kuis'],
  ];
  const current = useReading(contents.map(([key]) => key));

  const artifacts = ARTIFACTS.filter((a) => links.includes(a.regionId));
  const number = ADMIN.findIndex((d) => d.id === id) + 1;
  const zone = zoneOf(id);
  const themes = THEMES.filter((t) => t.areas.includes(id));
  const narration = `${fullName(district)}. ${area.lead} Landmark pilihan: ${landmark.name}. ${landmark.why}`;
  const body = 'mx-auto w-full max-w-7xl px-5 sm:px-8';

  return (
    <CitationContext.Provider value={citations}>
    <article className="paper text-ink">
      <header className="relative overflow-hidden bg-forest-900 pt-24 text-ivory">
        <div className={`${body} grid gap-8 pb-9 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-end`}>
          <div>
            <a className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-gold-300 underline-offset-4 hover:underline" href={href('/explore')}>← Kembali ke peta</a>
            <p className="eyebrow mt-4 mb-0 opacity-75">
              Koleksi {String(number).padStart(2, '0')} / {ADMIN.length} · {district.type === 'kota' ? 'Kota' : 'Kabupaten'} · {zone.name}
            </p>
            <h1 className="display mt-2 mb-3">{district.name}</h1>
            <p className="m-0 max-w-2xl text-xl leading-relaxed opacity-90">{area.lead}</p>
            <div className="mt-3 flex flex-wrap gap-x-6 text-gold-300">
              <button type="button" className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm font-bold underline-offset-4 hover:underline" onClick={() => setPanel({})}>
                <span aria-hidden="true">❐</span>Sumber &amp; Kredit ({references.length})
              </button>
              <AboutExperience />
            </div>
          </div>
          <dl className="m-0 grid gap-3 text-sm">
            <div className="border-t border-ivory/25 pt-2"><dt className="text-xs font-bold tracking-wider text-gold-300 uppercase">Landmark · {landmark.category}</dt><dd className="m-0 font-display text-xl">{landmark.name}</dd></div>
            <div className="border-t border-ivory/25 pt-3"><ExplorationProgress compact /></div>
          </dl>
        </div>
        <div className="weave" aria-hidden="true" />
      </header>

      <nav className="sticky top-18 z-30 border-b border-ink/15 bg-ivory/97 lg:hidden" aria-label="Daftar isi halaman">
        <Contents items={contents} current={current} />
      </nav>

      <div className={`${body} grid gap-x-12 pt-10 lg:grid-cols-[13rem_minmax(0,1fr)]`}>
        <nav className="hidden lg:block" aria-label="Daftar isi halaman">
          <div className="sticky top-24"><Contents items={contents} current={current} /></div>
        </nav>

        <div className="min-w-0">
          <Part id="gambaran" title="Gambaran wilayah">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem]">
              <dl className="m-0 max-w-[62ch] space-y-5">
                <div><dt className="font-extrabold">Geografi</dt><dd className="m-0 leading-relaxed">{landmark.place}</dd></div>
                <div><dt className="font-extrabold">Masyarakat dan bahasa</dt><dd className="m-0 leading-relaxed">{area.people.text}<SourceLinks ids={area.people.sources} /></dd></div>
                <div>
                  <dt className="font-extrabold">Mengapa {landmark.name}</dt>
                  <dd className="m-0 leading-relaxed">{landmark.why}{landmark.evidence === 'terbatas' && <strong> Dasar pemilihannya masih lemah dan perlu ditinjau warga atau ahli.</strong>}</dd>
                </div>
              </dl>
              <div className="space-y-4">
                <Narrate text={narration} />
                <nav aria-label="Yang bisa dijelajahi" className="border-t-2 border-ink/80 pt-2">
                  <ul className="m-0 p-0">
                    {([['sejarah', `${area.timeline.length} titik waktu`], ['tradisi', `${area.traditions.length} tradisi untuk ditelusuri`], ['kuliner', `${area.foods.length} sajian`], ['galeri', `${photos.length} foto`]] as const)
                      .filter(([key, label]) => !label.startsWith('0 ') && contents.some((c) => c[0] === key))
                      .map(([key, label]) => <li key={key} className="list-none"><button type="button" className="flex min-h-11 w-full cursor-pointer items-center justify-between text-left text-sm font-bold hover:text-terracotta-700" onClick={() => jump(key)}>{label}<span aria-hidden="true">↓</span></button></li>)}
                  </ul>
                </nav>
                {missing.length > 0 && <p className="m-0 text-xs opacity-75">Belum diriset untuk {district.name}: {missing.join(', ')}.</p>}
              </div>
            </div>
          </Part>

          <section id="landmark" className="scroll-mt-34 pb-14 lg:scroll-mt-24" aria-labelledby="landmark-h">
            <div className="border-t-2 border-ink/80 pt-4 pb-5">
              <h2 id="landmark-h" className="m-0 text-3xl sm:text-4xl">{scene.title}</h2>
              <p className="mt-1 mb-0 max-w-[62ch] opacity-75">Putar modelnya, lalu buka titik bernomor satu per satu. Daftar di sebelahnya memuat isi yang sama tanpa perlu menyentuh model.</p>
            </div>
            <div className="-mx-5 overflow-hidden sm:mx-0 sm:rounded-lg"><RegionalLandmark3D scene={scene} /></div>
            {artifacts.length > 0 && (
              <p className="mt-4 mb-0 flex flex-wrap items-center gap-2 text-sm">
                <strong>Artefak 3D terkait:</strong>
                {artifacts.map((a) => <a key={a.id} className="chip" href={href('/artefak', { id: a.id })}>{a.name}</a>)}
              </p>
            )}
          </section>

          {present('sejarah') && (
            <Part id="sejarah" title="Sejarah" lead="Telusuri dari waktu ke waktu. Label membedakan catatan sejarah, penafsiran, dan penuturan.">
              <HistoryTimeline moments={area.timeline} />
              {history.length > 0 && (
                <details className="mt-6">
                  <summary className="min-h-11 cursor-pointer py-2 font-extrabold">Catatan sejarah tambahan</summary>
                  <div className="pt-3"><Entries groups={history} /></div>
                </details>
              )}
            </Part>
          )}
          {present('arsitektur') && <Part id="arsitektur" title="Arsitektur dan peninggalan"><Entries groups={architecture} /></Part>}
          {present('tradisi') && (
            <Part id="tradisi" title="Tradisi dan kehidupan">
              {area.traditions.length > 0 && <CustomExplorer links={area.traditions} />}
              {traditions.length > 0 && <div className={area.traditions.length ? 'mt-9' : ''}><Entries groups={traditions} /></div>}
            </Part>
          )}
          {present('seni') && (
            <Part id="seni" title="Seni, kerajinan, dan bahasa">
              <Entries groups={arts} />
              <p className="mt-5 mb-5"><a className="btn btn-terra" href={href('/alat-musik')}>Coba mainkan alat musik tradisional →</a></p>
              <div className="space-y-4">{languages.map((l) => <PronunciationDeck key={l} language={l} />)}</div>
            </Part>
          )}
          {present('kuliner') && (
            <Part id="kuliner" title="Kuliner dan hasil bumi">
              {area.foods.length > 0 && <FoodExplorer links={area.foods} />}
              {culinary.length > 0 && <div className={area.foods.length ? 'mt-9' : ''}><Entries groups={culinary} /></div>}
            </Part>
          )}
          {present('tempat') && (
            <Part id="tempat" title="Tempat yang layak dikenal">
              <ul className="m-0 grid gap-x-10 p-0 md:grid-cols-2">
                {area.places.map((x, i) => (
                  <li key={x.name} className="grid list-none grid-cols-[3rem_minmax(0,1fr)] gap-3 border-t border-ink/15 py-4">
                    <span aria-hidden="true" className="font-display text-3xl text-terracotta-700">{i + 1}</span>
                    <span><span className="block font-display text-2xl leading-tight">{x.name}</span><span className="block leading-relaxed">{x.text}<SourceLinks ids={x.sources} /></span></span>
                  </li>
                ))}
              </ul>
            </Part>
          )}
          {present('cerita') && (
            <Part id="cerita" title="Cerita budaya" lead="Cerita tutur dipisahkan dari catatan sejarah dan keadaan masa kini.">
              {spoken.length > 0 && <><h3 className="mt-0 mb-4 text-2xl">Cerita rakyat dan tradisi tutur</h3><Entries groups={spoken} /></>}
              {recorded.length > 0 && <><h3 className="mt-8 mb-4 text-2xl first:mt-0">Catatan sejarah dan masa kini</h3><Entries groups={recorded} /></>}
              {links.includes('lake-toba') && <a className="btn btn-terra mt-5" href={href('/gallery')}>Baca cerita Danau Toba di Galeri</a>}
            </Part>
          )}

          {terms.length > 0 && (
            <Part id="istilah" title="Istilah lokal">
              <dl className="m-0 grid gap-x-10 md:grid-cols-2">
                {terms.map((t) => (
                  <div key={t.term} className="border-t border-ink/15 py-4">
                    <dt className="font-display text-2xl">{t.term}</dt>
                    <dd className="m-0"><p className="mt-1 mb-0 leading-relaxed">{t.meaning}</p><SourceLinks ids={t.sources} /></dd>
                  </div>
                ))}
              </dl>
            </Part>
          )}

          <Part id="galeri" title="Galeri" lead="Label menunjukkan apa yang sebenarnya diperlihatkan. Ketuk foto untuk memperbesar.">
            {photos.length > 0 && !photos.some((p) => p.relation === 'objek') && (
              <p className="mt-0 mb-6 max-w-[62ch] border border-dashed border-ink/40 p-3 text-sm"><strong>Belum ada foto {landmark.name}</strong> berlisensi terbuka yang bisa kami pastikan. Foto di bawah memperlihatkan hal lain, sesuai labelnya.</p>
            )}
            {photos.length ? <CulturalGallery items={photos} /> : (
              <div className="grid aspect-[16/6] min-h-44 place-items-center border border-dashed border-ink/40 p-6 text-center">
                <p className="m-0 max-w-md"><strong className="block font-display text-2xl">Belum ada foto terverifikasi</strong>Kami tidak memakai foto tempat lain atau gambar buatan mesin sebagai pengganti.</p>
              </div>
            )}
          </Part>

          <Part id="kuis" title="Kuis pemahaman" lead="Pilihan. Tidak ada materi yang dikunci, dan boleh diulang."><CulturalQuiz scene={scene} /></Part>

          <p className="border-t-2 border-ink/80 pt-4 pb-10">
            <button type="button" className="btn btn-line" onClick={() => setPanel({})}>Buka Sumber &amp; Kredit ({references.length} rujukan)</button>
          </p>
        </div>
      </div>

      <div className="bg-forest-900 py-12 text-ivory">
        <div className={`${body} grid gap-10 md:grid-cols-2`}>
          <div>
            <h2 className="mt-0 mb-3 text-3xl">Lanjutkan ke wilayah terdekat</h2>
            <ul className="m-0 p-0">
              {nearby(id).map((d) => (
                <li key={d.id} className="list-none border-t border-ivory/20">
                  <a className="group flex min-h-16 items-center justify-between gap-4 py-2" href={href('/wilayah', { id: d.id })}>
                    <span><span className="block font-display text-xl group-hover:text-gold-300">{d.name}</span><span className="block text-sm opacity-70">{LANDMARKS[d.id].name}</span></span>
                    <span aria-hidden="true">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mt-0 mb-3 text-3xl">Atau ikuti jalur tema</h2>
            <p className="mt-0 text-sm opacity-75">Jalur menunjukkan wilayah yang sudah punya materi di atlas ini, bukan batas sebaran budayanya.</p>
            <div className="flex flex-wrap gap-2">
              {themes.map((t) => <a key={t.id} className="chip" href={href('/wilayah', { tema: t.id })}>{t.name} ({t.areas.length})</a>)}
            </div>
            <a className="btn btn-gold mt-6" href={href('/explore')}>Kembali ke peta</a>
          </div>
        </div>
      </div>
    </article>
    <SourcesPanel open={!!panel} focus={panel?.focus} onClose={() => setPanel(null)} references={references} photos={[...photos, ...heritagePhotos]} audio={audio} />
    </CitationContext.Provider>
  );
}

export default function RegionView({ district }: { district: District }) {
  const id = district.id;
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);
  // Keyed so that quiz answers and the camera reset between areas.
  return <RegionalExplorer key={id} district={district} />;
}
