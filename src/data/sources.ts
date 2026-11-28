import { LANDMARK_SOURCES } from './landmark-sources';

export interface Source {
  title: string;
  publisher: string;
  url: string;
  type: 'Lembaga warisan budaya' | 'Akademik' | 'Pemerintah / media publik' | 'Ensiklopedia' | 'Pers';
}

/**
 * Starting points for verification. They were located through web search and reviewed as summaries and
 * excerpts, not as full texts. A subject specialist should check each claim before formal teaching use.
 */
export const SOURCES = {
  ...LANDMARK_SOURCES,
  unescoBawomataluo: { title: 'Bawomataluo Site (Tentative List, ref. 5463)', publisher: 'UNESCO World Heritage Centre', url: 'https://whc.unesco.org/en/tentativelists/5463', type: 'Lembaga warisan budaya' },
  unescoUlosProject: { title: 'Young professionals in Toba lead post-pandemic recovery: Ulos weavers and Gorga sculptors', publisher: 'UNESCO Intangible Cultural Heritage', url: 'https://ich.unesco.org/es/noticias/los-jvenes-profesionales-de-toba-indonesia-lideran-la-recuperacin-tras-la-pandemia-13404?newsID=13404', type: 'Lembaga warisan budaya' },
  nasaToba: { title: 'Toba Caldera', publisher: 'NASA Earth Observatory', url: 'https://earthobservatory.nasa.gov/images/7380/toba-caldera', type: 'Lembaga warisan budaya' },
  britannicaToba: { title: 'Mount Toba', publisher: 'Encyclopaedia Britannica', url: 'https://www.britannica.com/place/Mount-Toba', type: 'Ensiklopedia' },
  legendDetik: { title: '2 versi cerita asal usul Danau Toba', publisher: 'detikSumut', url: 'https://www.detik.com/sumut/wisata/d-6761917/2-versi-cerita-asal-usul-danau-toba', type: 'Pers' },
  legendGnfi: { title: 'Legenda Putri Ikan dari Sumatra Utara', publisher: 'Good News From Indonesia', url: 'https://www.goodnewsfromindonesia.id/2024/10/25/legenda-putri-ikan-dari-sumatra-utara-yang-dipercaya-menjadi-asal-usul-danau-toba', type: 'Pers' },
  tobaHouseForm: { title: 'Form and Meaning of Batak Toba House (Sitindjak & Wardani)', publisher: 'Atlantis Press', url: 'https://www.atlantis-press.com/article/25906963.pdf', type: 'Akademik' },
  batakArchitecture: { title: 'Batak architecture', publisher: 'Wikipedia (periksa rujukannya)', url: 'https://en.wikipedia.org/wiki/Rumah_Batak', type: 'Ensiklopedia' },
  gondangRitual: { title: 'Gondang function at the Patarias Debata Mulajadi Nabolon ritual ceremony', publisher: 'Gondang: Jurnal Seni dan Budaya, Unimed', url: 'https://jurnal.unimed.ac.id/2012/index.php/GDG/article/view/76555', type: 'Akademik' },
  taganing: { title: 'Analisis taganing dalam tradisi musik gondang sabangunan Batak Toba', publisher: 'Saraswati, ISI Yogyakarta', url: 'https://journal.isi.ac.id/index.php/saraswati/article/view/297', type: 'Akademik' },
  ulosStudy: { title: 'Study of ulos types and their use in Batak Toba ceremony', publisher: 'JOM FISIP, Universitas Riau', url: 'https://jom.unri.ac.id/index.php/JOMFSIP/article/download/26787/25895', type: 'Akademik' },
  ulosEncyclopedia: { title: 'Ulos', publisher: 'Wikipedia (periksa rujukannya)', url: 'https://en.wikipedia.org/wiki/Ulos', type: 'Ensiklopedia' },
  karoSpace: { title: 'Studi tata ruang rumah adat "Siwaluh Jabu" Desa Lingga (E. A. Halim, 2020)', publisher: 'Dimensi, Universitas Trisakti', url: 'https://e-journal.trisakti.ac.id/index.php/dimensi/article/view/7057', type: 'Akademik' },
  karoHeritage: { title: 'Rumah adat Siwaluh Jabu Desa Budaya Lingga sebagai warisan budaya', publisher: 'JPDSH', url: 'https://bajangjournal.com/index.php/JPDSH/article/view/6211', type: 'Akademik' },
  mandailingBuildings: { title: 'Bentuk dan fungsi rumah adat Raja Pamusuk Mandailing (Kholilah, Minawati & Zulhelman)', publisher: 'Bercadik, ISI Padangpanjang', url: 'https://journal.isi-padangpanjang.ac.id/index.php/Bercadik/article/download/44/32', type: 'Akademik' },
  dalihanCore: { title: 'Dalihan Na Tolu in Angkola-Mandailing ceremony', publisher: 'CORE repository', url: 'https://core.ac.uk/download/304207208.pdf', type: 'Akademik' },
  gordang: { title: 'Gordang sambilan', publisher: 'Wikipedia (periksa rujukannya)', url: 'https://en.wikipedia.org/wiki/Gordang_sambilan', type: 'Ensiklopedia' },
  pakpakSuak: { title: 'Peran kepemimpinan HIMPAK dalam mempertahankan jati diri Silima Suak (Ujung et al., 2025)', publisher: 'BEST Journal, Universitas Islam Sumatera Utara', url: 'https://jurnal.uisu.ac.id/index.php/best/article/download/13232/8667', type: 'Akademik' },
  pakpakHistory: { title: 'Article on Pakpak customary territory and its administrative division', publisher: 'Jurnal Masyarakat Indonesia, LIPI', url: 'https://jmi.ipsk.lipi.go.id/index.php/jmiipsk/article/download/609/400', type: 'Akademik' },
  simalungunAdat: { title: 'Analisis proses dan nilai hata-hata mambere podah dalam perkawinan adat Simalungun (Sumbayak et al., 2019)', publisher: 'Bahastra, UISU', url: 'https://jurnal.uisu.ac.id/index.php/Bahastra/article/download/1720/1305', type: 'Akademik' },
  uisKaro: { title: 'Pakaian uis nipes dan beka buluh dalam tradisi masyarakat Batak Karo (Sembiring et al., 2025)', publisher: 'Historis, Universitas Muhammadiyah Mataram', url: 'https://journal.ummat.ac.id/index.php/historis/article/download/%2336745/pdf', type: 'Akademik' },
  sigalegale: { title: 'Sigalegale', publisher: 'Wikipedia (periksa rujukannya)', url: 'https://en.wikipedia.org/wiki/Sigalegale', type: 'Ensiklopedia' },
  medanWiki: { title: 'Medan', publisher: 'Wikipedia (periksa rujukannya)', url: 'https://en.wikipedia.org/wiki/Medan', type: 'Ensiklopedia' },
  simalungunOrnament: { title: 'Bolon House Pematang Purba Ornament: Semiotic Study', publisher: 'SciTePress', url: 'https://www.scitepress.org/publishedPapers/2018/99004/pdf/index.html', type: 'Akademik' },
  niasQuake: { title: 'Earthquake resilience of traditional Nias Island houses: lessons from 2004 and 2005', publisher: 'IIETA', url: 'https://iieta.org/node/16371', type: 'Akademik' },
  omoSebua: { title: 'Omo sebua', publisher: 'Wikipedia (periksa rujukannya)', url: 'https://en.wikipedia.org/wiki/Omo_sebua', type: 'Ensiklopedia' },
  hombo: { title: 'Makna di balik tradisi Lompat Batu Nias', publisher: 'detikSumut', url: 'https://www.detik.com/sumut/budaya/d-8759266/makna-di-balik-tradisi-lompat-batu-nias', type: 'Pers' },
  niasMaena: { title: 'Cultural values of maena in the Falöwa wedding ceremony', publisher: 'Anthropos, Unimed', url: 'https://jurnal.unimed.ac.id/2012/index.php/antrophos/article/view/24772/16427', type: 'Akademik' },
  niasMinistry: { title: 'Menteri Kebudayaan ajak semua pihak lestarikan budaya Nias Selatan', publisher: 'RRI (public broadcaster)', url: 'https://rri.co.id/nias-selatan/nasional/2606955/menteri-kebudayaan-ajak-semua-pihak-bersinergi-lestarikan-budaya-nias-selatan', type: 'Pemerintah / media publik' },
  maimun: { title: 'Istana Maimun', publisher: 'Wonderful Indonesia (national tourism portal)', url: 'https://www.indonesia.travel/gb/en/destination/sumatra/north-sumatra/istana-maimun', type: 'Pemerintah / media publik' },
  medanSites: { title: 'Five sites to visit on your trip to Medan', publisher: 'The Jakarta Post', url: 'https://www.thejakartapost.com/travel/2018/08/29/five-sites-to-visit-on-your-trip-to-medan', type: 'Pers' },
  arsik: { title: 'Arsik', publisher: 'Wikipedia (periksa rujukannya)', url: 'https://en.wikipedia.org/wiki/Arsik', type: 'Ensiklopedia' },
  andaliman: { title: 'Andaliman, the Batak pepper culinary legacy of North Sumatra', publisher: 'RRI (public broadcaster)', url: 'https://rri.co.id/en/culinary/1515662/andaliman-the-batak-pepper-culinary-legacy-of-north-sumatra', type: 'Pemerintah / media publik' },
} satisfies Record<string, Source>;

export type SourceId = keyof typeof SOURCES;

/**
 * How far each source was checked while building the site.
 * read: the page or full text was opened and used. partial: opened, but it supports only part of what is
 * cited, or only an abstract was available. unopened: the page could not be loaded.
 * Anything not listed was seen only as a web-search summary.
 */
export type Check = 'read' | 'partial' | 'unopened' | 'summary';

const CHECKED: Partial<Record<SourceId, Check>> = {
  unescoUlosProject: 'read', niasQuake: 'read', karoSpace: 'read', simalungunAdat: 'read', mandailingBuildings: 'read',
  pakpakSuak: 'read', uisKaro: 'read', gordang: 'read', omoSebua: 'read', batakArchitecture: 'read',
  binjaiCagar: 'read', binjaiStasiun: 'read', tanggaDetik: 'read', tanggaGnfi: 'read', ponotWiki: 'read', bilahSejarah: 'read',
  salibKasihWiki: 'read', ulosTaput: 'read', asahanSungai: 'read', asahanJeram: 'read', ahmadsyah: 'read', putriHijau: 'read', limaLaras: 'read', salibKasih: 'read',
  taganing: 'partial', sigalegale: 'partial', medanWiki: 'partial',
  unescoBawomataluo: 'unopened', britannicaToba: 'unopened', gondangRitual: 'unopened', dalihanCore: 'unopened',
};

export const checkOf = (id: SourceId): Check => CHECKED[id] ?? 'summary';

export const CHECK_LABEL: Record<Check, string> = {
  read: 'sudah dibuka dan dicek',
  partial: 'dicek sebagian',
  unopened: 'gagal dibuka',
  summary: 'hanya ringkasan pencarian',
};
