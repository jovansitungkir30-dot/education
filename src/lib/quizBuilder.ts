/** Builds an area's quiz from its own researched material, so questions and page content stay consistent. */
import { shuffle, type Ask } from '../components/learn/questions';
import { AREAS } from '../data/area-content';
import { ADMIN, districtById, fullName } from '../data/atlas';
import { FOODS } from '../data/heritage';
import { LANDMARKS } from '../data/landmarks';
import { AREA_PHOTOS } from '../data/media';
import { zoneOf } from '../data/pathways';
import { SCENES } from '../data/scenes';

export interface QuizItem {
  ask: Ask;
  topic: 'Letak' | 'Landmark' | 'Sejarah' | 'Kuliner' | 'Foto';
  /** Section of the area page where the answer is explained. */
  section: string;
}

/** The first four-digit year in a label, used only to order moments that have one. */
const yearOf = (when: string) => Number(/\b(1[0-9]{3}|20[0-9]{2})\b/.exec(when)?.[1] ?? NaN);

export function mapAsk(id: string): Ask {
  const others = shuffle(ADMIN.filter((d) => d.id !== id && d.type === districtById(id)!.type), id);
  // Prefer candidates from other zones so the question tests geography rather than luck.
  const far = [...others.filter((d) => zoneOf(d.id).id !== zoneOf(id).id), ...others].slice(0, 3);
  return {
    type: 'map',
    q: `Di peta, manakah letak ${fullName(districtById(id)!)}?`,
    candidates: shuffle([id, ...far.map((d) => d.id)], id + 'map'),
    answer: id,
    why: `${fullName(districtById(id)!)} berada di zona ${zoneOf(id).name.toLowerCase()}. ${LANDMARKS[id].place}`,
  };
}

function orderAsk(id: string): Ask | null {
  const dated: { label: string; when: string; year: number }[] = [];
  for (const m of AREAS[id].timeline) {
    const year = yearOf(m.when);
    if (Number.isFinite(year) && m.kind !== 'folklore' && m.kind !== 'tradition' && !dated.some((d) => d.year === year)) dated.push({ label: m.title, when: m.when, year });
  }
  if (dated.length < 3) return null;
  const items = dated.sort((a, b) => a.year - b.year).slice(0, 4);
  return {
    type: 'order',
    q: `Urutkan peristiwa dalam sejarah ${districtById(id)!.name}.`,
    items,
    why: items.map((x) => `${x.when}: ${x.label}`).join(' → ') + '.',
  };
}

function foodAsk(id: string): Ask | null {
  const link = AREAS[id].foods.find(([f]) => FOODS[f].ingredients.length >= 3 && f !== 'ragamMedan' && f !== 'lautTanjungbalai');
  if (!link) return null;
  const food = FOODS[link[0]];
  const own = food.ingredients.map((x) => x.toLowerCase());
  // Wrong options are ingredients that clearly belong to other kinds of dishes and not to this one.
  const others = ['Keju parut', 'Cokelat bubuk', 'Rumput laut', 'Tepung gandum utuh', 'Yoghurt', 'Selai stroberi'].filter((x) => !own.some((o) => o.includes(x.toLowerCase())));
  const correct = food.ingredients[0];
  const options = shuffle([correct, ...shuffle(others, id).slice(0, 2)], id + 'food');
  return { type: 'choice', q: `Manakah yang termasuk bahan utama ${food.name}?`, options, answer: options.indexOf(correct), why: `${food.name}: ${food.about}` };
}

function photoAsk(id: string): Ask | null {
  const mine = AREA_PHOTOS[id]?.find((p) => p.relation === 'objek');
  if (!mine) return null;
  const others = shuffle(Object.entries(AREA_PHOTOS).filter(([k]) => k !== id).flatMap(([k, list]) => {
    const p = list.find((x) => x.relation === 'objek');
    // Avoid distractors of the same kind, which could be mistaken for the answer.
    return p && LANDMARKS[k].category !== LANDMARKS[id].category ? [p] : [];
  }), id + 'photo').slice(0, 2);
  if (others.length < 2) return null;
  const photos = shuffle([mine, ...others], id + 'order');
  return {
    type: 'photo',
    q: `Foto manakah yang berkaitan dengan ${LANDMARKS[id].name}?`,
    photos: photos.map((p) => ({ file: p.file, alt: p.alt })),
    answer: photos.indexOf(mine),
    why: `${mine.alt}. ${LANDMARKS[id].preview}`,
  };
}

export function buildQuiz(id: string): QuizItem[] {
  const own: QuizItem[] = SCENES[id].quiz.map((q) => ({ ask: { type: 'choice', ...q }, topic: 'Landmark', section: 'landmark' }));
  const extra: [Ask | null, QuizItem['topic'], string][] = [
    [orderAsk(id), 'Sejarah', 'sejarah'],
    [foodAsk(id), 'Kuliner', 'kuliner'],
    [photoAsk(id), 'Foto', 'galeri'],
  ];
  return [
    { ask: mapAsk(id), topic: 'Letak', section: 'gambaran' },
    ...own,
    ...extra.flatMap(([ask, topic, section]) => (ask ? [{ ask, topic, section }] : [])),
  ];
}
