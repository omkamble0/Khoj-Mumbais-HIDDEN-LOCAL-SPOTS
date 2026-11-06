import { calculateDistanceMeters } from './scoring';
import { Place } from './types';

export type TransitLineType = 'western' | 'central' | 'harbour' | 'metro_1' | 'metro_2a' | 'metro_7' | 'metro_3' | 'metro_navi';

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
  // 1. Metro Line 1 (Blue Line: Versova ⇄ Andheri ⇄ Ghatkopar)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'metro1-versova',
    name: 'Versova Metro',
    hindi_name: 'वर्सोवा मेट्रो',
    marathi_name: 'वर्सोवा मेट्रो',
    lines: ['metro_1'],
    latitude: 19.1311,
    longitude: 72.8183,
    zone: 'Western Suburbs',
    exit_tips: 'Terminal station. 10 min walk to Versova Beach, Koliwada village & coastal rock cafes.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro1-dn-nagar',
    name: 'D.N. Nagar Metro (Line 1 & 2A Hub)',
    hindi_name: 'डी.एन. नगर मेट्रो',
    marathi_name: 'डी.एन. नगर मेट्रो',
    lines: ['metro_1', 'metro_2a'],
    latitude: 19.1306,
    longitude: 72.8322,
    zone: 'Western Suburbs',
    exit_tips: 'Major elevated interchange with Line 2A (Yellow Line to Dahisar West via Link Road).',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro1-azad-nagar',
    name: 'Azad Nagar Metro',
    hindi_name: 'आज़ाद नगर मेट्रो',
    marathi_name: 'आझाद नगर मेट्रो',
    lines: ['metro_1'],
    latitude: 19.1287,
    longitude: 72.8364,
    zone: 'Western Suburbs',
    exit_tips: 'Steps from Road House Bluez & JP Road rock pubs.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro1-andheri',
    name: 'Andheri Metro (WR Interchange)',
    hindi_name: 'अंधेरी मेट्रो',
    marathi_name: 'अंधेरी मेट्रो',
    lines: ['metro_1', 'western'],
    latitude: 19.1197,
    longitude: 72.8464,
    zone: 'Western Suburbs',
    exit_tips: 'Direct skywalk connection to Andheri Western railway suburban platforms.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro1-weh',
    name: 'WEH / Gundavali Metro (Line 1 & 7 Hub)',
    hindi_name: 'पश्चिम द्रुतगती महामार्ग मेट्रो',
    marathi_name: 'पश्चिम द्रुतगती महामार्ग मेट्रो',
    lines: ['metro_1', 'metro_7'],
    latitude: 19.1172,
    longitude: 72.8552,
    zone: 'Western Suburbs',
    exit_tips: 'Interchange skywalk directly connecting Line 1 with Line 7 Gundavali terminus.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro1-chakala',
    name: 'Chakala (J.B. Nagar) Metro',
    hindi_name: 'चकाला (जे.बी. नगर) मेट्रो',
    marathi_name: 'चकाला (जे.बी. नगर) मेट्रो',
    lines: ['metro_1'],
    latitude: 19.1118,
    longitude: 72.8655,
    zone: 'Western Suburbs',
    exit_tips: 'Heart of Andheri East commercial district, cafes, and business hubs.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro1-airport-road',
    name: 'Airport Road Metro',
    hindi_name: 'एयरपोर्ट रोड मेट्रो',
    marathi_name: 'विमानतळ रोड मेट्रो',
    lines: ['metro_1'],
    latitude: 19.1105,
    longitude: 72.8745,
    zone: 'Western Suburbs',
    exit_tips: 'Quick transit connection to international hotel row and Marol.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro1-marol-naka',
    name: 'Marol Naka Metro (Line 1 & 3 Hub)',
    hindi_name: 'मरोल नाका मेट्रो',
    marathi_name: 'मरोळ नाका मेट्रो',
    lines: ['metro_1', 'metro_3'],
    latitude: 19.1085,
    longitude: 72.8808,
    zone: 'Western Suburbs',
    exit_tips: 'Dual-level interchange between elevated Line 1 and underground Aqua Line 3.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro1-saki-naka',
    name: 'Saki Naka Metro',
    hindi_name: 'साकी नाका मेट्रो',
    marathi_name: 'साकी नाका मेट्रो',
    lines: ['metro_1'],
    latitude: 19.1055,
    longitude: 72.8875,
    zone: 'Central Suburbs',
    exit_tips: 'Bustling junction connecting Powai, Chandivali, and Asalpha.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro1-asalpha',
    name: 'Asalpha Metro',
    hindi_name: 'असलफा मेट्रो',
    marathi_name: 'असाल्फा मेट्रो',
    lines: ['metro_1'],
    latitude: 19.0988,
    longitude: 72.8965,
    zone: 'Central Suburbs',
    exit_tips: 'Known as Mumbai\'s colorful hillside village station with street art.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro1-jagruti-nagar',
    name: 'Jagruti Nagar Metro',
    hindi_name: 'जागृती नगर मेट्रो',
    marathi_name: 'जागृती नगर मेट्रो',
    lines: ['metro_1'],
    latitude: 19.0925,
    longitude: 72.9025,
    zone: 'Central Suburbs',
    exit_tips: 'Elevated view over eastern suburbs hillside; 5 min rickshaw to Pant Nagar.',
    auto_rickshaw_available: true,
  },

  // ─────────────────────────────────────────────────────────────
  // 2. Metro Line 2A (Yellow Line: Dahisar East ⇄ Link Road ⇄ Andheri West)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'metro2a-dahisar-east',
    name: 'Dahisar East Metro (Line 2A & 7 Hub)',
    hindi_name: 'दहिसर पूर्व मेट्रो',
    marathi_name: 'दहिसर पूर्व मेट्रो',
    lines: ['metro_2a', 'metro_7'],
    latitude: 19.2565,
    longitude: 72.8645,
    zone: 'Western Suburbs',
    exit_tips: 'Northern mega-interchange connecting Link Road (2A) with Western Express Highway (7).',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-anand-nagar',
    name: 'Anand Nagar Metro (Line 2A)',
    hindi_name: 'आनंद नगर मेट्रो',
    marathi_name: 'आनंद नगर मेट्रो',
    lines: ['metro_2a'],
    latitude: 19.2520,
    longitude: 72.8552,
    zone: 'Western Suburbs',
    exit_tips: 'Northern Dahisar residential addas and street eateries.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-kandarpada',
    name: 'Kandarpada Metro (Line 2A)',
    hindi_name: 'कंदरपाड़ा मेट्रो',
    marathi_name: 'कंदरपाडा मेट्रो',
    lines: ['metro_2a'],
    latitude: 19.2445,
    longitude: 72.8505,
    zone: 'Western Suburbs',
    exit_tips: 'Access to Dahisar West creek, salt pans, and mangroves.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-mandapeshwar',
    name: 'Mandapeshwar - I.C. Colony Metro',
    hindi_name: 'मंडपेश्वर - आई.सी. कॉलोनी मेट्रो',
    marathi_name: 'मंडपेश्वर - आय.सी. कॉलनी मेट्रो',
    lines: ['metro_2a'],
    latitude: 19.2365,
    longitude: 72.8485,
    zone: 'Western Suburbs',
    exit_tips: 'Footsteps to 1500-year-old Mandapeshwar Rock Caves and IC Colony Goan bakeries.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-eksar',
    name: 'Eksar Metro (Line 2A)',
    hindi_name: 'एकसर मेट्रो',
    marathi_name: 'एकसर मेट्रो',
    lines: ['metro_2a'],
    latitude: 19.2285,
    longitude: 72.8465,
    zone: 'Western Suburbs',
    exit_tips: 'Direct connection to ancient 11th-century Eksar Hero Stones memorial.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-borivali-west',
    name: 'Borivali West (Don Bosco) Metro',
    hindi_name: 'बोरीवली पश्चिम मेट्रो',
    marathi_name: 'बोरीवली पश्चिम मेट्रो',
    lines: ['metro_2a'],
    latitude: 19.2215,
    longitude: 72.8445,
    zone: 'Western Suburbs',
    exit_tips: 'Central Borivali West Link Road hub near Don Bosco School.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-shimpoli',
    name: 'Pahadi Eksar (Shimpoli) Metro',
    hindi_name: 'पहाड़ी एकसर मेट्रो',
    marathi_name: 'पहाडी एकसर मेट्रो',
    lines: ['metro_2a'],
    latitude: 19.2145,
    longitude: 72.8425,
    zone: 'Western Suburbs',
    exit_tips: 'Shimpoli Road cafes, local craft addas, and peaceful residential quarters.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-kandivali-west',
    name: 'Kandivali West (Mahavir Nagar) Metro',
    hindi_name: 'कांदिवली पश्चिम मेट्रो',
    marathi_name: 'कांदिवली पश्चिम मेट्रो',
    lines: ['metro_2a'],
    latitude: 19.2065,
    longitude: 72.8405,
    zone: 'Western Suburbs',
    exit_tips: 'Direct exit into famous Mahavir Nagar Khau Galli street food hub.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-dahanukarwadi',
    name: 'Dahanukarwadi Metro (Line 2A)',
    hindi_name: 'दहानुकरवाड़ी मेट्रो',
    marathi_name: 'डहाणूकरवाडी मेट्रो',
    lines: ['metro_2a'],
    latitude: 19.1995,
    longitude: 72.8385,
    zone: 'Western Suburbs',
    exit_tips: 'Instant 4 min walk to Uday Restaurant & Bar and MG Road.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-valnai-charkop',
    name: 'Valnai (Charkop) Metro',
    hindi_name: 'वलनई (चारकोप) मेट्रो',
    marathi_name: 'वलनई (चारकोप) मेट्रो',
    lines: ['metro_2a'],
    latitude: 19.1925,
    longitude: 72.8365,
    zone: 'Western Suburbs',
    exit_tips: 'Gateway to Charkop creek promenades and quiet western mangroves.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-malad-west',
    name: 'Malad West Metro (Line 2A)',
    hindi_name: 'मालाड पश्चिम मेट्रो',
    marathi_name: 'मालाड पश्चिम मेट्रो',
    lines: ['metro_2a'],
    latitude: 19.1855,
    longitude: 72.8352,
    zone: 'Western Suburbs',
    exit_tips: 'Direct connection to Liberty Garden, Mamletdar Wadi, Harish Bar & Orlem village.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-lower-malad',
    name: 'Lower Malad Metro (Line 2A)',
    hindi_name: 'लोअर मालाड मेट्रो',
    marathi_name: 'लोअर मालाड मेट्रो',
    lines: ['metro_2a'],
    latitude: 19.1785,
    longitude: 72.8345,
    zone: 'Western Suburbs',
    exit_tips: 'Serving Kanchpada, Inorbit Link Road malls and nightlife.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-bangur-nagar',
    name: 'Bangur Nagar Metro (Line 2A)',
    hindi_name: 'बांगुर नगर मेट्रो',
    marathi_name: 'बांगूर नगर मेट्रो',
    lines: ['metro_2a'],
    latitude: 19.1705,
    longitude: 72.8335,
    zone: 'Western Suburbs',
    exit_tips: 'Bangur Nagar commercial strip, local permit rooms, and bakeries.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-goregaon-west',
    name: 'Goregaon West (Pahadi) Metro',
    hindi_name: 'गोरेगांव पश्चिम मेट्रो',
    marathi_name: 'गोरेगाव पश्चिम मेट्रो',
    lines: ['metro_2a'],
    latitude: 19.1625,
    longitude: 72.8325,
    zone: 'Western Suburbs',
    exit_tips: 'Direct exit towards SV Road connector and Goregaon Sports Club.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-adarsh-nagar',
    name: 'Adarsh Nagar Metro (Line 2A)',
    hindi_name: 'आदर्श नगर मेट्रो',
    marathi_name: 'आदर्श नगर मेट्रो',
    lines: ['metro_2a'],
    latitude: 19.1535,
    longitude: 72.8315,
    zone: 'Western Suburbs',
    exit_tips: 'Access to Oshiwara creative studios, casting agencies, and hip cafes.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-oshiwara',
    name: 'Oshiwara (Shastri Nagar) Metro',
    hindi_name: 'ओशिवरा मेट्रो',
    marathi_name: 'ओशिवरा मेट्रो',
    lines: ['metro_2a'],
    latitude: 19.1435,
    longitude: 72.8312,
    zone: 'Western Suburbs',
    exit_tips: 'Steps from Lokhandwala Back Road, Mega Mall, and Woodside Inn.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro2a-andheri-west',
    name: 'Andheri West (Veera Desai) Metro',
    hindi_name: 'अंधेरी पश्चिम मेट्रो',
    marathi_name: 'अंधेरी पश्चिम मेट्रो',
    lines: ['metro_2a'],
    latitude: 19.1235,
    longitude: 72.8325,
    zone: 'Western Suburbs',
    exit_tips: 'Southern terminus of Line 2A at Veera Desai Industrial Area.',
    auto_rickshaw_available: true,
  },

  // ─────────────────────────────────────────────────────────────
  // 3. Metro Line 7 (Red Line: Dahisar East ⇄ WEH ⇄ Gundavali / Andheri)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'metro7-ovaripada',
    name: 'Ovaripada Metro (Line 7)',
    hindi_name: 'ओवरीपाड़ा मेट्रो',
    marathi_name: 'ओवरीपाडा मेट्रो',
    lines: ['metro_7'],
    latitude: 19.2485,
    longitude: 72.8655,
    zone: 'Western Suburbs',
    exit_tips: 'Elevated highway station with panoramic view of Borivali hills.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro7-national-park',
    name: 'National Park Metro (SGNP Gateway)',
    hindi_name: 'राष्ट्रीय उद्यान मेट्रो',
    marathi_name: 'राष्ट्रीय उद्यान मेट्रो',
    lines: ['metro_7'],
    latitude: 19.2315,
    longitude: 72.8665,
    zone: 'Western Suburbs',
    exit_tips: 'Direct 300m walk to Sanjay Gandhi National Park main gate, cycling trails & Kanheri Caves shuttles.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro7-devipada',
    name: 'Devipada Metro (Line 7)',
    hindi_name: 'देवीपाड़ा मेट्रो',
    marathi_name: 'देवीपाडा मेट्रो',
    lines: ['metro_7'],
    latitude: 19.2235,
    longitude: 72.8648,
    zone: 'Western Suburbs',
    exit_tips: 'East exit towards Kulupwadi quiet residential hill pockets.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro7-magathane',
    name: 'Magathane Metro (Line 7)',
    hindi_name: 'मागाठाणे मेट्रो',
    marathi_name: 'मागाठाणे मेट्रो',
    lines: ['metro_7'],
    latitude: 19.2155,
    longitude: 72.8635,
    zone: 'Western Suburbs',
    exit_tips: 'Fast access to Borivali East bus terminus and Tata Power addas.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro7-poisar',
    name: 'Poisar Metro (Line 7)',
    hindi_name: 'पोईसर मेट्रो',
    marathi_name: 'पोईसर मेट्रो',
    lines: ['metro_7'],
    latitude: 19.2085,
    longitude: 72.8615,
    zone: 'Western Suburbs',
    exit_tips: 'Opposite Mahindra & Mahindra gate on Western Express Highway.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro7-akurli',
    name: 'Akurli Metro (Kandivali East)',
    hindi_name: 'आकुर्ली मेट्रो',
    marathi_name: 'आकुर्ली मेट्रो',
    lines: ['metro_7'],
    latitude: 19.1995,
    longitude: 72.8595,
    zone: 'Western Suburbs',
    exit_tips: 'Central Kandivali East transit hub near Growel\'s 101 Mall.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro7-kurar',
    name: 'Kurar Metro (Malad East)',
    hindi_name: 'कुरार मेट्रो',
    marathi_name: 'कुरार मेट्रो',
    lines: ['metro_7'],
    latitude: 19.1865,
    longitude: 72.8585,
    zone: 'Western Suburbs',
    exit_tips: 'Serving Kurar village hills and Malad East residential complexes.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro7-dindoshi',
    name: 'Dindoshi Metro (Line 7)',
    hindi_name: 'दिंडोशी मेट्रो',
    marathi_name: 'दिंडोशी मेट्रो',
    lines: ['metro_7'],
    latitude: 19.1755,
    longitude: 72.8575,
    zone: 'Western Suburbs',
    exit_tips: 'Direct access to Oberoi Mall, Gokuldham, and Film City Road.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro7-aarey',
    name: 'Aarey Metro (Goregaon East)',
    hindi_name: 'आरे मेट्रो',
    marathi_name: 'आरे मेट्रो',
    lines: ['metro_7'],
    latitude: 19.1635,
    longitude: 72.8565,
    zone: 'Western Suburbs',
    exit_tips: 'Gateway to Aarey Milk Colony forest roads, picnic lake & nursery lanes.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro7-mahanand',
    name: 'Goregaon East (Mahanand) Metro',
    hindi_name: 'महानंद डेयरी मेट्रो',
    marathi_name: 'महानंद डेअरी मेट्रो',
    lines: ['metro_7'],
    latitude: 19.1525,
    longitude: 72.8555,
    zone: 'Western Suburbs',
    exit_tips: 'WEH commercial front near NESCO exhibition centre.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro7-jogeshwari-east',
    name: 'Jogeshwari East (JVLR) Metro',
    hindi_name: 'जोगेश्वरी पूर्व मेट्रो',
    marathi_name: 'जोगेश्वरी पूर्व मेट्रो',
    lines: ['metro_7'],
    latitude: 19.1385,
    longitude: 72.8545,
    zone: 'Western Suburbs',
    exit_tips: 'Major junction of WEH and Jogeshwari-Vikhroli Link Road (JVLR).',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro7-mogra',
    name: 'Mogra Metro (Line 7)',
    hindi_name: 'मोगरा मेट्रो',
    marathi_name: 'मोगरा मेट्रो',
    lines: ['metro_7'],
    latitude: 19.1285,
    longitude: 72.8538,
    zone: 'Western Suburbs',
    exit_tips: 'Mogra village, Natwar Nagar, and quick cab access to SEEPZ.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro7-gundavali',
    name: 'Gundavali Metro (Line 7 Terminus & Line 1 Hub)',
    hindi_name: 'गुंदवली मेट्रो',
    marathi_name: 'गुंदवली मेट्रो',
    lines: ['metro_7', 'metro_1'],
    latitude: 19.1172,
    longitude: 72.8552,
    zone: 'Western Suburbs',
    exit_tips: 'Southern terminal of Line 7 with enclosed skywalk connecting Line 1 WEH station.',
    auto_rickshaw_available: true,
  },

  // ─────────────────────────────────────────────────────────────
  // 4. Metro Line 3 (Aqua Line: Underground Colaba ⇄ BKC ⇄ Aarey)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'metro3-aarey',
    name: 'Aarey JVLR Metro (Line 3 Gateway)',
    hindi_name: 'आरे जेवीएलआर मेट्रो',
    marathi_name: 'आरे जेव्हीएलआर मेट्रो',
    lines: ['metro_3'],
    latitude: 19.1394,
    longitude: 72.8785,
    zone: 'Western Suburbs',
    exit_tips: 'Northern terminus. Gateway to Aarey Green forest trails, lakes, and picnic spots.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro3-seepz',
    name: 'SEEPZ Metro (Line 3 Underground)',
    hindi_name: 'सीपज़ मेट्रो',
    marathi_name: 'सीप्झ मेट्रो',
    lines: ['metro_3'],
    latitude: 19.1275,
    longitude: 72.8795,
    zone: 'Western Suburbs',
    exit_tips: 'Serving SEEPZ special economic zone and MIDC IT corporate parks.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro3-midc',
    name: 'MIDC Andheri Metro (Line 3)',
    hindi_name: 'एमआईडीसी अंधेरी मेट्रो',
    marathi_name: 'एमआयडीसी अंधेरी मेट्रो',
    lines: ['metro_3'],
    latitude: 19.1185,
    longitude: 72.8805,
    zone: 'Western Suburbs',
    exit_tips: 'Industrial design studios, craft breweries, and corporate complexes.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro3-marol-naka',
    name: 'Marol Naka Metro (Line 3 Underground Hub)',
    hindi_name: 'मरोल नाका भूमिगत मेट्रो',
    marathi_name: 'मरोळ नाका भूमिगत मेट्रो',
    lines: ['metro_3', 'metro_1'],
    latitude: 19.1085,
    longitude: 72.8808,
    zone: 'Western Suburbs',
    exit_tips: 'Direct seamless subterranean escalator transfer to elevated Metro Line 1.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro3-airport-t2',
    name: 'CSMIA Airport Terminal 2 Metro',
    hindi_name: 'हवाई अड्डा टी२ मेट्रो',
    marathi_name: 'विमानतळ टी२ मेट्रो',
    lines: ['metro_3'],
    latitude: 19.0968,
    longitude: 72.8745,
    zone: 'Western Suburbs',
    exit_tips: 'Direct subterranean walkway into Terminal 2 International Departure & Arrival halls.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro3-sahar-road',
    name: 'Sahar Road Metro (Line 3)',
    hindi_name: 'सहार रोड मेट्रो',
    marathi_name: 'सहार रोड मेट्रो',
    lines: ['metro_3'],
    latitude: 19.0925,
    longitude: 72.8615,
    zone: 'Western Suburbs',
    exit_tips: 'Underground connection serving Sahar village and airport luxury hotels.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro3-airport-t1',
    name: 'CSMIA Airport Terminal 1 Metro',
    hindi_name: 'हवाई अड्डा टी१ मेट्रो',
    marathi_name: 'विमानतळ टी१ मेट्रो',
    lines: ['metro_3'],
    latitude: 19.0885,
    longitude: 72.8525,
    zone: 'Western Suburbs',
    exit_tips: 'Subterranean connection serving Domestic Terminal 1 gates at Santacruz.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro3-santacruz',
    name: 'Santacruz Metro (Line 3 Underground)',
    hindi_name: 'सांताक्रुज़ मेट्रो',
    marathi_name: 'सांताक्रूझ मेट्रो',
    lines: ['metro_3'],
    latitude: 19.0815,
    longitude: 72.8465,
    zone: 'Western Suburbs',
    exit_tips: 'Direct connection to Western Express Highway and Kalina connector.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro3-vidyanagari',
    name: 'Vidyanagari (University) Metro',
    hindi_name: 'विद्यानगरी मेट्रो',
    marathi_name: 'विद्यानगरी मेट्रो',
    lines: ['metro_3'],
    latitude: 19.0725,
    longitude: 72.8585,
    zone: 'Western Suburbs',
    exit_tips: 'Serving Mumbai University Kalina campus, research institutes & archives.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro3-bkc',
    name: 'BKC Metro (Bandra-Kurla Complex)',
    hindi_name: 'बीकेसी मेट्रो',
    marathi_name: 'बीकेसी मेट्रो',
    lines: ['metro_3'],
    latitude: 19.0665,
    longitude: 72.8685,
    zone: 'Western Suburbs',
    exit_tips: 'Underground air-conditioned terminal serving the financial core of BKC and Jio World.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro3-dharavi',
    name: 'Dharavi Metro (Line 3)',
    hindi_name: 'धारावी मेट्रो',
    marathi_name: 'धारावी मेट्रो',
    lines: ['metro_3'],
    latitude: 19.0515,
    longitude: 72.8565,
    zone: 'Central Suburbs',
    exit_tips: 'Serving Dharavi artisan pottery workshops and leather markets.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro3-dadar',
    name: 'Dadar Metro (Line 3 Underground)',
    hindi_name: 'दादर मेट्रो',
    marathi_name: 'दादर मेट्रो',
    lines: ['metro_3', 'western', 'central'],
    latitude: 19.0195,
    longitude: 72.8395,
    zone: 'South Mumbai',
    exit_tips: 'Subterranean connection to Dadar Western and Central railway platforms.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metro3-siddhivinayak',
    name: 'Siddhivinayak Metro (Line 3)',
    hindi_name: 'सिद्धिविनायक मेट्रो',
    marathi_name: 'सिद्धिविनायक मेट्रो',
    lines: ['metro_3'],
    latitude: 19.0165,
    longitude: 72.8315,
    zone: 'South Mumbai',
    exit_tips: 'Direct 2 min walk to the sacred 1801 Shree Siddhivinayak Temple & Shivaji Park.',
    auto_rickshaw_available: false,
  },
  {
    id: 'metro3-worli',
    name: 'Worli Metro (Line 3)',
    hindi_name: 'वरली मेट्रो',
    marathi_name: 'वरळी मेट्रो',
    lines: ['metro_3'],
    latitude: 19.0160,
    longitude: 72.8180,
    zone: 'South Mumbai',
    exit_tips: 'Walking distance to Nehru Centre, Planetarium, and Worli Seaface.',
    auto_rickshaw_available: false,
  },
  {
    id: 'metro3-science-museum',
    name: 'Science Museum / Mahalaxmi Metro',
    hindi_name: 'साइंस म्यूज़ियम मेट्रो',
    marathi_name: 'सायन्स म्युझियम मेट्रो',
    lines: ['metro_3'],
    latitude: 18.9895,
    longitude: 72.8245,
    zone: 'South Mumbai',
    exit_tips: 'Near Nehru Science Centre, Mahalaxmi Racecourse, and Dhobi Ghat.',
    auto_rickshaw_available: false,
  },
  {
    id: 'metro3-mumbai-central',
    name: 'Mumbai Central Metro (Line 3)',
    hindi_name: 'मुंबई सेंट्रल मेट्रो',
    marathi_name: 'मुंबई सेंट्रल मेट्रो',
    lines: ['metro_3', 'western'],
    latitude: 18.9715,
    longitude: 72.8195,
    zone: 'South Mumbai',
    exit_tips: 'Underground connection to Western railway terminus and MSRTC central bus depot.',
    auto_rickshaw_available: false,
  },
  {
    id: 'metro3-grant-road',
    name: 'Grant Road Metro (Line 3)',
    hindi_name: 'ग्रांट रोड मेट्रो',
    marathi_name: 'ग्रँट रोड मेट्रो',
    lines: ['metro_3'],
    latitude: 18.9635,
    longitude: 72.8155,
    zone: 'South Mumbai',
    exit_tips: 'Gateway to Lamington Road vintage electronics market and vintage Irani cafes.',
    auto_rickshaw_available: false,
  },
  {
    id: 'metro3-girgaon',
    name: 'Girgaon Metro (Line 3)',
    hindi_name: 'गिरगांव मेट्रो',
    marathi_name: 'गिरगाव मेट्रो',
    lines: ['metro_3'],
    latitude: 18.9555,
    longitude: 72.8185,
    zone: 'South Mumbai',
    exit_tips: 'Footsteps to Girgaon Chowpatty beach, Khotachiwadi heritage village & Portuguese church.',
    auto_rickshaw_available: false,
  },
  {
    id: 'metro3-kalbadevi',
    name: 'Kalbadevi Metro (Line 3)',
    hindi_name: 'कालबादेवी मेट्रो',
    marathi_name: 'काळबादेवी मेट्रो',
    lines: ['metro_3'],
    latitude: 18.9485,
    longitude: 72.8265,
    zone: 'South Mumbai',
    exit_tips: 'Direct subterranean access into historic bazaars: Zaveri Bazaar & Mangaldas Market.',
    auto_rickshaw_available: false,
  },
  {
    id: 'metro3-csmt',
    name: 'CSMT Metro (Line 3 Underground Hub)',
    hindi_name: 'सीएसएमटी भूमिगत मेट्रो',
    marathi_name: 'सीएसएमटी भूमिगत मेट्रो',
    lines: ['metro_3', 'central', 'harbour'],
    latitude: 18.9405,
    longitude: 72.8355,
    zone: 'South Mumbai',
    exit_tips: 'Interchange directly opposite UNESCO World Heritage Victorian Terminus.',
    auto_rickshaw_available: false,
  },
  {
    id: 'metro3-hutatma-chowk',
    name: 'Hutatma Chowk (Flora Fountain) Metro',
    hindi_name: 'हुतात्मा चौक मेट्रो',
    marathi_name: 'हुतात्मा चौक मेट्रो',
    lines: ['metro_3'],
    latitude: 18.9325,
    longitude: 72.8315,
    zone: 'South Mumbai',
    exit_tips: 'Exit into Fort heritage district, Asiatic Library, and Kala Ghoda arts quarter.',
    auto_rickshaw_available: false,
  },
  {
    id: 'metro3-churchgate',
    name: 'Churchgate Metro (Line 3 Underground)',
    hindi_name: 'चर्चगेट भूमिगत मेट्रो',
    marathi_name: 'चर्चगेट भूमिगत मेट्रो',
    lines: ['metro_3', 'western'],
    latitude: 18.9322,
    longitude: 72.8264,
    zone: 'South Mumbai',
    exit_tips: 'Interchange directly with Western Railway Churchgate terminus and Oval Maidan.',
    auto_rickshaw_available: false,
  },
  {
    id: 'metro3-vidhan-bhavan',
    name: 'Vidhan Bhavan (Nariman Point) Metro',
    hindi_name: 'विधान भवन मेट्रो',
    marathi_name: 'विधान भवन मेट्रो',
    lines: ['metro_3'],
    latitude: 18.9255,
    longitude: 72.8225,
    zone: 'South Mumbai',
    exit_tips: 'Serving Maharashtra State Assembly, NCPA theaters, and Marine Drive southern promenade.',
    auto_rickshaw_available: false,
  },
  {
    id: 'metro3-cuffe-parade',
    name: 'Cuffe Parade Metro (Line 3 Terminus)',
    hindi_name: 'कफ परेड मेट्रो',
    marathi_name: 'कफ परेड मेट्रो',
    lines: ['metro_3'],
    latitude: 18.9150,
    longitude: 72.8180,
    zone: 'South Mumbai',
    exit_tips: 'South-most terminus. Gateway to Colaba, Afghan Church, and Sassoon Docks.',
    auto_rickshaw_available: false,
  },

  // ─────────────────────────────────────────────────────────────
  // 5. Navi Mumbai Metro Line 1 (Orange Line: Belapur ⇄ Kharghar ⇄ Pendhar)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'metronavi-cbd-belapur',
    name: 'CBD Belapur Metro (NMM & Harbour Hub)',
    hindi_name: 'सीबीडी बेलापूर मेट्रो',
    marathi_name: 'सीबीडी बेलापूर मेट्रो',
    lines: ['metro_navi', 'harbour'],
    latitude: 19.0205,
    longitude: 73.0402,
    zone: 'Navi Mumbai',
    exit_tips: 'Interchange hub directly connecting Harbour railway with Navi Mumbai Metro Line 1.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metronavi-science-park',
    name: 'CIDCO Science Park Metro',
    hindi_name: 'साइंस पार्क मेट्रो',
    marathi_name: 'सायन्स पार्क मेट्रो',
    lines: ['metro_navi'],
    latitude: 19.0315,
    longitude: 73.0485,
    zone: 'Navi Mumbai',
    exit_tips: 'Footsteps to CIDCO Science Park and Belapur waterfront promenade.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metronavi-utsav-chowk',
    name: 'Utsav Chowk Metro (Kharghar)',
    hindi_name: 'उत्सव चौक मेट्रो',
    marathi_name: 'उत्सव चौक मेट्रो',
    lines: ['metro_navi'],
    latitude: 19.0385,
    longitude: 73.0565,
    zone: 'Navi Mumbai',
    exit_tips: 'Famous Greco-Roman amphitheater landmark of Kharghar & street food hub.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metronavi-central-park',
    name: 'Kharghar Central Park Metro',
    hindi_name: 'सेंट्रल पार्क मेट्रो',
    marathi_name: 'सेंट्रल पार्क मेट्रो',
    lines: ['metro_navi'],
    latitude: 19.0485,
    longitude: 73.0715,
    zone: 'Navi Mumbai',
    exit_tips: 'Direct access to Kharghar Central Park lotus ponds, amphitheaters & Golf Course.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metronavi-pethpada',
    name: 'Pethpada Metro (Pandavkada Gateway)',
    hindi_name: 'पेठपाड़ा मेट्रो',
    marathi_name: 'पेठपाडा मेट्रो',
    lines: ['metro_navi'],
    latitude: 19.0585,
    longitude: 73.0785,
    zone: 'Navi Mumbai',
    exit_tips: 'Direct gateway station for hikes into Pandavkada Waterfall, foothills & stream trails.',
    auto_rickshaw_available: true,
  },
  {
    id: 'metronavi-pendhar',
    name: 'Pendhar Metro (Line 1 Terminus)',
    hindi_name: 'पेंधर मेट्रो',
    marathi_name: 'पेंधर मेट्रो',
    lines: ['metro_navi'],
    latitude: 19.0685,
    longitude: 73.0885,
    zone: 'Navi Mumbai',
    exit_tips: 'Eastern terminus of Navi Mumbai Metro with views of Taloja river and hills.',
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
    name: 'Metro Line 1 (Blue Line: Versova ⇄ Ghatkopar)',
    code: 'M1',
    color: '#0284c7', // Sky Blue
    coordinates: [
      [19.1311, 72.8183], // Versova
      [19.1306, 72.8322], // DN Nagar
      [19.1287, 72.8364], // Azad Nagar
      [19.1197, 72.8464], // Andheri WR Interchange
      [19.1172, 72.8552], // WEH / Gundavali Interchange
      [19.1118, 72.8655], // Chakala (J.B. Nagar)
      [19.1105, 72.8745], // Airport Road
      [19.1085, 72.8808], // Marol Naka (Line 3 Hub)
      [19.1055, 72.8875], // Saki Naka
      [19.0988, 72.8965], // Asalpha
      [19.0925, 72.9025], // Jagruti Nagar
      [19.0864, 72.9081], // Ghatkopar CR Interchange
    ],
  },
  {
    id: 'metro_2a',
    name: 'Metro Line 2A (Yellow Line: Dahisar East ⇄ Andheri West)',
    code: 'M2A',
    color: '#eab308', // Radiant Yellow
    coordinates: [
      [19.2565, 72.8645], // Dahisar East
      [19.2520, 72.8552], // Anand Nagar
      [19.2445, 72.8505], // Kandarpada
      [19.2365, 72.8485], // Mandapeshwar / IC Colony
      [19.2285, 72.8465], // Eksar
      [19.2215, 72.8445], // Borivali West (Don Bosco)
      [19.2145, 72.8425], // Pahadi Eksar (Shimpoli)
      [19.2065, 72.8405], // Kandivali West (Mahavir Nagar)
      [19.1995, 72.8385], // Dahanukarwadi
      [19.1925, 72.8365], // Valnai (Charkop)
      [19.1855, 72.8352], // Malad West
      [19.1785, 72.8345], // Lower Malad
      [19.1705, 72.8335], // Bangur Nagar
      [19.1625, 72.8325], // Goregaon West
      [19.1535, 72.8315], // Adarsh Nagar
      [19.1435, 72.8312], // Oshiwara
      [19.1306, 72.8322], // DN Nagar (Line 1 Interchange)
      [19.1235, 72.8325], // Andheri West (Veera Desai)
    ],
  },
  {
    id: 'metro_7',
    name: 'Metro Line 7 (Red Line: Dahisar East ⇄ Gundavali / WEH)',
    code: 'M7',
    color: '#dc2626', // Crimson Red
    coordinates: [
      [19.2565, 72.8645], // Dahisar East (Line 2A Hub)
      [19.2485, 72.8655], // Ovaripada
      [19.2315, 72.8665], // National Park (SGNP Gateway)
      [19.2235, 72.8648], // Devipada
      [19.2155, 72.8635], // Magathane
      [19.2085, 72.8615], // Poisar
      [19.1995, 72.8595], // Akurli (Kandivali East)
      [19.1865, 72.8585], // Kurar (Malad East)
      [19.1755, 72.8575], // Dindoshi
      [19.1635, 72.8565], // Aarey (Goregaon East)
      [19.1525, 72.8555], // Mahanand Dairy
      [19.1385, 72.8545], // Jogeshwari East (JVLR)
      [19.1285, 72.8538], // Mogra
      [19.1172, 72.8552], // Gundavali / WEH Line 1 Hub
    ],
  },
  {
    id: 'metro_3',
    name: 'Metro Line 3 (Aqua Line: Aarey ⇄ BKC ⇄ Cuffe Parade)',
    code: 'M3',
    color: '#0d9488', // Aqua Teal
    coordinates: [
      [19.1394, 72.8785], // Aarey JVLR
      [19.1275, 72.8795], // SEEPZ
      [19.1185, 72.8805], // MIDC
      [19.1085, 72.8808], // Marol Naka (Line 1 Hub)
      [19.0968, 72.8745], // CSMIA Airport T2
      [19.0925, 72.8615], // Sahar Road
      [19.0885, 72.8525], // CSMIA Airport T1
      [19.0815, 72.8465], // Santacruz Metro
      [19.0725, 72.8585], // Vidyanagari (University)
      [19.0665, 72.8685], // BKC
      [19.0515, 72.8565], // Dharavi
      [19.0195, 72.8395], // Dadar Underground
      [19.0165, 72.8315], // Siddhivinayak (Prabhadevi)
      [19.0160, 72.8180], // Worli
      [18.9895, 72.8245], // Science Museum (Mahalaxmi)
      [18.9715, 72.8195], // Mumbai Central
      [18.9635, 72.8155], // Grant Road
      [18.9555, 72.8185], // Girgaon
      [18.9485, 72.8265], // Kalbadevi
      [18.9405, 72.8355], // CSMT
      [18.9325, 72.8315], // Hutatma Chowk (Flora Fountain)
      [18.9322, 72.8264], // Churchgate
      [18.9255, 72.8225], // Vidhan Bhavan
      [18.9150, 72.8180], // Cuffe Parade
    ],
  },
  {
    id: 'metro_navi',
    name: 'Navi Mumbai Metro Line 1 (Orange Line: Belapur ⇄ Kharghar ⇄ Pendhar)',
    code: 'NMM',
    color: '#ea580c', // Tangerine Orange
    coordinates: [
      [19.0205, 73.0402], // CBD Belapur (Harbour Interchange)
      [19.0315, 73.0485], // CIDCO Science Park
      [19.0385, 73.0565], // Utsav Chowk (Kharghar)
      [19.0485, 73.0715], // Kharghar Central Park
      [19.0585, 73.0785], // Pethpada (Pandavkada Gateway)
      [19.0685, 73.0885], // Pendhar
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
}

/**
 * Calculates nearest suburban railway station & metro for any given coordinate.
 */
export function getSanctuaryTransitProfile(lat: number, lng: number): SanctuaryTransitProfile {
  let nearestRail: TransitStation = TRANSIT_STATIONS[0];
  let minRailDist = Infinity;

  let nearestMetro: TransitStation | undefined = undefined;
  let minMetroDist = Infinity;

  for (const stn of TRANSIT_STATIONS) {
    const dist = calculateDistanceMeters(lat, lng, stn.latitude, stn.longitude);

    const isMetroOnly = stn.lines.some((l) => l.startsWith('metro')) && !stn.lines.includes('western') && !stn.lines.includes('central') && !stn.lines.includes('harbour');
    
    if (isMetroOnly) {
      if (dist < minMetroDist) {
        minMetroDist = dist;
        nearestMetro = stn;
      }
    } else {
      if (dist < minRailDist) {
        minRailDist = dist;
        nearestRail = stn;
      }
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

  return {
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
  };
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

