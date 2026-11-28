/** The learning page of one regency or city. */
import { useEffect, type ReactNode } from 'react';
import CulturalGallery, { type GalleryItem } from '../components/region/CulturalGallery';
import CulturalQuiz from '../components/region/CulturalQuiz';
import ExplorationProgress from '../components/region/ExplorationProgress';
import RegionalLandmark3D from '../components/region/RegionalLandmark3D';
import { FactBlock, Narrate, ReviewNote, SoundDesk, SourceLinks } from '../components/ui';
import { ADMIN, CONTENT_LINKS, districtById, fullName, type District } from '../data/atlas';
import { ARTIFACTS } from '../data/artifacts';
import { LANDMARKS, type Section as LandmarkSection } from '../data/landmarks';
import rawPhotos from '../data/landmark-photos.json';
import { photo } from '../data/photos';
import { regionById, type Region, type TopicKey } from '../data/regions';
import { SCENES } from '../data/scenes';
import type { SourceId } from '../data/sources';
import type { Fact } from '../data/types';
import { href } from '../lib/router';
import { useProgress } from '../lib/progress';

const LANDMARK_PHOTOS = rawPhotos as Record<string, GalleryItem>;

const NAV = [
  ['pengenalan', 'Pengenalan'], ['landmark', 'Landmark 3D'], ['tradisi', 'Tradisi'], ['musik', 'Musik dan tari'], ['kuliner', 'Kuliner'],
  ['galeri', 'Galeri'], ['cerita', 'Cerita'], ['kuis', 'Kuis'], ['referensi', 'Referensi'],
] as const;

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

function Facts({ groups, gap }: { groups: Group[]; gap: string }) {
  if (!groups.length) return <p className="m-0 max-w-2xl rounded-xl border border-dashed border-ink/35 p-4">{gap}</p>;
  return (
    <div className="space-y-9">
      {groups.map((g) => (
        <div key={g.from ?? 'landmark'}>
          {g.from && (
            <p className="mt-0 mb-4 border-l-4 border-terracotta-500 pl-3 text-sm">
              <strong>Dari materi komunitas: {g.from}.</strong> Berlaku untuk komunitas atau tempat itu, belum tentu khas wilayah ini.
            </p>
          )}
          <div className="grid gap-x-10 gap-y-7 md:grid-cols-2">
            {g.facts.map((f) => <FactBlock key={f.text} item={f} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

function Part({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-32 border-t border-ink/15 py-12">
      <div className="wrap">
        <h2 className="mt-0 mb-6 text-3xl sm:text-4xl">{title}</h2>
        {children}
      </div>
    </section>
  );
}

const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

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

  const photos: GalleryItem[] = [
    ...(LANDMARK_PHOTOS[id] ? [LANDMARK_PHOTOS[id]] : []),
    ...[...new Set(communities.flatMap((r) => r.photos))].map((p) => photo(p)),
  ];

  const references = [
    ...new Set<SourceId>([
      ...[history, architecture, traditions, arts, culinary, stories].flatMap((groups) => groups.flatMap((g) => g.facts.flatMap((f) => f.sources))),
      ...scene.spots.flatMap((s) => s.info.sources),
    ]),
  ];

  const artifacts = ARTIFACTS.filter((a) => links.includes(a.regionId));
  const index = ADMIN.findIndex((d) => d.id === id);
  const neighbour = (step: number) => ADMIN[(index + step + ADMIN.length) % ADMIN.length];
  const narration = `${fullName(district)}. ${landmark.place} Landmark pilihan: ${landmark.name}. ${landmark.why}`;

  return (
    <article className="paper text-ink">
      <header className="bg-forest-900 pt-24 pb-9 text-ivory">
        <div className="wrap grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
          <div>
            <a className="btn btn-gold" href={href('/explore')}>← Kembali ke peta</a>
            <p className="eyebrow mt-6 mb-0 text-gold-300">{district.type === 'kota' ? 'Kota' : 'Kabupaten'} · {landmark.category}</p>
            <h1 className="display mt-2 mb-2">{district.name}</h1>
            <p className="m-0 font-display text-2xl text-gold-300">{landmark.name}</p>
            <p className="mt-2 mb-0 max-w-2xl text-lg opacity-85">{landmark.preview}</p>
          </div>
          <ExplorationProgress />
        </div>
      </header>

      <nav className="sticky top-18 z-30 border-b border-ink/15 bg-ivory/95 backdrop-blur" aria-label="Bagian halaman">
        <div className="wrap flex gap-1 overflow-x-auto py-2">
          {NAV.map(([key, label]) => (
            <button key={key} type="button" className="chip whitespace-nowrap" onClick={() => jump(key)}>{label}</button>
          ))}
        </div>
      </nav>

      <section id="pengenalan" className="scroll-mt-32 py-12">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 className="mt-0 mb-4 text-3xl sm:text-4xl">Pengenalan</h2>
            <dl className="m-0 space-y-4">
              <div><dt className="font-extrabold">Geografi</dt><dd className="m-0">{landmark.place}</dd></div>
              <div><dt className="font-extrabold">Komunitas</dt><dd className="m-0">{landmark.communities}</dd></div>
              <div>
                <dt className="font-extrabold">Mengapa landmark ini</dt>
                <dd className="m-0">{landmark.why}</dd>
                {landmark.evidence === 'terbatas' && <dd className="m-0 mt-2 rounded-lg border border-dashed border-terracotta-700 p-2.5 text-sm"><strong>Dasar pemilihan masih terbatas.</strong> Pilihan ini perlu ditinjau ahli atau warga setempat.</dd>}
              </div>
            </dl>
            <div className="mt-5"><Narrate text={narration} /></div>
            <ReviewNote className="mt-4" />
          </div>
          <div>
            <h3 className="mt-0 mb-4 text-2xl">Latar sejarah</h3>
            <Facts groups={history} gap="Latar sejarah wilayah ini belum kami riset dengan sumber yang cukup." />
            {architecture.length > 0 && (
              <>
                <h3 className="mt-9 mb-4 text-2xl">Arsitektur dan peninggalan</h3>
                <Facts groups={architecture} gap="" />
              </>
            )}
          </div>
        </div>
      </section>

      <section id="landmark" className="scroll-mt-32" aria-labelledby="landmark-title">
        <div className="wrap pb-5">
          <h2 id="landmark-title" className="m-0 text-3xl sm:text-4xl">{scene.title}</h2>
          <p className="mt-1 mb-0">Putar modelnya, lalu pilih titik bernomor untuk membaca penjelasannya.</p>
        </div>
        <RegionalLandmark3D scene={scene} />
        {artifacts.length > 0 && (
          <div className="wrap flex flex-wrap items-center gap-2 pt-5">
            <strong>Artefak 3D terkait:</strong>
            {artifacts.map((a) => <a key={a.id} className="btn btn-line" href={href('/explore', { artifact: a.id })}>{a.name}</a>)}
          </div>
        )}
      </section>

      <Part id="tradisi" title="Tradisi dan kebiasaan">
        <Facts groups={traditions} gap={`Tradisi khusus ${fullName(district)} belum kami riset dengan sumber yang cukup, jadi bagian ini dibiarkan kosong.`} />
      </Part>

      <Part id="musik" title="Musik, tari, dan kerajinan">
        <Facts groups={arts} gap={`Musik dan tari ${fullName(district)} belum kami riset dengan sumber yang cukup. Kami tidak meminjam kesenian wilayah tetangga untuk mengisinya.`} />
        <p className="mt-6 mb-4 max-w-2xl text-sm">Belum ada rekaman musik atau video pertunjukan berlisensi yang bisa kami tampilkan untuk wilayah ini.</p>
        <SoundDesk />
      </Part>

      <Part id="kuliner" title="Kuliner">
        <Facts groups={culinary} gap={`Kuliner khas ${fullName(district)} belum kami riset dengan sumber yang cukup.`} />
        {landmark.category === 'Kuliner dan hasil bumi' && LANDMARK_PHOTOS[id] && (
          <div className="mt-7"><CulturalGallery items={[LANDMARK_PHOTOS[id]]} /></div>
        )}
      </Part>

      <Part id="galeri" title="Galeri">
        {photos.length ? (
          <>
            {!LANDMARK_PHOTOS[id] && <p className="mt-0">Belum ada foto {landmark.name} berlisensi terbuka yang kami verifikasi.{communities.length ? ' Foto di bawah berasal dari materi komunitas terkait.' : ''}</p>}
            <CulturalGallery items={photos} />
          </>
        ) : (
          <p className="m-0 max-w-2xl rounded-xl border border-dashed border-ink/35 p-4">Belum ada foto berlisensi terbuka yang kami verifikasi untuk wilayah ini. Kami tidak memakai foto tempat lain atau gambar buatan mesin sebagai pengganti.</p>
        )}
      </Part>

      <Part id="cerita" title="Cerita budaya">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="mt-0 text-2xl">Cerita rakyat dan tradisi tutur</h3>
            <Facts groups={split(told)} gap="Belum ada cerita rakyat wilayah ini yang kami riset." />
          </div>
          <div>
            <h3 className="mt-0 text-2xl">Catatan sejarah dan masa kini</h3>
            <Facts groups={split((f) => !told(f))} gap="Belum ada catatan tambahan." />
          </div>
        </div>
        {links.includes('lake-toba') && <a className="btn btn-terra mt-7" href={href('/gallery')}>Baca cerita Danau Toba di Galeri</a>}
      </Part>

      <Part id="kuis" title="Mini kuis">
        <CulturalQuiz scene={scene} />
      </Part>

      <Part id="referensi" title="Referensi">
        {references.length ? (
          <>
            <p className="mt-0 max-w-2xl text-sm">Keterangan “hanya ringkasan pencarian” berarti sumber itu belum kami baca utuh. Mohon periksa langsung sebelum mengutipnya.</p>
            <ul className="m-0 columns-1 gap-8 p-0 md:columns-2">
              {references.map((r) => <li key={r} className="mb-2 list-none break-inside-avoid"><SourceLinks ids={[r]} /></li>)}
            </ul>
          </>
        ) : (
          <p className="m-0">Belum ada sumber terlampir.</p>
        )}
      </Part>

      <div className="bg-forest-900 py-8 text-ivory">
        <div className="wrap flex flex-wrap items-center justify-between gap-3">
          <a className="btn btn-line" href={href('/wilayah', { id: neighbour(-1).id })}>← {neighbour(-1).name}</a>
          <a className="btn btn-gold" href={href('/explore')}>Kembali ke peta</a>
          <a className="btn btn-line" href={href('/wilayah', { id: neighbour(1).id })}>{neighbour(1).name} →</a>
        </div>
      </div>
    </article>
  );
}

export default function RegionPage({ params }: { params: URLSearchParams }) {
  const district = districtById(params.get('id'));
  const id = district?.id;
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  if (!district || !LANDMARKS[district.id]) {
    return (
      <div className="wrap grid min-h-dvh place-content-center gap-4 text-center">
        <h1 className="display">Wilayah tidak ditemukan.</h1>
        <a className="btn btn-gold justify-self-center" href={href('/explore')}>Pilih dari peta</a>
      </div>
    );
  }
  // Keyed so that quiz answers and the camera reset between areas.
  return <RegionalExplorer key={district.id} district={district} />;
}
