import type { PhotoId } from './photos';
import type { SourceId } from './sources';

export const THEMES = ['Houses', 'Clothing and textiles', 'Dance', 'Music', 'Ceremony', 'Culinary', 'Art and craft'] as const;
export type Theme = (typeof THEMES)[number];

export interface GalleryItem {
  id: PhotoId;
  title: string;
  theme: Theme;
  origin: string;
  context: string;
  learn: string;
  related: PhotoId[];
  sources: SourceId[];
}

export const GALLERY: GalleryItem[] = [
  { id: 'gorga-house', title: 'Gorga on a Toba house', theme: 'Art and craft', origin: 'Batak Toba, Samosir', context: 'Carved and painted ornament on a house front.', learn: 'Look for repeated flowing lines and the red, white and black palette. Meanings of individual motifs should be checked against local knowledge.', related: ['simalungun-house', 'mandailing-house'], sources: ['unescoUlosProject'] },
  { id: 'karo-house', title: 'Siwaluh jabu', theme: 'Houses', origin: 'Karo, Lingga', context: 'A large house shared by several household units.', learn: 'The architecture was also a social map: custom set where each household lived. A 2020 study found that this placement is no longer practised in Lingga.', related: ['gorga-house', 'nias-house'], sources: ['karoSpace'] },
  { id: 'mandailing-house', title: 'Bagas Godang', theme: 'Houses', origin: 'Mandailing, Huta Godang', context: 'The house of a traditional ruler within a village setting.', learn: 'Read it together with the Sopo Godang hall and the open yard: they work as a civic ensemble.', related: ['gordang-sambilan', 'simalungun-house'], sources: ['mandailingBuildings'] },
  { id: 'simalungun-house', title: 'Rumah Bolon at Pematang Purba', theme: 'Houses', origin: 'Simalungun', context: 'Part of a former ruling house’s complex.', learn: '“Rumah Bolon” is used by more than one community. This Simalungun building differs from Toba examples.', related: ['gorga-house', 'karo-house'], sources: ['simalungunOrnament'] },
  { id: 'nias-house', title: 'A house in Bawomataluo', theme: 'Houses', origin: 'South Nias', context: 'Timber architecture in a settlement known for monumental stonework.', learn: 'Observe the height of the roof and the relationship between house and stone-paved space.', related: ['nias-hombo', 'nias-dance'], sources: ['unescoBawomataluo', 'niasQuake'] },
  { id: 'ulos-weaving', title: 'Weaving ulos', theme: 'Clothing and textiles', origin: 'Batak weaving tradition', context: 'Cloth takes shape thread by thread on a traditional loom.', learn: 'The value of ulos joins skilled labour with the relationships in which a cloth is later given.', related: ['ulos-museum', 'tortor'], sources: ['unescoUlosProject'] },
  { id: 'ulos-museum', title: 'A museum ulos', theme: 'Clothing and textiles', origin: 'Batak, northern Sumatra (20th century)', context: 'A ceremonial cloth held in the Honolulu Museum of Art.', learn: 'A museum preserves the object, while its ceremonial meaning lives in communities.', related: ['ulos-weaving'], sources: ['ulosEncyclopedia'] },
  { id: 'karo-wedding', title: 'Karo wedding dress', theme: 'Clothing and textiles', origin: 'Karo', context: 'A couple in ceremonial dress at their wedding.', learn: 'Compare the headdresses and layered textiles with dress from other communities rather than treating them as one style.', related: ['angkola-tortor', 'ulos-weaving'], sources: ['uisKaro'] },
  { id: 'tortor', title: 'Tortor', theme: 'Dance', origin: 'Batak tradition', context: 'A group of dancers performs tortor.', learn: 'Tortor in ceremony is relational: it is danced with music and with other people, not only for an audience.', related: ['gondang', 'angkola-tortor'], sources: ['gondangRitual'] },
  { id: 'angkola-tortor', title: 'Tortor at a wedding', theme: 'Ceremony', origin: 'Southern Tapanuli', context: 'The bridal couple dance during a customary wedding. The photographer describes it as part of the largest customary celebration in the southern Tapanuli area.', learn: 'Ceremony brings kinship roles, dress, music and movement together.', related: ['tortor', 'mandailing-house'], sources: ['dalihanCore'] },
  { id: 'nias-dance', title: 'War dance in Bawomataluo', theme: 'Dance', origin: 'South Nias', context: 'Performers in costume with shields.', learn: 'Today the dance is performed as cultural expression. Its martial imagery belongs to history and should not be used to characterise people now.', related: ['nias-hombo', 'nias-house'], sources: ['niasMinistry'] },
  { id: 'nias-hombo', title: 'Hombo batu', theme: 'Ceremony', origin: 'South Nias', context: 'A jumper clears a tall stone structure.', learn: 'A practice can change purpose over time while remaining a marker of identity.', related: ['nias-dance', 'nias-house'], sources: ['hombo'] },
  { id: 'gondang', title: 'Gondang sabangunan instruments', theme: 'Music', origin: 'Batak Toba', context: 'Instruments displayed at the National Museum of Ethnology, Osaka.', learn: 'Identify the families of sound: tuned drums, gongs and reed.', related: ['tortor', 'gordang-sambilan'], sources: ['taganing', 'gondangRitual'] },
  { id: 'gordang-sambilan', title: 'Gordang Sambilan', theme: 'Music', origin: 'Mandailing', context: 'Nine drums of graded size.', learn: 'Distinct from Toba gondang sabangunan despite the related word for drum.', related: ['gondang', 'mandailing-house'], sources: ['gordang'] },
  { id: 'arsik', title: 'Arsik', theme: 'Culinary', origin: 'Batak cooking traditions', context: 'Spiced fish cooked until the seasoning is absorbed.', learn: 'Recipes differ: some feature andaliman, while Karo versions are described as using torch ginger.', related: ['ulos-weaving'], sources: ['arsik', 'andaliman'] },
  { id: 'maimun', title: 'Istana Maimun', theme: 'Houses', origin: 'Malay Deli, Medan', context: 'A palace of the Sultanate of Deli, open to visitors.', learn: 'Medan’s heritage includes Malay court culture alongside many other communities.', related: ['tjong-a-fie'], sources: ['maimun'] },
  { id: 'tjong-a-fie', title: 'Tjong A Fie Mansion', theme: 'Houses', origin: 'Chinese Indonesian heritage, Medan', context: 'A merchant’s residence turned museum.', learn: 'Its mixed architectural language reflects the plural history of the city.', related: ['maimun'], sources: ['medanSites'] },
];
