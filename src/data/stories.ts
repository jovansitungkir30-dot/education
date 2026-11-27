import { fact, type Fact, type Knowledge } from './types';
import type { PhotoId } from './photos';

export interface Chapter {
  title: string;
  fact: Fact;
  photo: PhotoId;
}

export interface Story {
  id: string;
  title: string;
  kicker: string;
  /** The dominant kind of knowledge in the story. Each chapter also carries its own label. */
  kind: Knowledge;
  intro: string;
  chapters: Chapter[];
}

export const STORIES: Story[] = [
  {
    id: 'legend', title: 'The legend of Lake Toba', kicker: 'A told story', kind: 'folklore',
    intro: 'A retelling in our own words of a widely shared legend. Storytellers differ on names, places and details.',
    chapters: [
      { title: 'The golden catch', photo: 'toba-panorama', fact: fact('folklore', 'A farmer named Toba, living alone, pulls an unusual golden fish from the water. It becomes a woman.', 'legendGnfi') },
      { title: 'A promise', photo: 'samosir-ferry', fact: fact('folklore', 'She agrees to share his life on one condition: where she came from must never be spoken of. They have a son, Samosir.', 'legendGnfi', 'legendDetik') },
      { title: 'The words that cannot return', photo: 'ulos-weaving', fact: fact('folklore', 'One day, in anger at the boy, Toba speaks of his mother’s origin. The promise is broken.', 'legendGnfi') },
      { title: 'Water and island', photo: 'toba-panorama', fact: fact('folklore', 'The boy climbs to high ground. His mother returns to the water, the land floods into a lake, and the high ground remains as an island.', 'legendGnfi', 'legendDetik') },
    ],
  },
  {
    id: 'earth', title: 'What the rocks record', kicker: 'Geology', kind: 'history',
    intro: 'The scientific account of the same landscape, kept separate from the legend.',
    chapters: [
      { title: 'A caldera', photo: 'samosir-ferry', fact: fact('history', 'Lake Toba fills a large caldera, a depression formed by collapse during major volcanic eruptions.', 'nasaToba') },
      { title: 'The youngest giant eruption', photo: 'toba-panorama', fact: fact('history', 'The most recent giant eruption is commonly dated to about 74,000 years ago. Published estimates differ by a few thousand years.', 'britannicaToba') },
      { title: 'Open questions', photo: 'toba-panorama', fact: fact('interpretation', 'Claims that it caused a near-collapse of the human population are disputed.', 'britannicaToba') },
    ],
  },
  {
    id: 'kinship', title: 'Three positions, one ceremony', kicker: 'Community values', kind: 'tradition',
    intro: 'Kinship frameworks organise who gives, who serves and who advises. Each community names and practises them in its own way.',
    chapters: [
      { title: 'Dalihan Na Tolu', photo: 'angkola-tortor', fact: fact('tradition', 'In Toba, Angkola and Mandailing settings, Dalihan Na Tolu names three interdependent kinship positions. Terms differ between communities.', 'dalihanCore') },
      { title: 'The hearth image', photo: 'tortor', fact: fact('interpretation', 'The phrase is often explained through a hearth of three stones: the pot is steady only when all three support it.', 'dalihanCore') },
      { title: 'Simalungun’s framework', photo: 'simalungun-house', fact: fact('tradition', 'Simalungun custom speaks of Tolu Sahundulan: tondong for counsel, sanina for deliberation and boru for strength. It is Simalungun’s own framework.', 'simalungunAdat') },
      { title: 'Roles move', photo: 'tortor', fact: fact('tradition', 'A position describes a relationship, not a permanent rank. A person can serve in one ceremony and be honoured in another.', 'dalihanCore') },
    ],
  },
  {
    id: 'ulos', title: 'A cloth that carries relationships', kicker: 'Textiles', kind: 'tradition',
    intro: 'Why ulos means more than its threads.',
    chapters: [
      { title: 'On the loom', photo: 'ulos-weaving', fact: fact('contemporary', 'Weaving ulos is still a working craft in the Toba region.', 'unescoUlosProject') },
      { title: 'Mangulosi', photo: 'tortor', fact: fact('tradition', 'Draping a ulos on someone conveys blessing and affection. Who may give which cloth to whom follows kinship relationships.', 'ulosStudy', 'ulosEncyclopedia') },
      { title: 'Many cloths', photo: 'ulos-museum', fact: fact('tradition', 'Ragidup, ragihotang and sibolang are among the named types. Accounts of their use vary by place and ceremony.', 'ulosStudy') },
    ],
  },
  {
    id: 'sound', title: 'Drums that gather people', kicker: 'Music and ceremony', kind: 'tradition',
    intro: 'Two drum traditions that are often confused but are distinct.',
    chapters: [
      { title: 'Gondang sabangunan', photo: 'gondang', fact: fact('tradition', 'The Toba ensemble combines tuned taganing drums, a large gordang drum, gongs called ogung, a reed instrument called sarune bolon, and a timekeeping idiophone, hesek. Exact numbers differ.', 'gondangRitual', 'taganing') },
      { title: 'Music and movement', photo: 'tortor', fact: fact('tradition', 'In customary settings, gondang and tortor are closely bound together.', 'gondangRitual') },
      { title: 'Gordang Sambilan', photo: 'gordang-sambilan', fact: fact('tradition', 'The Mandailing Gordang Sambilan is a separate tradition built around nine graded drums.', 'gordang') },
    ],
  },
  {
    id: 'nias', title: 'Stone and timber on Nias', kicker: 'Nias heritage', kind: 'history',
    intro: 'An island heritage with its own language and history.',
    chapters: [
      { title: 'A planned settlement', photo: 'nias-house', fact: fact('history', 'At Bawomataluo, monumental stonework and houses form one designed settlement.', 'unescoBawomataluo') },
      { title: 'Built to move', photo: 'nias-house', fact: fact('history', 'Traditional timber houses largely came through the 2004 and 2005 earthquakes well, although some were damaged.', 'niasQuake') },
      { title: 'The leap', photo: 'nias-hombo', fact: fact('history', 'Stone jumping is connected in accounts to past warfare training, and is now a cultural symbol and demonstration.', 'hombo') },
      { title: 'Living arts', photo: 'nias-dance', fact: fact('contemporary', 'Dance, maena and other performing arts are the subject of current preservation efforts in South Nias.', 'niasMinistry') },
    ],
  },
];
