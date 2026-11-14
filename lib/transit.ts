import { calculateDistanceMeters } from './scoring';
import { Place } from './types';

export type TransitLineType = 'western' | 'central' | 'harbour' | 'metro_1' | 'metro_2a' | 'metro_7' | 'metro_3' | 'metro_navi';

export interface TransitLineFilterChip {
  id: TransitLineType;
  code: string;
  name: string;
  color: string;
  sliderAccent: string;
  isMetro: boolean;
}

export const TRANSIT_FILTER_CHIPS: TransitLineFilterChip[] = [
  { id: 'western', code: 'WR', name: 'Western Railway', color: '#be123c', sliderAccent: 'bg-rose-700', isMetro: false },
  { id: 'central', code: 'CR', name: 'Central Main', color: '#d97706', sliderAccent: 'bg-amber-600', isMetro: false },
  { id: 'harbour', code: 'HR', name: 'Harbour Line', color: '#2563eb', sliderAccent: 'bg-blue-600', isMetro: false },
  { id: 'metro_1', code: 'M1', name: 'Metro 1 Blue', color: '#0284c7', sliderAccent: 'bg-sky-600', isMetro: true },
  { id: 'metro_2a', code: 'M2A', name: 'Metro 2A Yellow', color: '#ca8a04', sliderAccent: 'bg-yellow-600', isMetro: true },
  { id: 'metro_7', code: 'M7', name: 'Metro 7 Red', color: '#dc2626', sliderAccent: 'bg-red-600', isMetro: true },
  { id: 'metro_3', code: 'M3', name: 'Aqua Line 3', color: '#0d9488', sliderAccent: 'bg-teal-600', isMetro: true },
  { id: 'metro_navi', code: 'NMM', name: 'Navi Mumbai', color: '#ea580c', sliderAccent: 'bg-orange-600', isMetro: true },
];

export interface TransitStation {
  id: string;
  name: string;
  hindi_name: string;
  marathi_name: string;
  lines: TransitLineType[];
  latitude: number;
  longitude: number;
  zone: 'South Mumbai' | 'Western Suburbs' | 'Central Suburbs' | 'Navi Mumbai' | 'Thane / Beyond';
  fast_train_stop?: boolean;
  operational_status?: 'operational' | 'under_construction';
  exit_tips: string;
  auto_rickshaw_available: boolean; // Autos operate north of Bandra / Sion
}

export const TRANSIT_STATIONS: TransitStation[] = [
  // Western Railway (WR)
  {
    id: 'stn-churchgate',
    name: 'Churchgate',
    hindi_name: 'चर्चगेट',
    marathi_name: 'चर्चगेट',
    lines: ['western'],
    latitude: 18.9322,
    longitude: 72.8264,
    zone: 'South Mumbai',
    fast_train_stop: true,
    exit_tips: 'East exit towards Oval Maidan / Fort. West exit towards Marine Drive & Wankhede.',
    auto_rickshaw_available: false,
  },
  {
    id: 'stn-marine-lines',
    name: 'Marine Lines',
    hindi_name: 'मरीन लाइन्स',
    marathi_name: 'मरीन लाइन्स',
    lines: ['western'],
    latitude: 18.9436,
    longitude: 72.8236,
    zone: 'South Mumbai',
    fast_train_stop: false,
    exit_tips: 'Flyover skywalk directly connects to Marine Drive promenade and Chandanwadi.',
    auto_rickshaw_available: false,
  },
  {
    id: 'stn-charni-road',
    name: 'Charni Road',
    hindi_name: 'चर्नी रोड',
    marathi_name: 'चर्नी रोड',
    lines: ['western'],
    latitude: 18.9519,
    longitude: 72.8189,
    zone: 'South Mumbai',
    fast_train_stop: false,
    exit_tips: 'West exit onto Girgaon Chowpatty beach. East exit leads to Khotachiwadi & Opera House.',
    auto_rickshaw_available: false,
  },
  {
    id: 'stn-grant-road',
    name: 'Grant Road',
    hindi_name: 'ग्रांट रोड',
    marathi_name: 'ग्रँट रोड',
    lines: ['western'],
    latitude: 18.9632,
    longitude: 72.8158,
    zone: 'South Mumbai',
    fast_train_stop: true,
    exit_tips: 'East exit towards Lamington Road electronics market. West exit towards Nana Chowk.',
    auto_rickshaw_available: false,
  },
  {
    id: 'stn-mumbai-central',
    name: 'Mumbai Central',
    hindi_name: 'मुंबई सेंट्रल',
    marathi_name: 'मुंबई सेंट्रल',
    lines: ['western'],
    latitude: 18.9696,
    longitude: 72.8193,
    zone: 'South Mumbai',
    fast_train_stop: true,
    exit_tips: 'Major intercity terminal with AC skywalk connecting local and outstation platforms.',
    auto_rickshaw_available: false,
  },
  {
    id: 'stn-mahalaxmi',
    name: 'Mahalaxmi',
    hindi_name: 'महालक्ष्मी',
    marathi_name: 'महालक्ष्मी',
    lines: ['western'],
    latitude: 18.9828,
    longitude: 72.8242,
    zone: 'South Mumbai',
    fast_train_stop: false,
    exit_tips: 'Exit bridge overlooks the historic Dhobi Ghat open-air laundry and Mahalaxmi Racecourse.',
    auto_rickshaw_available: false,
  },
  {
    id: 'stn-lower-parel',
    name: 'Lower Parel',
    hindi_name: 'लोअर परेल',
    marathi_name: 'लोअर परळ',
    lines: ['western'],
    latitude: 18.9953,
    longitude: 72.8306,
    zone: 'South Mumbai',
    fast_train_stop: false,
    exit_tips: 'West exit leads into Phoenix Palladium & mill compounds. East connects to Currey Road (CR).',
    auto_rickshaw_available: false,
  },
  {
    id: 'stn-dadar-wr',
    name: 'Dadar (Western)',
    hindi_name: 'दादर (पश्चिम)',
    marathi_name: 'दादर (पश्चिम)',
    lines: ['western'],
    latitude: 19.0178,
    longitude: 72.8426,
    zone: 'South Mumbai',
    fast_train_stop: true,
    exit_tips: 'Major railway junction. West exit opens into flower bazaar & Shivaji Park route.',
    auto_rickshaw_available: false,
  },
  {
    id: 'stn-bandra',
    name: 'Bandra',
    hindi_name: 'बांद्रा',
    marathi_name: 'वांद्रे',
    lines: ['western', 'harbour'],
    latitude: 19.0553,
    longitude: 72.8402,
    zone: 'Western Suburbs',
    fast_train_stop: true,
    exit_tips: 'West exit skywalk leads to Lucky Restaurant, Hill Road & Bandstand. Autos operate on meter here!',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-khar-road',
    name: 'Khar Road',
    hindi_name: 'खार रोड',
    marathi_name: 'खार रोड',
    lines: ['western', 'harbour'],
    latitude: 19.0697,
    longitude: 72.8394,
    zone: 'Western Suburbs',
    fast_train_stop: false,
    exit_tips: 'West exit into 1st Road Khar & Union Park cafes. Quiet suburban vibe.',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-santacruz',
    name: 'Santacruz',
    hindi_name: 'सांताक्रूज़',
    marathi_name: 'सांताक्रूझ',
    lines: ['western', 'harbour'],
    latitude: 19.0817,
    longitude: 72.8413,
    zone: 'Western Suburbs',
    fast_train_stop: false,
    exit_tips: 'East exit towards Western Express Highway. West exit opens into bustling shopping bazaar.',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-vile-parle',
    name: 'Vile Parle',
    hindi_name: 'विले पार्ले',
    marathi_name: 'विलेपार्ले',
    lines: ['western', 'harbour'],
    latitude: 19.0988,
    longitude: 72.8439,
    zone: 'Western Suburbs',
    fast_train_stop: false,
    exit_tips: 'West exit towards Mithibai & NMIMS college hub. East exit leads towards historic Parle village.',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-andheri',
    name: 'Andheri',
    hindi_name: 'अंधेरी',
    marathi_name: 'अंधेरी',
    lines: ['western', 'harbour', 'metro_1'],
    latitude: 19.1197,
    longitude: 72.8464,
    zone: 'Western Suburbs',
    fast_train_stop: true,
    exit_tips: 'Direct seamless elevated interchange with Metro Line 1 (Versova-Ghatkopar) on the east side.',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-jogeshwari',
    name: 'Jogeshwari',
    hindi_name: 'जोगेश्वरी',
    marathi_name: 'जोगेश्वरी',
    lines: ['western', 'harbour'],
    latitude: 19.1353,
    longitude: 72.8492,
    zone: 'Western Suburbs',
    fast_train_stop: false,
    exit_tips: 'East exit gives quick access to Jogeshwari Caves (6th century rock-cut shrine).',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-goregaon',
    name: 'Goregaon',
    hindi_name: 'गोरेगांव',
    marathi_name: 'गोरेगाव',
    lines: ['western', 'harbour'],
    latitude: 19.1554,
    longitude: 72.8492,
    zone: 'Western Suburbs',
    fast_train_stop: true,
    exit_tips: 'East exit towards Aarey Colony & Film City. West exit towards Link Road hubs.',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-malad',
    name: 'Malad',
    hindi_name: 'मलाड',
    marathi_name: 'मालाड',
    lines: ['western'],
    latitude: 19.1868,
    longitude: 72.8488,
    zone: 'Western Suburbs',
    fast_train_stop: true,
    exit_tips: 'West exit for Marve Beach, Aksa Beach & Madh Island ferries via Marve Road.',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-kandivali',
    name: 'Kandivali',
    hindi_name: 'कांदिवली',
    marathi_name: 'कांदिवली',
    lines: ['western'],
    latitude: 19.2045,
    longitude: 72.8519,
    zone: 'Western Suburbs',
    fast_train_stop: false,
    exit_tips: 'West exit towards Mahavir Nagar food street. East connects to Thakur Village.',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-borivali',
    name: 'Borivali',
    hindi_name: 'बोरीवली',
    marathi_name: 'बोरिवली',
    lines: ['western'],
    latitude: 19.2291,
    longitude: 72.8569,
    zone: 'Western Suburbs',
    fast_train_stop: true,
    exit_tips: 'East exit is 800m from Sanjay Gandhi National Park & Kanheri Caves gate. West exit for Gorai ferry.',
    auto_rickshaw_available: true,
  },

  // Central Railway Main Line (CR)
  {
    id: 'stn-csmt',
    name: 'CSMT (Chhatrapati Shivaji Maharaj Terminus)',
    hindi_name: 'सीएसएमटी',
    marathi_name: 'सीएसएमटी',
    lines: ['central', 'harbour'],
    latitude: 18.9401,
    longitude: 72.8358,
    zone: 'South Mumbai',
    fast_train_stop: true,
    exit_tips: 'UNESCO World Heritage Gothic marvel. Platform 1-7 for local trains. Subway connects to Fort.',
    auto_rickshaw_available: false,
  },
  {
    id: 'stn-byculla',
    name: 'Byculla',
    hindi_name: 'भायखला',
    marathi_name: 'भायखळा',
    lines: ['central'],
    latitude: 18.9768,
    longitude: 72.8331,
    zone: 'South Mumbai',
    fast_train_stop: true,
    exit_tips: 'Heritage-restored station. East exit opens directly to Dr. Bhau Daji Lad Museum & Rani Bagh.',
    auto_rickshaw_available: false,
  },
  {
    id: 'stn-dadar-cr',
    name: 'Dadar (Central)',
    hindi_name: 'दादर (मध्य)',
    marathi_name: 'दादर (मध्य)',
    lines: ['central'],
    latitude: 19.0185,
    longitude: 72.8436,
    zone: 'South Mumbai',
    fast_train_stop: true,
    exit_tips: 'East exit leads to Hindu Colony and Five Gardens Matunga. Cross-over bridge to WR.',
    auto_rickshaw_available: false,
  },
  {
    id: 'stn-matunga-cr',
    name: 'Matunga (Central)',
    hindi_name: 'माटुंगा',
    marathi_name: 'माटुंगा',
    lines: ['central'],
    latitude: 19.0272,
    longitude: 72.8558,
    zone: 'South Mumbai',
    fast_train_stop: false,
    exit_tips: 'India\'s first all-women operated station. Steps from iconic South Indian filter coffee & dosa joints.',
    auto_rickshaw_available: false,
  },
  {
    id: 'stn-kurla',
    name: 'Kurla',
    hindi_name: 'कुर्ला',
    marathi_name: 'कुर्ला',
    lines: ['central', 'harbour'],
    latitude: 19.0657,
    longitude: 72.8794,
    zone: 'Central Suburbs',
    fast_train_stop: true,
    exit_tips: 'West exit leads to BKC (Bandra-Kurla Complex) via auto/bus. Major interchange junction.',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-ghatkopar',
    name: 'Ghatkopar',
    hindi_name: 'घाटकोपर',
    marathi_name: 'घाटकोपर',
    lines: ['central', 'metro_1'],
    latitude: 19.0864,
    longitude: 72.9081,
    zone: 'Central Suburbs',
    fast_train_stop: true,
    exit_tips: 'Direct skywalk interchange to Metro Line 1. West exit opens into Khau Galli street food.',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-thane',
    name: 'Thane',
    hindi_name: 'ठाणे',
    marathi_name: 'ठाणे',
    lines: ['central', 'harbour'],
    latitude: 19.186,
    longitude: 72.9754,
    zone: 'Thane / Beyond',
    fast_train_stop: true,
    exit_tips: 'Historic termination point of India\'s first train (1853). Gateway to Yeoor Hills & Upvan Lake.',
    auto_rickshaw_available: true,
  },

  // ─────────────────────────────────────────────────────────────
  // 1. Metro Line 1 (Blue Line: Versova ⇄ Andheri ⇄ Ghatkopar - 12 Stations)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'metro1-versova',
    name: 'Versova',
    hindi_name: 'वर्सोवा',
    marathi_name: 'वर्सोवा',
    lines: ['metro_1'],
    latitude: 19.1311,
    longitude: 72.8183,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Western terminus on J.P. Road. 10 min walk to Versova Beach, Koliwada village & coastal rock cafes.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro1-dn-nagar',
    name: 'D.N. Nagar (Line 1 & 2A Hub)',
    hindi_name: 'डी.एन. नगर',
    marathi_name: 'डी.एन. नगर',
    lines: ['metro_1', 'metro_2a'],
    latitude: 19.1306,
    longitude: 72.8322,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Major elevated interchange concourse with Metro Line 2A (Yellow Line to Dahisar West via Link Road).',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro1-azad-nagar',
    name: 'Azad Nagar',
    hindi_name: 'आज़ाद नगर',
    marathi_name: 'आझाद नगर',
    lines: ['metro_1'],
    latitude: 19.1287,
    longitude: 72.8364,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Steps from Veera Desai Road, Bhavans College campus nature lake & local rock pubs.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro1-andheri',
    name: 'Andheri (WR Interchange)',
    hindi_name: 'अंधेरी',
    marathi_name: 'अंधेरी',
    lines: ['metro_1', 'western'],
    latitude: 19.1197,
    longitude: 72.8464,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Direct elevated skywalk connection into Andheri Western Railway suburban platforms.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro1-weh',
    name: 'Western Express Highway (WEH)',
    hindi_name: 'पश्चिम द्रुतगती महामार्ग',
    marathi_name: 'पश्चिम द्रुतगती महामार्ग',
    lines: ['metro_1', 'metro_7'],
    latitude: 19.1172,
    longitude: 72.8552,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Direct enclosed foot overbridge & skywalk connection to Gundavali terminus of Metro Line 7 (Red Line).',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro1-chakala',
    name: 'Chakala (J.B. Nagar)',
    hindi_name: 'चकाला (जे.बी. नगर)',
    marathi_name: 'चकाला (जे.बी. नगर)',
    lines: ['metro_1'],
    latitude: 19.1118,
    longitude: 72.8655,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Heart of Andheri East commercial district, Solitaire Corporate Park & multi-cuisine addas.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro1-airport-road',
    name: 'Airport Road',
    hindi_name: 'एयरपोर्ट रोड',
    marathi_name: 'विमानतळ रोड',
    lines: ['metro_1'],
    latitude: 19.1105,
    longitude: 72.8745,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: '5 min auto to international hotel row, Marol industrial addas, and boutique bakeries.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro1-marol-naka',
    name: 'Marol Naka (Line 1 & 3 Hub)',
    hindi_name: 'मरोल नाका',
    marathi_name: 'मरोळ नाका',
    lines: ['metro_1', 'metro_3'],
    latitude: 19.1085,
    longitude: 72.8808,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Bi-level transfer hub: seamless escalators connecting elevated Line 1 to underground Aqua Line 3.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro1-saki-naka',
    name: 'Saki Naka',
    hindi_name: 'साकी नाका',
    marathi_name: 'साकी नाका',
    lines: ['metro_1'],
    latitude: 19.1055,
    longitude: 72.8875,
    zone: 'Central Suburbs',
    operational_status: 'operational',
    exit_tips: 'Bustling junction connecting Andheri East, Powai Lake, Chandivali & Kurla.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro1-asalpha',
    name: 'Asalpha',
    hindi_name: 'असलफा',
    marathi_name: 'असाल्फा',
    lines: ['metro_1'],
    latitude: 19.0988,
    longitude: 72.8965,
    zone: 'Central Suburbs',
    operational_status: 'operational',
    exit_tips: 'Known as "Mumbai\'s Positano" with colorful hillside village staircases and street art.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro1-jagruti-nagar',
    name: 'Jagruti Nagar',
    hindi_name: 'जागृती नगर',
    marathi_name: 'जागृती नगर',
    lines: ['metro_1'],
    latitude: 19.0925,
    longitude: 72.9025,
    zone: 'Central Suburbs',
    operational_status: 'operational',
    exit_tips: 'Elevated station with panoramic hillside views; quick rickshaw to Pant Nagar & Ghatkopar West.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro1-ghatkopar',
    name: 'Ghatkopar (Line 1 & CR Hub)',
    hindi_name: 'घाटकोपर',
    marathi_name: 'घाटकोपर',
    lines: ['metro_1', 'central'],
    latitude: 19.0864,
    longitude: 72.9081,
    zone: 'Central Suburbs',
    operational_status: 'operational',
    exit_tips: 'Eastern terminal. Massive skywalk directly connecting to Central Railway suburban platforms & Khau Galli.',
    auto_rickshaw_available: true,
  },

  // ─────────────────────────────────────────────────────────────
  // 2. Metro Line 2A (Yellow Line: Dahisar East ⇄ Link Road ⇄ Andheri West - 17 Stations)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'metro2a-dahisar-east',
    name: 'Dahisar East (Line 2A & 7 Hub)',
    hindi_name: 'दहिसर पूर्व',
    marathi_name: 'दहिसर पूर्व',
    lines: ['metro_2a', 'metro_7'],
    latitude: 19.2517,
    longitude: 72.8673,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Northern mega-interchange linking Link Road (Line 2A) with Western Express Highway (Line 7).',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-upper-dahisar',
    name: 'Anand Nagar (formerly Upper Dahisar)',
    hindi_name: 'आनंद नगर (अपर दहिसर)',
    marathi_name: 'आनंद नगर (अप्पर दहिसर)',
    lines: ['metro_2a'],
    latitude: 19.2572,
    longitude: 72.8651,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Western Dahisar residential addas, local snacks, and Anand Nagar market.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-kandarpada',
    name: 'Kandarpada',
    hindi_name: 'कंदरपाड़ा',
    marathi_name: 'कंदरपाडा',
    lines: ['metro_2a'],
    latitude: 19.2566,
    longitude: 72.8507,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Access to Dahisar creek mangroves, coastal salt flats, and cycling lanes.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-mandapeshwar',
    name: 'Mandapeshwar - I.C. Colony',
    hindi_name: 'मंडपेश्वर - आई.सी. कॉलोनी',
    marathi_name: 'मंडपेश्वर - आय.सी. कॉलनी',
    lines: ['metro_2a'],
    latitude: 19.2496,
    longitude: 72.8458,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Direct 2-min walk to 1500-year-old rock-cut Mandapeshwar Caves, IC Colony Goan bakeries & cafes.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-eksar',
    name: 'Eksar',
    hindi_name: 'एकसर',
    marathi_name: 'एकसर',
    lines: ['metro_2a'],
    latitude: 19.2404,
    longitude: 72.8435,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Direct access to ancient 11th-century Shilahara naval battle hero stones (Eksar Hero Stones).',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-borivali-west',
    name: 'Borivali West (Don Bosco)',
    hindi_name: 'बोरीवली पश्चिम',
    marathi_name: 'बोरीवली पश्चिम',
    lines: ['metro_2a'],
    latitude: 19.2314,
    longitude: 72.8409,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Heart of Borivali West Link Road near Don Bosco School, Moksh Plaza, and street shopping.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-pahadi-eksar',
    name: 'Pahadi Eksar (formerly Shimpoli)',
    hindi_name: 'पहाड़ी एकसर',
    marathi_name: 'पहाडी एकसर',
    lines: ['metro_2a'],
    latitude: 19.2228,
    longitude: 72.8409,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Shimpoli Road artisanal coffee addas, food corners, and tranquil residential lanes.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-kandivali-west',
    name: 'Kandivali West (Mahavir Nagar)',
    hindi_name: 'कांदिवली पश्चिम',
    marathi_name: 'कांदिवली पश्चिम',
    lines: ['metro_2a'],
    latitude: 19.2141,
    longitude: 72.8374,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Direct exit into famous Mahavir Nagar Khau Galli street food paradise and Shankar Mandir.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-dahanukarwadi',
    name: 'Dahanukarwadi',
    hindi_name: 'दहानुकरवाड़ी',
    marathi_name: 'डहाणूकरवाडी',
    lines: ['metro_2a'],
    latitude: 19.2062,
    longitude: 72.8348,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: '3 min walk to Uday Resto-Bar, MG Road market, and Charkop industrial sector.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-valnai',
    name: 'Valnai - Meeth Chowky (formerly Charkop)',
    hindi_name: 'वलनई - मीठ चौकी',
    marathi_name: 'वलनई - मीठ चौकी',
    lines: ['metro_2a'],
    latitude: 19.1968,
    longitude: 72.8338,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Mithchowki junction, gateway to Charkop creek promenades, mangrove trails, and Link Road retail.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-malad-west',
    name: 'Malad West',
    hindi_name: 'मालाड पश्चिम',
    marathi_name: 'मालाड पश्चिम',
    lines: ['metro_2a'],
    latitude: 19.1853,
    longitude: 72.8358,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Direct connection to Liberty Garden, Infiniti Mall Malad, Mamletdar Wadi & Orlem village.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-lower-malad',
    name: 'Lower Malad',
    hindi_name: 'लोअर मालाड',
    marathi_name: 'लोअर मालाड',
    lines: ['metro_2a'],
    latitude: 19.17295,
    longitude: 72.83645,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Directly serving Inorbit Mall (literally 1 min walk below station), Mindspace IT hub, and Link Road addas.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-pahadi-goregaon',
    name: 'Bangur Nagar',
    hindi_name: 'बांगुर नगर',
    marathi_name: 'बांगुर नगर',
    lines: ['metro_2a'],
    latitude: 19.16247,
    longitude: 72.83487,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Serving Bangur Nagar commercial avenue, Link Road resto-pubs, and Oshiwara bridge (1.1 km south of Inorbit Mall).',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-goregaon-west',
    name: 'Goregaon West',
    hindi_name: 'गोरेगांव पश्चिम',
    marathi_name: 'गोरेगाव पश्चिम',
    lines: ['metro_2a'],
    latitude: 19.1530,
    longitude: 72.8357,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Direct exit towards SV Road connector, Goregaon Sports Club, and food plazas.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-oshiwara',
    name: 'Oshiwara (formerly Adarsh Nagar)',
    hindi_name: 'ओशिवरा',
    marathi_name: 'ओशिवरा',
    lines: ['metro_2a'],
    latitude: 19.1460,
    longitude: 72.8340,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Oshiwara creative media district, boutique studios, production houses & hip coffee shops.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-lower-oshiwara',
    name: 'Lower Oshiwara (formerly Shastri Nagar)',
    hindi_name: 'लोअर ओशिवरा',
    marathi_name: 'लोअर ओशिवरा',
    lines: ['metro_2a'],
    latitude: 19.1407,
    longitude: 72.8317,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Steps from Lokhandwala Back Road promenade, Infiniti Mall Andheri, Mega Mall, and street life.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-andheri-west',
    name: 'Andheri West (Line 1 Interchange)',
    hindi_name: 'अंधेरी पश्चिम',
    marathi_name: 'अंधेरी पश्चिम',
    lines: ['metro_2a', 'metro_1'],
    latitude: 19.1291,
    longitude: 72.8314,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Southern terminal of Line 2A with direct elevated concourse transfer to Metro Line 1 at D.N. Nagar.',
    auto_rickshaw_available: true,
  },

  // ─────────────────────────────────────────────────────────────
  // 3. Metro Line 7 (Red Line: Dahisar East ⇄ WEH ⇄ Gundavali - 14 Stations)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'metro7-dahisar-east',
    name: 'Dahisar East (Line 7 & 2A Hub)',
    hindi_name: 'दहिसर पूर्व',
    marathi_name: 'दहिसर पूर्व',
    lines: ['metro_7', 'metro_2a'],
    latitude: 19.2517,
    longitude: 72.8673,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Northern transit hub with crossover tracks connecting Line 7 to Line 2A.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro7-ovaripada',
    name: 'Ovaripada',
    hindi_name: 'ओवरीपाड़ा',
    marathi_name: 'ओवरीपाडा',
    lines: ['metro_7'],
    latitude: 19.2435,
    longitude: 72.8642,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Elevated highway station with panoramic views of Borivali green hills.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro7-rashtriya-udyan',
    name: 'Rashtriya Udyan (SGNP Gateway)',
    hindi_name: 'राष्ट्रीय उद्यान',
    marathi_name: 'राष्ट्रीय उद्यान',
    lines: ['metro_7'],
    latitude: 19.2347,
    longitude: 72.8631,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Direct 300m gateway to Sanjay Gandhi National Park (SGNP) main entrance, cycling trails & Kanheri Caves shuttles.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro7-devipada',
    name: 'Devipada',
    hindi_name: 'देवीपाड़ा',
    marathi_name: 'देवीपाडा',
    lines: ['metro_7'],
    latitude: 19.2243,
    longitude: 72.8642,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Fast access to Kulupwadi quiet residential hill pockets and Borivali East greenery.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro7-magathane',
    name: 'Magathane',
    hindi_name: 'मागाठाणे',
    marathi_name: 'मागाठाणे',
    lines: ['metro_7'],
    latitude: 19.2172,
    longitude: 72.8667,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Fast connection to Magathane bus depot, Tata Power, and East-West Borivali flyover.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro7-poisar',
    name: 'Poisar',
    hindi_name: 'पोईसर',
    marathi_name: 'पोईसर',
    lines: ['metro_7'],
    latitude: 19.2039,
    longitude: 72.8634,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Situated outside Mahindra & Mahindra gate on Western Express Highway.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro7-akurli',
    name: 'Akurli (Kandivali East)',
    hindi_name: 'आकुर्ली',
    marathi_name: 'आकुर्ली',
    lines: ['metro_7'],
    latitude: 19.1983,
    longitude: 72.8607,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Central Kandivali East transit station near Growel\'s 101 Mall and Akurli Road food addas.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro7-kurar',
    name: 'Kurar (Malad East)',
    hindi_name: 'कुरार',
    marathi_name: 'कुरार',
    lines: ['metro_7'],
    latitude: 19.1873,
    longitude: 72.8584,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Serving Kurar village hills, Appa Pada, and Malad East residential complexes.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro7-dindoshi',
    name: 'Dindoshi (Oberoi Mall Gateway)',
    hindi_name: 'दिंडोशी',
    marathi_name: 'दिंडोशी',
    lines: ['metro_7'],
    latitude: 19.1798,
    longitude: 72.8582,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Direct access to Oberoi Mall, Gokuldham sanctuary roads, and Film City Road.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro7-aarey',
    name: 'Aarey (Goregaon East)',
    hindi_name: 'आरे',
    marathi_name: 'आरे',
    lines: ['metro_7'],
    latitude: 19.1694,
    longitude: 72.8587,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Gateway to Aarey Milk Colony forest roads, Chhota Kashmir lake, picnic spots & plant nurseries.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro7-goregaon-east',
    name: 'Goregaon East (formerly Mahanand)',
    hindi_name: 'गोरेगांव पूर्व',
    marathi_name: 'गोरेगाव पूर्व',
    lines: ['metro_7'],
    latitude: 19.1524,
    longitude: 72.8564,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Major WEH commercial station opposite NESCO Bombay Exhibition Centre and Western Heights.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro7-jogeshwari-east',
    name: 'Jogeshwari East (JVLR)',
    hindi_name: 'जोगेश्वरी पूर्व',
    marathi_name: 'जोगेश्वरी पूर्व',
    lines: ['metro_7'],
    latitude: 19.1430,
    longitude: 72.8551,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Major junction of Western Express Highway and Jogeshwari-Vikhroli Link Road (JVLR).',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro7-mogra',
    name: 'Mogra',
    hindi_name: 'मोगरा',
    marathi_name: 'मोगरा',
    lines: ['metro_7'],
    latitude: 19.1289,
    longitude: 72.8554,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Mogra village, Natwar Nagar, and quick cab access to SEEPZ and MIDC.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro7-gundavali',
    name: 'Gundavali (Line 7 Terminus & Line 1 Hub)',
    hindi_name: 'गुंदवली',
    marathi_name: 'गुंदवली',
    lines: ['metro_7', 'metro_1'],
    latitude: 19.1150,
    longitude: 72.8552,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Southern terminal of Line 7 with enclosed AC skywalk connecting directly to Metro Line 1 WEH station.',
    auto_rickshaw_available: true,
  },

  // ─────────────────────────────────────────────────────────────
  // 4. Metro Line 3 (Aqua Line: Aarey JVLR ⇄ BKC ⇄ Cuffe Parade - 27 Stations)
  // Phase 1 (Aarey JVLR to BKC): Operational since Oct 5, 2024
  // Phase 2 (Dharavi to Cuffe Parade): Under Commissioning / Opening 2025
  // ─────────────────────────────────────────────────────────────
  {
    id: 'metro3-aarey-jvlr',
    name: 'Aarey JVLR (Aqua Line Gateway)',
    hindi_name: 'आरे जेवीएलआर',
    marathi_name: 'आरे जेव्हीएलआर',
    lines: ['metro_3'],
    latitude: 19.1394,
    longitude: 72.8785,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'At-grade northern terminal of Aqua Line. Gateway to Aarey Milk Colony forest trails, picnic groves & eco-walks.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro3-seepz',
    name: 'SEEPZ',
    hindi_name: 'सीपज़',
    marathi_name: 'सीप्झ',
    lines: ['metro_3'],
    latitude: 19.1275,
    longitude: 72.8795,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Underground station serving SEEPZ Special Economic Zone, gem & jewellery complexes & MIDC tech parks.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro3-midc',
    name: 'MIDC - Andheri',
    hindi_name: 'एमआईडीसी - अंधेरी',
    marathi_name: 'एमआयडीसी - अंधेरी',
    lines: ['metro_3'],
    latitude: 19.1185,
    longitude: 72.8805,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Heart of Andheri East industrial design studios, microbreweries, and corporate headquarters.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro3-marol-naka',
    name: 'Marol Naka (Line 1 & 3 Hub)',
    hindi_name: 'मरोल नाका',
    marathi_name: 'मरोळ नाका',
    lines: ['metro_3', 'metro_1'],
    latitude: 19.1085,
    longitude: 72.8808,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'First integrated bi-level transfer hub: seamless escalators connecting underground Aqua Line 3 to elevated Blue Line 1.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro3-csmia-t2',
    name: 'CSMIA T2 (Airport Terminal 2)',
    hindi_name: 'छत्रपति शिवाजी महाराज हवाई अड्डा टी२',
    marathi_name: 'छत्रपती शिवाजी महाराज विमानतळ टी२',
    lines: ['metro_3'],
    latitude: 19.0968,
    longitude: 72.8745,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Direct subterranean walkway straight into Terminal 2 International Departure and Arrival concourse.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro3-sahar-road',
    name: 'Sahar Road',
    hindi_name: 'सहार रोड',
    marathi_name: 'सहार रोड',
    lines: ['metro_3'],
    latitude: 19.0925,
    longitude: 72.8615,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Underground station serving historic Sahar village, cargo terminal, and luxury airport hotels.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro3-csmia-t1',
    name: 'CSMIA T1 (Domestic Terminal 1)',
    hindi_name: 'छत्रपति शिवाजी महाराज हवाई अड्डा टी१',
    marathi_name: 'छत्रपती शिवाजी महाराज विमानतळ टी१',
    lines: ['metro_3'],
    latitude: 19.0885,
    longitude: 72.8525,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Subterranean direct access to Domestic Terminal 1 gates at Santacruz.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro3-santacruz',
    name: 'Santacruz',
    hindi_name: 'सांताक्रुज़',
    marathi_name: 'सांताक्रूझ',
    lines: ['metro_3'],
    latitude: 19.0815,
    longitude: 72.8465,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Underground station on WEH serving Vakola, Prabhat Colony, and western residential quarters.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro3-bandra-colony',
    name: 'Bandra Colony (Vidyanagari)',
    hindi_name: 'बांद्रा कॉलोनी (विद्यानगरी)',
    marathi_name: 'वांद्रे कॉलनी (विद्यानगरी)',
    lines: ['metro_3'],
    latitude: 19.0725,
    longitude: 72.8585,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Directly serves University of Mumbai Kalina campus, research archives, and Bandra East government colony.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro3-bkc',
    name: 'BKC (Bandra-Kurla Complex)',
    hindi_name: 'बांद्रा-कुर्ला कॉम्प्लेक्स (बीकेसी)',
    marathi_name: 'वांद्रे-कुर्ला संकुल (बीकेसी)',
    lines: ['metro_3'],
    latitude: 19.0665,
    longitude: 72.8685,
    zone: 'Western Suburbs',
    operational_status: 'operational',
    exit_tips: 'Massive underground central terminal serving the financial headquarters, Jio World Drive, US Consulate & MCA.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro3-dharavi',
    name: 'Dharavi',
    hindi_name: 'धारावी',
    marathi_name: 'धारावी',
    lines: ['metro_3'],
    latitude: 19.0435,
    longitude: 72.8565,
    zone: 'Central Suburbs',
    operational_status: 'under_construction',
    exit_tips: 'Underground station serving Dharavi artisan leather guilds, Kumbharwada pottery craft village & Sion link.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro3-shitaladevi',
    name: 'Shitaladevi Temple',
    hindi_name: 'शीतलादेवी मंदिर',
    marathi_name: 'शीतलादेवी मंदिर',
    lines: ['metro_3'],
    latitude: 19.0305,
    longitude: 72.8445,
    zone: 'South Mumbai',
    operational_status: 'under_construction',
    exit_tips: 'Serving historic 18th-century Shitaladevi Temple, Lady Jamshetjee Road, and Mahim coastal quarter.',
    auto_rickshaw_available: false,
  },
  {
    id: 'metro3-dadar',
    name: 'Dadar (Line 3 Underground Hub)',
    hindi_name: 'दादर',
    marathi_name: 'दादर',
    lines: ['metro_3', 'western', 'central'],
    latitude: 19.0195,
    longitude: 72.8395,
    zone: 'South Mumbai',
    operational_status: 'under_construction',
    exit_tips: 'Underground subterranean passenger concourse connecting both Western & Central railway Dadar platforms.',
    auto_rickshaw_available: false,
  },
  {
    id: 'metro3-siddhivinayak',
    name: 'Siddhivinayak (Prabhadevi)',
    hindi_name: 'सिद्धिविनायक',
    marathi_name: 'सिद्धिविनायक',
    lines: ['metro_3'],
    latitude: 19.0165,
    longitude: 72.8315,
    zone: 'South Mumbai',
    operational_status: 'under_construction',
    exit_tips: 'Direct 2 min walk to the sacred 1801 Shree Siddhivinayak Temple, Shivaji Park cultural addas & Kirti College beach.',
    auto_rickshaw_available: false,
  },
  {
    id: 'metro3-worli',
    name: 'Worli',
    hindi_name: 'वरली',
    marathi_name: 'वरळी',
    lines: ['metro_3'],
    latitude: 19.0065,
    longitude: 72.8215,
    zone: 'South Mumbai',
    operational_status: 'under_construction',
    exit_tips: 'Access to Dr Annie Besant Road, Podar Ayurvedic hospital, and Worli Naka.',
    auto_rickshaw_available: false,
  },
  {
    id: 'metro3-acharya-atre',
    name: 'Acharya Atre Chowk',
    hindi_name: 'आचार्य अत्रे चौक',
    marathi_name: 'आचार्य अत्रे चौक',
    lines: ['metro_3'],
    latitude: 18.9965,
    longitude: 72.8205,
    zone: 'South Mumbai',
    operational_status: 'under_construction',
    exit_tips: 'Serving Worli Seaface promenade, Nehru Centre planetarium, and art galleries.',
    auto_rickshaw_available: false,
  },
  {
    id: 'metro3-science-centre',
    name: 'Science Centre (Nehru Science Centre)',
    hindi_name: 'साइंस सेंटर',
    marathi_name: 'सायन्स सेंटर',
    lines: ['metro_3'],
    latitude: 18.9895,
    longitude: 72.8245,
    zone: 'South Mumbai',
    operational_status: 'under_construction',
    exit_tips: 'Footsteps to National Council of Science Museums (Nehru Science Centre) and Mahalaxmi Racecourse green expanses.',
    auto_rickshaw_available: false,
  },
  {
    id: 'metro3-mahalaxmi',
    name: 'Mahalaxmi (WR & Monorail Hub)',
    hindi_name: 'महालक्ष्मी',
    marathi_name: 'महालक्ष्मी',
    lines: ['metro_3', 'western'],
    latitude: 18.9815,
    longitude: 72.8235,
    zone: 'South Mumbai',
    operational_status: 'under_construction',
    exit_tips: 'Underground interchange with WR Mahalaxmi suburban station, Dhobi Ghat view deck, and Monorail terminus.',
    auto_rickshaw_available: false,
  },
  {
    id: 'metro3-mumbai-central',
    name: 'Jagannath Shankar Sheth Metro (Mumbai Central)',
    hindi_name: 'जगन्नाथ शंकरशेठ मेट्रो (मुंबई सेंट्रल)',
    marathi_name: 'जगन्नाथ शंकरशेठ मेट्रो (मुंबई सेंट्रल)',
    lines: ['metro_3', 'western'],
    latitude: 18.9696,
    longitude: 72.8193,
    zone: 'South Mumbai',
    operational_status: 'under_construction',
    exit_tips: 'Officially named after Nana Shankarsheth. Subterranean interchange with Western Railway Mumbai Central outstation & suburban terminus.',
    auto_rickshaw_available: false,
  },
  {
    id: 'metro3-grant-road',
    name: 'Grant Road',
    hindi_name: 'ग्रांट रोड',
    marathi_name: 'ग्रँट रोड',
    lines: ['metro_3', 'western'],
    latitude: 18.9632,
    longitude: 72.8158,
    zone: 'South Mumbai',
    operational_status: 'under_construction',
    exit_tips: 'Walking distance to Lamington Road vintage electronics bazaar, Irani cafes, and Nana Chowk.',
    auto_rickshaw_available: false,
  },
  {
    id: 'metro3-girgaon',
    name: 'Girgaon',
    hindi_name: 'गिरगांव',
    marathi_name: 'गिरगाव',
    lines: ['metro_3'],
    latitude: 18.9555,
    longitude: 72.8185,
    zone: 'South Mumbai',
    operational_status: 'under_construction',
    exit_tips: 'Direct access to Girgaon Chowpatty beach, historic Khotachiwadi Portuguese heritage hamlet & Opera House.',
    auto_rickshaw_available: false,
  },
  {
    id: 'metro3-kalbadevi',
    name: 'Kalbadevi',
    hindi_name: 'कालबादेवी',
    marathi_name: 'काळबादेवी',
    lines: ['metro_3'],
    latitude: 18.9485,
    longitude: 72.8265,
    zone: 'South Mumbai',
    operational_status: 'under_construction',
    exit_tips: 'Deep underground station serving the bustling heritage wholesale markets: Zaveri Bazaar, Mangaldas Cloth Market & Bhuleshwar.',
    auto_rickshaw_available: false,
  },
  {
    id: 'metro3-csmt',
    name: 'CSMT (UNESCO World Heritage Hub)',
    hindi_name: 'सीएसएमटी',
    marathi_name: 'सीएसएमटी',
    lines: ['metro_3', 'central', 'harbour'],
    latitude: 18.9405,
    longitude: 72.8355,
    zone: 'South Mumbai',
    operational_status: 'under_construction',
    exit_tips: 'Subterranean hub facing the iconic UNESCO World Heritage Victorian Terminus, BMC headquarters & Crawford Market.',
    auto_rickshaw_available: false,
  },
  {
    id: 'metro3-hutatma-chowk',
    name: 'Hutatma Chowk (Flora Fountain)',
    hindi_name: 'हुतात्मा चौक',
    marathi_name: 'हुतात्मा चौक',
    lines: ['metro_3'],
    latitude: 18.9325,
    longitude: 72.8315,
    zone: 'South Mumbai',
    operational_status: 'under_construction',
    exit_tips: 'Historic center of Fort. Direct walk to Flora Fountain, Kala Ghoda Arts Precinct, Asiatic Society Library & Jehangir Art Gallery.',
    auto_rickshaw_available: false,
  },
  {
    id: 'metro3-churchgate',
    name: 'Churchgate (WR Hub)',
    hindi_name: 'चर्चगेट',
    marathi_name: 'चर्चगेट',
    lines: ['metro_3', 'western'],
    latitude: 18.9322,
    longitude: 72.8264,
    zone: 'South Mumbai',
    operational_status: 'under_construction',
    exit_tips: 'Direct subterranean connection to Western Railway Churchgate terminus, Oval Maidan Victorian Gothic ensemble & Marine Drive.',
    auto_rickshaw_available: false,
  },
  {
    id: 'metro3-vidhan-bhavan',
    name: 'Vidhan Bhavan (Nariman Point)',
    hindi_name: 'विधान भवन',
    marathi_name: 'विधान भवन',
    lines: ['metro_3'],
    latitude: 18.9255,
    longitude: 72.8225,
    zone: 'South Mumbai',
    operational_status: 'under_construction',
    exit_tips: 'Serving Maharashtra State Legislature (Vidhan Bhavan), Mantralaya, NCPA theaters, and southern Marine Drive promenade.',
    auto_rickshaw_available: false,
  },
  {
    id: 'metro3-cuffe-parade',
    name: 'Cuffe Parade (Aqua Line Terminus)',
    hindi_name: 'कफ परेड',
    marathi_name: 'कफ परेड',
    lines: ['metro_3'],
    latitude: 18.9150,
    longitude: 72.8180,
    zone: 'South Mumbai',
    operational_status: 'under_construction',
    exit_tips: 'Southernmost terminal of Aqua Line. Gateway to Colaba residential quarter, Afghan Memorial Church, World Trade Centre & Sassoon Docks.',
    auto_rickshaw_available: false,
  },

  // ─────────────────────────────────────────────────────────────
  // 5. Navi Mumbai Metro Line 1 (CBD Belapur ⇄ Kharghar ⇄ Pendhar - 11 Stations)
  // Opened November 17, 2023 by CIDCO & Maha Metro
  // ─────────────────────────────────────────────────────────────
  {
    id: 'metronavi-cbd-belapur',
    name: 'CBD Belapur (NMM & Harbour Hub)',
    hindi_name: 'सीबीडी बेलापूर',
    marathi_name: 'सीबीडी बेलापूर',
    lines: ['metro_navi', 'harbour'],
    latitude: 19.0205,
    longitude: 73.0402,
    zone: 'Navi Mumbai',
    operational_status: 'operational',
    exit_tips: 'Western terminal with direct foot overbridge connecting to Harbour line suburban platforms.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metronavi-sector-7',
    name: 'Sector 7 (Belapur)',
    hindi_name: 'सेक्टर ७ (बेलापूर)',
    marathi_name: 'सेक्टर ७ (बेलापूर)',
    lines: ['metro_navi'],
    latitude: 19.0260,
    longitude: 73.0440,
    zone: 'Navi Mumbai',
    operational_status: 'operational',
    exit_tips: 'Serving Belapur commercial towers, Konkan Bhavan administrative complex, and creekside garden parks.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metronavi-science-park',
    name: 'CIDCO Science Park',
    hindi_name: 'सिडको साइंस पार्क',
    marathi_name: 'सिडको सायन्स पार्क',
    lines: ['metro_navi'],
    latitude: 19.0315,
    longitude: 73.0485,
    zone: 'Navi Mumbai',
    operational_status: 'operational',
    exit_tips: 'Footsteps to CIDCO Science Park interactive exhibits and Belapur coastal promenade.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metronavi-utsav-chowk',
    name: 'Utsav Chowk (Kharghar)',
    hindi_name: 'उत्सव चौक (खारघर)',
    marathi_name: 'उत्सव चौक (खारघर)',
    lines: ['metro_navi'],
    latitude: 19.0385,
    longitude: 73.0565,
    zone: 'Navi Mumbai',
    operational_status: 'operational',
    exit_tips: 'Landmark Greco-Roman style amphitheater of Kharghar, surrounded by bustling student addas and food stalls.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metronavi-sector-11',
    name: 'Sector 11 (Kharghar)',
    hindi_name: 'सेक्टर ११ (खारघर)',
    marathi_name: 'सेक्टर ११ (खारघर)',
    lines: ['metro_navi'],
    latitude: 19.0418,
    longitude: 73.0610,
    zone: 'Navi Mumbai',
    operational_status: 'operational',
    exit_tips: 'Central Kharghar residential node near Shilp Chowk and open greens.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metronavi-sector-14',
    name: 'Sector 14 (Kharghar)',
    hindi_name: 'सेक्टर १४ (खारघर)',
    marathi_name: 'सेक्टर १४ (खारघर)',
    lines: ['metro_navi'],
    latitude: 19.0450,
    longitude: 73.0660,
    zone: 'Navi Mumbai',
    operational_status: 'operational',
    exit_tips: 'Serving Kharghar sports complex, local cafes, and valley view parks.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metronavi-central-park',
    name: 'Central Park (Kharghar)',
    hindi_name: 'सेंट्रल पार्क (खारघर)',
    marathi_name: 'सेंट्रल पार्क (खारघर)',
    lines: ['metro_navi'],
    latitude: 19.0485,
    longitude: 73.0715,
    zone: 'Navi Mumbai',
    operational_status: 'operational',
    exit_tips: 'Direct access to Asia\'s largest urban park (Kharghar Central Park), musical fountains, Kharghar Golf Course & amphitheaters.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metronavi-pethpada',
    name: 'Pethpada (Pandavkada Gateway)',
    hindi_name: 'पेठपाड़ा (पांडवकड़ा)',
    marathi_name: 'पेठपाडा (पांडवकडा)',
    lines: ['metro_navi'],
    latitude: 19.0585,
    longitude: 73.0785,
    zone: 'Navi Mumbai',
    operational_status: 'operational',
    exit_tips: 'Direct gateway station for monsoon treks into Pandavkada Waterfall, stream trails & Kharghar green hills.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metronavi-sector-34',
    name: 'Sector 34 (Kharghar)',
    hindi_name: 'सेक्टर ३४ (खारघर)',
    marathi_name: 'सेक्टर ३४ (खारघर)',
    lines: ['metro_navi'],
    latitude: 19.0620,
    longitude: 73.0820,
    zone: 'Navi Mumbai',
    operational_status: 'operational',
    exit_tips: 'Elevated station overlooking the scenic foothills of the Parsik mountain range.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metronavi-panchanand',
    name: 'Panchanand (Taloja)',
    hindi_name: 'पंचानंद (तलोजा)',
    marathi_name: 'पंचानंद (तळोजा)',
    lines: ['metro_navi'],
    latitude: 19.0655,
    longitude: 73.0855,
    zone: 'Navi Mumbai',
    operational_status: 'operational',
    exit_tips: 'Connecting modern residential sectors of upper Kharghar with Taloja riverfront.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metronavi-pendhar',
    name: 'Pendhar (Line 1 Terminus)',
    hindi_name: 'पेंधर',
    marathi_name: 'पेंधर',
    lines: ['metro_navi'],
    latitude: 19.0685,
    longitude: 73.0885,
    zone: 'Navi Mumbai',
    operational_status: 'operational',
    exit_tips: 'Eastern terminus of Navi Mumbai Metro Line 1 with future connection towards MIDC Taloja and Kalyan.',
    auto_rickshaw_available: true,
  },

  // Harbour Line & Navi Mumbai Connectors
  {
    id: 'stn-wadala-road',
    name: 'Wadala Road',
    hindi_name: 'वडाला रोड',
    marathi_name: 'वडाळा रोड',
    lines: ['harbour'],
    latitude: 19.0163,
    longitude: 72.8593,
    zone: 'South Mumbai',
    fast_train_stop: true,
    exit_tips: 'Major Harbour junction splitting toward Panvel (Navi Mumbai) and Andheri (WR interchange).',
    auto_rickshaw_available: false,
  },
  {
    id: 'stn-chembur',
    name: 'Chembur',
    hindi_name: 'चेंबूर',
    marathi_name: 'चेंबर',
    lines: ['harbour'],
    latitude: 19.0624,
    longitude: 72.8997,
    zone: 'Central Suburbs',
    fast_train_stop: false,
    exit_tips: 'East exit towards Diamond Garden and Sindhi Camp food heritage.',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-vashi',
    name: 'Vashi',
    hindi_name: 'वाशी',
    marathi_name: 'वाशी',
    lines: ['harbour'],
    latitude: 19.0645,
    longitude: 72.9984,
    zone: 'Navi Mumbai',
    fast_train_stop: true,
    exit_tips: 'First station across the Thane Creek bridge entering Navi Mumbai. Station complex has shopping mall & IT park.',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-cbd-belapur',
    name: 'CBD Belapur',
    hindi_name: 'सीबीडी बेलापूर',
    marathi_name: 'सीबीडी बेलापूर',
    lines: ['harbour'],
    latitude: 19.0205,
    longitude: 73.0402,
    zone: 'Navi Mumbai',
    fast_train_stop: true,
    exit_tips: 'Gateway to Parsik Hill waterfalls, Artists Village, and Kharghar hills.',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-panvel',
    name: 'Panvel',
    hindi_name: 'पनवेल',
    marathi_name: 'पनवेल',
    lines: ['harbour'],
    latitude: 18.9894,
    longitude: 73.1215,
    zone: 'Navi Mumbai',
    fast_train_stop: true,
    exit_tips: 'Terminal station of Harbour line. Hub for Karnala Bird Sanctuary and Western Ghats forts.',
    auto_rickshaw_available: true,
  },

  // Central Railway Suburbs & Beyond
  {
    id: 'stn-bhandup',
    name: 'Bhandup',
    hindi_name: 'भांडुप',
    marathi_name: 'भांडुप',
    lines: ['central'],
    latitude: 19.1437,
    longitude: 72.9366,
    zone: 'Central Suburbs',
    fast_train_stop: false,
    exit_tips: 'Access to Bhandup Pumping Station flamingo sanctuary & coastal wetland walks.',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-mulund',
    name: 'Mulund',
    hindi_name: 'मुलुंड',
    marathi_name: 'मुलुंड',
    lines: ['central'],
    latitude: 19.1726,
    longitude: 72.9564,
    zone: 'Central Suburbs',
    fast_train_stop: true,
    exit_tips: 'Quiet tree-lined residential suburb. Starting point for Yogi Hills trails.',
    auto_rickshaw_available: true,
  },
  {
    id: 'stn-kalyan',
    name: 'Kalyan Junction',
    hindi_name: 'कल्याण जंक्शन',
    marathi_name: 'कल्याण जंक्शन',
    lines: ['central'],
    latitude: 19.2372,
    longitude: 73.1308,
    zone: 'Thane / Beyond',
    fast_train_stop: true,
    exit_tips: 'Historic major terminus connecting Kasara/Nashik and Karjat/Pune mountain routes.',
    auto_rickshaw_available: true,
  },
];

/**
 * Ordered station tracks for rendering Mumbai's iconic suburban rail spine lines on Leaflet
 */
export interface TransitLineTrack {
  id: TransitLineType;
  name: string;
  code: string;
  color: string;
  coordinates: [number, number][];
}

export const TRANSIT_LINE_TRACKS: TransitLineTrack[] = [
  {
    id: 'western',
    name: 'Western Railway',
    code: 'WR',
    color: '#be123c', // Western Crimson Maroon
    coordinates: [
      [18.9322, 72.8264], // Churchgate
      [18.9436, 72.8236], // Marine Lines
      [18.9519, 72.8189], // Charni Road
      [18.9632, 72.8158], // Grant Road
      [18.9696, 72.8193], // Mumbai Central
      [18.9828, 72.8242], // Mahalaxmi
      [18.9953, 72.8306], // Lower Parel
      [19.0178, 72.8426], // Dadar WR
      [19.0553, 72.8402], // Bandra
      [19.0697, 72.8394], // Khar Road
      [19.0817, 72.8413], // Santacruz
      [19.0988, 72.8439], // Vile Parle
      [19.1197, 72.8464], // Andheri
      [19.1353, 72.8492], // Jogeshwari
      [19.1554, 72.8492], // Goregaon
      [19.1868, 72.8488], // Malad
      [19.2045, 72.8519], // Kandivali
      [19.2291, 72.8569], // Borivali
    ],
  },
  {
    id: 'central',
    name: 'Central Railway Main',
    code: 'CR',
    color: '#d97706', // Ochre / Amber
    coordinates: [
      [18.9401, 72.8358], // CSMT
      [18.9768, 72.8331], // Byculla
      [19.0185, 72.8436], // Dadar CR
      [19.0272, 72.8558], // Matunga CR
      [19.0657, 72.8794], // Kurla
      [19.0864, 72.9081], // Ghatkopar
      [19.1437, 72.9366], // Bhandup
      [19.1726, 72.9564], // Mulund
      [19.1860, 72.9754], // Thane
      [19.2372, 73.1308], // Kalyan
    ],
  },
  {
    id: 'harbour',
    name: 'Harbour Line',
    code: 'HR',
    color: '#2563eb', // Royal Cobalt Blue
    coordinates: [
      [18.9401, 72.8358], // CSMT
      [19.0163, 72.8593], // Wadala Road
      [19.0657, 72.8794], // Kurla
      [19.0624, 72.8997], // Chembur
      [19.0645, 72.9984], // Vashi
      [19.0205, 73.0402], // CBD Belapur
      [18.9894, 73.1215], // Panvel
    ],
  },
  {
    id: 'metro_1',
    name: 'Metro Line 1 (Blue Line: Versova ⇄ Ghatkopar - 12 Stations)',
    code: 'M1',
    color: '#0284c7', // Sky Blue
    coordinates: [
      [19.1311, 72.8183], // Versova
      [19.1306, 72.8322], // DN Nagar (Line 2A Hub)
      [19.1287, 72.8364], // Azad Nagar
      [19.1197, 72.8464], // Andheri (WR Interchange)
      [19.1172, 72.8552], // WEH / Gundavali (Line 7 Hub)
      [19.1118, 72.8655], // Chakala (J.B. Nagar)
      [19.1105, 72.8745], // Airport Road
      [19.1085, 72.8808], // Marol Naka (Line 3 Hub)
      [19.1055, 72.8875], // Saki Naka
      [19.0988, 72.8965], // Asalpha
      [19.0925, 72.9025], // Jagruti Nagar
      [19.0864, 72.9081], // Ghatkopar (CR Interchange)
    ],
  },
  {
    id: 'metro_2a',
    name: 'Metro Line 2A (Yellow Line: Dahisar East ⇄ Andheri West - 17 Stations)',
    code: 'M2A',
    color: '#eab308', // Radiant Yellow
    coordinates: [
      [19.2517, 72.8673], // Dahisar East (Line 7 Hub)
      [19.2572, 72.8651], // Anand Nagar (formerly Upper Dahisar)
      [19.2566, 72.8507], // Kandarpada
      [19.2496, 72.8458], // Mandapeshwar / IC Colony
      [19.2404, 72.8435], // Eksar
      [19.2314, 72.8409], // Borivali West
      [19.2228, 72.8409], // Pahadi Eksar (Shimpoli)
      [19.2141, 72.8374], // Kandivali West
      [19.2062, 72.8348], // Dahanukarwadi
      [19.1968, 72.8338], // Valnai - Meeth Chowky
      [19.1853, 72.8358], // Malad West
      [19.17295, 72.83645], // Lower Malad (Inorbit Mall)
      [19.16247, 72.83487], // Bangur Nagar (Pahadi Goregaon)
      [19.1530, 72.8357], // Goregaon West
      [19.1460, 72.8340], // Oshiwara
      [19.1407, 72.8317], // Lower Oshiwara
      [19.1291, 72.8314], // Andheri West (D.N. Nagar Line 1 Interchange)
    ],
  },
  {
    id: 'metro_7',
    name: 'Metro Line 7 (Red Line: Dahisar East ⇄ Gundavali - 14 Stations)',
    code: 'M7',
    color: '#dc2626', // Crimson Red
    coordinates: [
      [19.2517, 72.8673], // Dahisar East (Line 2A Hub)
      [19.2435, 72.8642], // Ovaripada
      [19.2347, 72.8631], // Rashtriya Udyan (SGNP Gateway)
      [19.2243, 72.8642], // Devipada
      [19.2172, 72.8667], // Magathane
      [19.2039, 72.8634], // Poisar
      [19.1983, 72.8607], // Akurli (Kandivali East)
      [19.1873, 72.8584], // Kurar (Malad East)
      [19.1798, 72.8582], // Dindoshi (Oberoi Mall)
      [19.1694, 72.8587], // Aarey (Goregaon East)
      [19.1524, 72.8564], // Goregaon East (formerly Mahanand)
      [19.1430, 72.8551], // Jogeshwari East (JVLR)
      [19.1289, 72.8554], // Mogra
      [19.1150, 72.8552], // Gundavali / WEH Line 1 Hub
    ],
  },
  {
    id: 'metro_3',
    name: 'Metro Line 3 (Aqua Line: Aarey JVLR ⇄ BKC ⇄ Cuffe Parade - 27 Stations)',
    code: 'M3',
    color: '#0d9488', // Aqua Teal
    coordinates: [
      [19.1394, 72.8785], // Aarey JVLR
      [19.1275, 72.8795], // SEEPZ
      [19.1185, 72.8805], // MIDC - Andheri
      [19.1085, 72.8808], // Marol Naka (Line 1 Hub)
      [19.0968, 72.8745], // CSMIA T2 (Airport Terminal 2)
      [19.0925, 72.8615], // Sahar Road
      [19.0885, 72.8525], // CSMIA T1 (Domestic Terminal 1)
      [19.0815, 72.8465], // Santacruz
      [19.0725, 72.8585], // Bandra Colony (Vidyanagari)
      [19.0665, 72.8685], // BKC (Bandra-Kurla Complex)
      [19.0435, 72.8565], // Dharavi
      [19.0305, 72.8445], // Shitaladevi Temple
      [19.0195, 72.8395], // Dadar (Line 3 Underground Hub)
      [19.0165, 72.8315], // Siddhivinayak (Prabhadevi)
      [19.0065, 72.8215], // Worli
      [18.9965, 72.8205], // Acharya Atre Chowk
      [18.9895, 72.8245], // Science Centre (Nehru Science Centre)
      [18.9815, 72.8235], // Mahalaxmi (WR & Monorail Hub)
      [18.9696, 72.8193], // Jagannath Shankar Sheth Metro (Mumbai Central)
      [18.9632, 72.8158], // Grant Road
      [18.9555, 72.8185], // Girgaon
      [18.9485, 72.8265], // Kalbadevi
      [18.9405, 72.8355], // CSMT (UNESCO World Heritage Hub)
      [18.9325, 72.8315], // Hutatma Chowk (Flora Fountain)
      [18.9322, 72.8264], // Churchgate (WR Hub)
      [18.9255, 72.8225], // Vidhan Bhavan (Nariman Point)
      [18.9150, 72.8180], // Cuffe Parade
    ],
  },
  {
    id: 'metro_navi',
    name: 'Navi Mumbai Metro Line 1 (CBD Belapur ⇄ Kharghar ⇄ Pendhar - 11 Stations)',
    code: 'NMM',
    color: '#ea580c', // Tangerine Orange
    coordinates: [
      [19.0205, 73.0402], // CBD Belapur (Harbour Interchange)
      [19.0260, 73.0440], // Sector 7 (Belapur)
      [19.0315, 73.0485], // CIDCO Science Park
      [19.0385, 73.0565], // Utsav Chowk (Kharghar)
      [19.0418, 73.0610], // Sector 11 (Kharghar)
      [19.0450, 73.0660], // Sector 14 (Kharghar)
      [19.0485, 73.0715], // Central Park (Kharghar)
      [19.0585, 73.0785], // Pethpada (Pandavkada Gateway)
      [19.0620, 73.0820], // Sector 34 (Kharghar)
      [19.0655, 73.0855], // Panchanand (Taloja)
      [19.0685, 73.0885], // Pendhar (Line 1 Terminus)
    ],
  },
];

export interface SanctuaryTransitProfile {
  nearestRailway: {
    station: TransitStation;
    distanceMeters: number;
    distanceKm: number;
    walkMinutes: number;
    rickshawMinutes: number;
  };
  nearestMetro?: {
    station: TransitStation;
    distanceMeters: number;
    distanceKm: number;
    walkMinutes: number;
  };
  recommendedConnection: string;
  accessibleLines: TransitLineType[];
}

const transitProfileCache = new Map<string, SanctuaryTransitProfile>();

/**
 * Calculates nearest suburban railway station & metro for any given coordinate.
 * Memoized with an in-memory spatial cache to avoid repeated O(N) loops.
 */
export function getSanctuaryTransitProfile(lat: number, lng: number): SanctuaryTransitProfile {
  const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  const cached = transitProfileCache.get(cacheKey);
  if (cached) return cached;

  let nearestRail: TransitStation = TRANSIT_STATIONS[0];
  let minRailDist = Infinity;

  let nearestMetro: TransitStation | undefined = undefined;
  let minMetroDist = Infinity;

  const accessibleLinesSet = new Set<TransitLineType>();

  for (const stn of TRANSIT_STATIONS) {
    const dist = calculateDistanceMeters(lat, lng, stn.latitude, stn.longitude);

    if (dist <= 2500) {
      stn.lines.forEach((l) => accessibleLinesSet.add(l));
    }

    const hasMetro = stn.lines.some((l) => l.startsWith('metro'));
    const hasSuburban = stn.lines.some((l) => l === 'western' || l === 'central' || l === 'harbour');

    if (hasMetro && dist < minMetroDist) {
      minMetroDist = dist;
      nearestMetro = stn;
    }

    if (hasSuburban && dist < minRailDist) {
      minRailDist = dist;
      nearestRail = stn;
    }
  }

  const railDistKm = Math.round((minRailDist / 1000) * 10) / 10;
  const walkMinutes = Math.round(minRailDist / 80); // ~4.8 km/h walking speed
  const rickshawMinutes = Math.max(4, Math.round(minRailDist / 300)); // ~18 km/h suburban traffic speed

  let recommendedConnection = '';
  if (minRailDist <= 800) {
    recommendedConnection = `🚶 Quick ${walkMinutes} min walk from ${nearestRail.name} station. ${nearestRail.exit_tips}`;
  } else if (nearestRail.auto_rickshaw_available) {
    recommendedConnection = `🛺 ${rickshawMinutes} min meter rickshaw or shared auto from ${nearestRail.name}.`;
  } else {
    recommendedConnection = `🚕 Short kaali-peeli taxi ride or brisk walk from ${nearestRail.name}.`;
  }

  const profile: SanctuaryTransitProfile = {
    nearestRailway: {
      station: nearestRail,
      distanceMeters: Math.round(minRailDist),
      distanceKm: railDistKm,
      walkMinutes,
      rickshawMinutes,
    },
    nearestMetro: nearestMetro
      ? {
        station: nearestMetro,
        distanceMeters: Math.round(minMetroDist),
        distanceKm: Math.round((minMetroDist / 1000) * 10) / 10,
        walkMinutes: Math.round(minMetroDist / 80),
      }
      : undefined,
    recommendedConnection,
    accessibleLines: Array.from(accessibleLinesSet),
  };

  transitProfileCache.set(cacheKey, profile);
  return profile;
}

/**
 * Returns all sanctuaries reachable from a specific station within an accessible radius.
 */
export function getSanctuariesNearStation(station: TransitStation, places: Place[], radiusMeters: number = 3500) {
  return places
    .map((p) => {
      const dist = calculateDistanceMeters(station.latitude, station.longitude, p.latitude, p.longitude);
      return {
        ...p,
        distance_to_station: Math.round(dist),
        walk_minutes: Math.round(dist / 80),
      };
    })
    .filter((p) => p.distance_to_station <= radiusMeters)
    .sort((a, b) => a.distance_to_station - b.distance_to_station);
}

/**
 * Live Mumbai Suburban train rush hour advisory based on current local hour.
 */
export function getMumbaiTransitCrowdAdvisory() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const totalMinutes = currentHour * 60 + currentMinutes;

  // Morning Rush: 8:30 AM to 11:30 AM (510 min to 690 min)
  const isMorningRush = totalMinutes >= 510 && totalMinutes <= 690;
  // Evening Rush: 5:30 PM to 9:00 PM (1050 min to 1260 min)
  const isEveningRush = totalMinutes >= 1050 && totalMinutes <= 1260;
  // Afternoon Lull: 1:00 PM to 4:30 PM (780 min to 990 min)
  const isAfternoonLull = totalMinutes >= 780 && totalMinutes <= 990;

  if (isMorningRush) {
    return {
      status: 'HIGH RUSH (MORNING PEAK)',
      color: 'bg-rose-600 text-white',
      badge: '⚠️ PEAK CONGESTION',
      directionTip: 'Southbound trains to Churchgate & CSMT are intensely packed. Reverse/Northbound trains are comfortable!',
      travelAdvice: 'Board AC Locals, Metro lines, or travel against the peak flow.',
    };
  }

  if (isEveningRush) {
    return {
      status: 'HIGH RUSH (EVENING PEAK)',
      color: 'bg-rose-600 text-white',
      badge: '⚠️ PEAK CONGESTION',
      directionTip: 'Northbound trains towards Borivali, Virar, Kalyan & Thane are heavily crowded. Southbound trains have plenty of room!',
      travelAdvice: 'Take reverse trains to South Mumbai sanctuaries or wait until 9:15 PM.',
    };
  }

  if (isAfternoonLull) {
    return {
      status: 'GOLDEN HOURS (AFTERNOON CALM)',
      color: 'bg-emerald-600 text-white',
      badge: '🌿 BREEZY & COMFORTABLE',
      directionTip: 'Trains across all lines have plenty of open seats and breezy window spots.',
      travelAdvice: 'Ideal time for station-hopping and crossing between suburbs.',
    };
  }

  return {
    status: 'MODERATE (SMOOTH TRANSIT)',
    color: 'bg-amber-600 text-white',
    badge: '● MODERATE FLOW',
    directionTip: 'Suburban trains run smoothly on 3-minute headway with comfortable room.',
    travelAdvice: 'Use UTS mobile app for instant paperless QR ticketing.',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 🧠 SMART TRANSIT ROUTING ENGINE (MUMBAI COMMUTE BLUEPRINT)
// ─────────────────────────────────────────────────────────────────────────────

export interface SmartCommuteStep {
  id: string;
  type: 'first_mile' | 'train' | 'metro' | 'interchange' | 'last_mile' | 'walk_last_mile' | 'auto_last_mile';
  title: string;
  instruction: string;
  detail: string;
  durationMinutes: number;
  distanceMeters?: number;
  badge?: string;
  badgeColor?: string;
}

export interface SmartCommutePlan {
  originStation: TransitStation;
  destinationStation: TransitStation;
  destinationPlace: Place;
  totalDurationMinutes: number;
  trainTypeAdvice: {
    canTakeFast: boolean;
    label: string;
    warning?: string;
  };
  crowdAdvisory: {
    level: 'low' | 'moderate' | 'high';
    headline: string;
    description: string;
    isReversePeak: boolean;
  };
  interchangeStation?: TransitStation;
  steps: SmartCommuteStep[];
}

// Ordered station ID arrays for directional and stop count calculations
const WR_STATIONS_ORDER = [
  'stn-churchgate',
  'stn-marine-lines',
  'stn-charni-road',
  'stn-grant-road',
  'stn-mumbai-central',
  'stn-mahalaxmi',
  'stn-lower-parel',
  'stn-dadar-wr',
  'stn-bandra',
  'stn-khar-road',
  'stn-santacruz',
  'stn-vile-parle',
  'stn-andheri',
  'stn-jogeshwari',
  'stn-goregaon',
  'stn-malad',
  'stn-kandivali',
  'stn-borivali',
];

const CR_STATIONS_ORDER = [
  'stn-csmt',
  'stn-byculla',
  'stn-dadar-cr',
  'stn-matunga-cr',
  'stn-kurla',
  'stn-ghatkopar',
  'stn-bhandup',
  'stn-mulund',
  'stn-thane',
  'stn-kalyan',
];

/**
 * Calculates a foolproof, smart step-by-step transit route from any user location to any sanctuary.
 */
export function planSmartCommute(
  originLat: number,
  originLng: number,
  destinationPlace: Place,
  forcedOriginStationId?: string
): SmartCommutePlan {
  // 1. Resolve Origin Station (nearest to user or explicitly chosen)
  let originStation: TransitStation = TRANSIT_STATIONS[0];
  if (forcedOriginStationId) {
    const found = TRANSIT_STATIONS.find((s) => s.id === forcedOriginStationId);
    if (found) originStation = found;
  } else {
    let minDist = Infinity;
    for (const stn of TRANSIT_STATIONS) {
      const d = calculateDistanceMeters(originLat, originLng, stn.latitude, stn.longitude);
      if (d < minDist) {
        minDist = d;
        originStation = stn;
      }
    }
  }

  // 2. Resolve Destination Station (nearest to sanctuary)
  const destProfile = getSanctuaryTransitProfile(destinationPlace.latitude, destinationPlace.longitude);
  const destinationStation = destProfile.nearestRailway.station;

  // 3. First mile: From origin coordinates to originStation
  const firstMileDist = calculateDistanceMeters(originLat, originLng, originStation.latitude, originStation.longitude);
  const firstMileWalkMin = Math.round(firstMileDist / 80);
  const firstMileAutoMin = Math.max(3, Math.round(firstMileDist / 300));

  const steps: SmartCommuteStep[] = [];
  let totalDuration = 0;

  // Step 1: First Mile
  if (firstMileDist > 150) {
    const isWalkable = firstMileDist <= 800;
    steps.push({
      id: 'step-first-mile',
      type: 'first_mile',
      title: isWalkable ? 'Walk to Station' : 'Hop in Meter Auto / Taxi',
      instruction: isWalkable
        ? `Walk ${Math.round(firstMileDist)}m (~${firstMileWalkMin} mins) to ${originStation.name} station`
        : `Take ${originStation.auto_rickshaw_available ? 'meter auto' : 'kaali-peeli taxi'} (~${firstMileAutoMin} mins) to ${originStation.name}`,
      detail: `Enter via nearest skywalk or concourse at ${originStation.name}.`,
      durationMinutes: isWalkable ? firstMileWalkMin : firstMileAutoMin,
      distanceMeters: Math.round(firstMileDist),
      badge: isWalkable ? '🚶 WALK' : '🛺 FIRST MILE',
      badgeColor: 'bg-amber-100 text-amber-900',
    });
    totalDuration += isWalkable ? firstMileWalkMin : firstMileAutoMin;
  }

  // 4. Determine Train Segment Logic
  let trainTypeAdvice = {
    canTakeFast: false,
    label: 'Slow Local ("S")',
    warning: undefined as string | undefined,
  };

  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDay(); // 0 is Sunday
  const isSundayMegaBlock = currentDay === 0 && currentHour >= 11 && currentHour <= 16;

  let crowdLevel: 'low' | 'moderate' | 'high' = 'moderate';
  let crowdHeadline = 'Normal Suburban Flow';
  let crowdDescription = 'Trains running on 3-4 minute frequency. Comfortable room in both slow and fast coaches.';
  let isReversePeak = false;

  // Case A: User is already at the destination station hub
  if (originStation.id === destinationStation.id) {
    trainTypeAdvice.label = 'Already at Destination Hub';
  } else {
    // Check line alignment
    const isBothWR = originStation.lines.includes('western') && destinationStation.lines.includes('western');
    const isBothCR = originStation.lines.includes('central') && destinationStation.lines.includes('central');

    if (isBothWR) {
      const origIdx = WR_STATIONS_ORDER.indexOf(originStation.id);
      const destIdx = WR_STATIONS_ORDER.indexOf(destinationStation.id);
      const diff = Math.abs(origIdx - destIdx);
      const isSouthbound = destIdx < origIdx;
      const directionLabel = isSouthbound ? 'Southbound (towards Churchgate)' : 'Northbound (towards Borivali / Virar)';

      // Fast Train Intelligence
      if (destinationStation.fast_train_stop && originStation.fast_train_stop && diff >= 4) {
        trainTypeAdvice = {
          canTakeFast: true,
          label: '⚡ FAST Train ("F") Recommended',
          warning: undefined,
        };
      } else if (!destinationStation.fast_train_stop) {
        trainTypeAdvice = {
          canTakeFast: false,
          label: '⚠️ SLOW Local ("S") Mandatory',
          warning: `${destinationStation.name} is a local stop. Fast trains ("F") skip this station! Only board trains marked "S" on the indicator.`,
        };
      }

      // Directional Crowding Intelligence
      const isMorningPeak = currentHour >= 8 && currentHour < 12;
      const isEveningPeak = currentHour >= 17 && currentHour < 21;

      if (isMorningPeak && isSouthbound) {
        crowdLevel = 'high';
        crowdHeadline = '⚠️ Morning Southbound Peak Crush';
        crowdDescription = 'Trains towards Churchgate are heavily congested. Board First Class coach or take AC Local.';
      } else if (isMorningPeak && !isSouthbound) {
        crowdLevel = 'low';
        isReversePeak = true;
        crowdHeadline = '🟢 Reverse-Peak Advantage';
        crowdDescription = 'Traveling against morning office rush. Coaches are breezy with open window seats!';
      } else if (isEveningPeak && !isSouthbound) {
        crowdLevel = 'high';
        crowdHeadline = '⚠️ Evening Northbound Peak Crush';
        crowdDescription = 'Intense crowding towards northern suburbs. Consider traveling after 9:15 PM or take AC Local.';
      } else if (isEveningPeak && isSouthbound) {
        crowdLevel = 'low';
        isReversePeak = true;
        crowdHeadline = '🟢 Reverse-Peak Advantage';
        crowdDescription = 'Southbound trains are calm and pleasant in the evening.';
      }

      const trainTime = trainTypeAdvice.canTakeFast ? Math.round(diff * 1.6) : Math.round(diff * 2.4);

      steps.push({
        id: 'step-train-wr',
        type: 'train',
        title: `Board Western Line ${trainTypeAdvice.canTakeFast ? 'Fast' : 'Slow'} Train`,
        instruction: `Board ${directionLabel} train at ${originStation.name} ➔ Ride ${diff} stops to ${destinationStation.name}`,
        detail: trainTypeAdvice.warning
          ? trainTypeAdvice.warning
          : `Indicators show 'F' for Fast, 'S' for Slow. UTS mobile paperless ticketing available.`,
        durationMinutes: trainTime,
        badge: trainTypeAdvice.canTakeFast ? '⚡ FAST TRAIN' : '🐌 SLOW TRAIN',
        badgeColor: trainTypeAdvice.canTakeFast ? 'bg-rose-600 text-white' : 'bg-amber-400 text-sumi',
      });
      totalDuration += trainTime;
    } else if (isBothCR) {
      const origIdx = CR_STATIONS_ORDER.indexOf(originStation.id);
      const destIdx = CR_STATIONS_ORDER.indexOf(destinationStation.id);
      const diff = Math.abs(origIdx - destIdx);
      const isSouthbound = destIdx < origIdx;
      const directionLabel = isSouthbound ? 'Southbound (towards CSMT)' : 'Northbound (towards Kalyan / Thane)';

      if (destinationStation.fast_train_stop && originStation.fast_train_stop && diff >= 3) {
        trainTypeAdvice = {
          canTakeFast: true,
          label: '⚡ FAST Train ("F") Recommended',
          warning: undefined,
        };
      } else if (!destinationStation.fast_train_stop) {
        trainTypeAdvice = {
          canTakeFast: false,
          label: '⚠️ SLOW Local ("S") Mandatory',
          warning: `${destinationStation.name} is a local stop. Fast trains skip this station! Board Slow local.`,
        };
      }

      const trainTime = trainTypeAdvice.canTakeFast ? Math.round(diff * 1.8) : Math.round(diff * 2.5);

      steps.push({
        id: 'step-train-cr',
        type: 'train',
        title: `Board Central Line Train`,
        instruction: `Board ${directionLabel} train at ${originStation.name} ➔ Ride ${diff} stops to ${destinationStation.name}`,
        detail: trainTypeAdvice.warning || 'Use UTS mobile ticketing. Platform indicators display coach positions.',
        durationMinutes: trainTime,
        badge: 'CR MAIN LINE',
        badgeColor: 'bg-amber-600 text-white',
      });
      totalDuration += trainTime;
    } else {
      // Cross-Line Interchange via Dadar Junction
      const interchangeStation = TRANSIT_STATIONS.find((s) => s.id === 'stn-dadar-wr') || TRANSIT_STATIONS[7];

      steps.push({
        id: 'step-train-leg1',
        type: 'train',
        title: `Leg 1: Train to Dadar Junction`,
        instruction: `Board local train to Dadar Junction from ${originStation.name}`,
        detail: 'Dadar is the central railway interchange connecting Western & Central lines.',
        durationMinutes: 12,
        badge: 'INTERCHANGE',
        badgeColor: 'bg-cobalt text-white',
      });

      steps.push({
        id: 'step-interchange',
        type: 'interchange',
        title: 'Switch Platforms via Foot Overbridge',
        instruction: 'Cross overbridge between Western and Central railway platforms (~4 mins)',
        detail: 'Follow overhead directional signs: Platforms 1-4 for Western, Platforms 5-8 for Central.',
        durationMinutes: 5,
        badge: '🚶 TRANSFER',
        badgeColor: 'bg-sumi text-wabi',
      });

      steps.push({
        id: 'step-train-leg2',
        type: 'train',
        title: `Leg 2: Train to ${destinationStation.name}`,
        instruction: `Board local train to ${destinationStation.name}`,
        detail: `Ride to ${destinationStation.name}. Exit as per advice below.`,
        durationMinutes: 15,
        badge: 'FINAL LEG',
        badgeColor: 'bg-emerald-600 text-white',
      });

      totalDuration += 32;
    }
  }

  // Sunday Mega Block override
  if (isSundayMegaBlock) {
    crowdLevel = 'moderate';
    crowdHeadline = '⚠️ Sunday Mega Block in Progress';
    crowdDescription = 'Indian Railways maintenance block is active (11:00 AM - 4:00 PM). Trains may run 15-20 mins behind schedule.';
  }

  // Step Last: Last Mile from destinationStation to Sanctuary
  const lastMileDist = destProfile.nearestRailway.distanceMeters;
  const lastMileWalkMin = destProfile.nearestRailway.walkMinutes;
  const isLastMileWalkable = lastMileDist <= 800;

  steps.push({
    id: 'step-last-mile',
    type: isLastMileWalkable ? 'walk_last_mile' : 'auto_last_mile',
    title: isLastMileWalkable ? 'Arrive on Foot' : 'Last Mile to Sanctuary',
    instruction: isLastMileWalkable
      ? `Walk ~${lastMileWalkMin} mins (${lastMileDist}m) from ${destinationStation.name} station`
      : `Take ${destinationStation.auto_rickshaw_available ? 'meter auto' : 'kaali-peeli taxi'} (~${destProfile.nearestRailway.rickshawMinutes} mins) to ${destinationPlace.name}`,
    detail: `Station exit: ${destinationStation.exit_tips}`,
    durationMinutes: isLastMileWalkable ? lastMileWalkMin : destProfile.nearestRailway.rickshawMinutes,
    distanceMeters: lastMileDist,
    badge: isLastMileWalkable ? '🚶 WALK' : '🛺 LAST MILE',
    badgeColor: 'bg-matcha-50 text-matcha-700',
  });
  totalDuration += isLastMileWalkable ? lastMileWalkMin : destProfile.nearestRailway.rickshawMinutes;

  return {
    originStation,
    destinationStation,
    destinationPlace,
    totalDurationMinutes: totalDuration,
    trainTypeAdvice,
    crowdAdvisory: {
      level: crowdLevel,
      headline: crowdHeadline,
      description: crowdDescription,
      isReversePeak,
    },
    steps,
  };
}

