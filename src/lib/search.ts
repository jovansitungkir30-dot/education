/** One search over area names, landmarks, categories and local terms, shared by the map and the directory. */
import { ADMIN, fullName, type District } from '../data/atlas';
import { GLOSSARY } from '../data/glossary';
import { LANDMARKS } from '../data/landmarks';

const plain = (s: string) => s.toLocaleLowerCase('id').normalize('NFD').replace(/[̀-ͯ]/g, '');

const INDEX = ADMIN.map((d) => ({
  d,
  name: plain(fullName(d)),
  landmark: plain(LANDMARKS[d.id].name),
  rest: plain([LANDMARKS[d.id].category, LANDMARKS[d.id].preview, ...(GLOSSARY[d.id] ?? []).map((t) => t.term)].join(' ')),
}));

/** Every word must match somewhere. Name matches come first, then landmark matches. */
export function searchAreas(query: string): District[] {
  const words = plain(query).split(/\s+/).filter(Boolean);
  if (!words.length) return ADMIN;
  return INDEX.map((x) => {
    let score = 0;
    for (const w of words) {
      if (x.name.includes(w)) score += x.name.split(' ').some((part) => part.startsWith(w)) ? 12 : 8;
      else if (x.landmark.includes(w)) score += 4;
      else if (x.rest.includes(w)) score += 1;
      else return null;
    }
    return { d: x.d, score };
  })
    .filter((x) => x !== null)
    .sort((a, b) => b.score - a.score || a.d.name.localeCompare(b.d.name, 'id'))
    .map((x) => x.d);
}
