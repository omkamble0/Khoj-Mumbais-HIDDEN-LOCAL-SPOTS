import re

NEW_STATIONS = [
  # --- Western Railway Extensions ---
  {
    "id": "stn-ram-mandir",
    "name": "Ram Mandir",
    "hindi_name": "राम मंदिर",
    "marathi_name": "राम मंदिर",
    "lines": ["western", "harbour"],
    "latitude": 19.1534,
    "longitude": 72.8496,
    "zone": "Western Suburbs",
    "fast_train_stop": False,
    "exit_tips": "Direct access to Oshiwara & Mrinal Tai Gore flyover commercial corridor.",
    "auto_rickshaw_available": True
  },
  {
    "id": "stn-dahisar-rail",
    "name": "Dahisar",
    "hindi_name": "दहिसर",
    "marathi_name": "दहिसर",
    "lines": ["western"],
    "latitude": 19.2501,
    "longitude": 72.8592,
    "zone": "Western Suburbs",
    "fast_train_stop": True,
    "exit_tips": "East exit for Dahisar river trails & Metro Line 2A/7 hub. West exit for SV road market.",
    "auto_rickshaw_available": True
  },
  {
    "id": "stn-mira-road",
    "name": "Mira Road",
    "hindi_name": "मीरा रोड",
    "marathi_name": "मीरा रोड",
    "lines": ["western"],
    "latitude": 19.2810,
    "longitude": 72.8561,
    "zone": "Thane / Beyond",
    "fast_train_stop": True,
    "exit_tips": "East exit for Shanti Nagar & Kanakia. West exit for Beverly Park.",
    "auto_rickshaw_available": True
  },
  {
    "id": "stn-bhayandar",
    "name": "Bhayandar",
    "hindi_name": "भाईंदर",
    "marathi_name": "भाईंदर",
    "lines": ["western"],
    "latitude": 19.3015,
    "longitude": 72.8524,
    "zone": "Thane / Beyond",
    "fast_train_stop": True,
    "exit_tips": "West exit towards Uttan, Gorai creek & coastal forts. East exit towards Navghar & Golden Nest.",
    "auto_rickshaw_available": True
  },
  {
    "id": "stn-naigaon",
    "name": "Naigaon",
    "hindi_name": "नायगाव",
    "marathi_name": "नायगाव",
    "lines": ["western"],
    "latitude": 19.3512,
    "longitude": 72.8468,
    "zone": "Thane / Beyond",
    "fast_train_stop": False,
    "exit_tips": "Gateway to salt pans, coastal villages, and Vasai creek crossings.",
    "auto_rickshaw_available": True
  },
  {
    "id": "stn-vasai-road",
    "name": "Vasai Road",
    "hindi_name": "वसई रोड",
    "marathi_name": "वसई रोड",
    "lines": ["western"],
    "latitude": 19.3804,
    "longitude": 72.8322,
    "zone": "Thane / Beyond",
    "fast_train_stop": True,
    "exit_tips": "West exit for Vasai Fort, Suruchi beach & historic Portuguese churches. Auto stand outside.",
    "auto_rickshaw_available": True
  },
  {
    "id": "stn-nallasopara",
    "name": "Nallasopara",
    "hindi_name": "नालासोपारा",
    "marathi_name": "नालासोपारा",
    "lines": ["western"],
    "latitude": 19.4172,
    "longitude": 72.8190,
    "zone": "Thane / Beyond",
    "fast_train_stop": True,
    "exit_tips": "West exit towards historic Buddhist Stupa & coastal wetlands.",
    "auto_rickshaw_available": True
  },
  {
    "id": "stn-virar",
    "name": "Virar",
    "hindi_name": "विरार",
    "marathi_name": "विरार",
    "lines": ["western"],
    "latitude": 19.4542,
    "longitude": 72.8118,
    "zone": "Thane / Beyond",
    "fast_train_stop": True,
    "exit_tips": "Major Western Railway suburban terminus. Connects to Arnala Sea Fort and Jivdani Temple.",
    "auto_rickshaw_available": True
  },
  {
    "id": "stn-mahim",
    "name": "Mahim Junction",
    "hindi_name": "माहिम जंक्शन",
    "marathi_name": "माहिम जंक्शन",
    "lines": ["western", "harbour"],
    "latitude": 19.0406,
    "longitude": 72.8431,
    "zone": "Western Suburbs",
    "fast_train_stop": False,
    "exit_tips": "Interchange between WR and Harbour lines. West exit for Mahim Dargah & Fishermen's colony.",
    "auto_rickshaw_available": True
  },
  {
    "id": "stn-matunga-road",
    "name": "Matunga Road",
    "hindi_name": "माटुंगा रोड",
    "marathi_name": "माटुंगा रोड",
    "lines": ["western"],
    "latitude": 19.0278,
    "longitude": 72.8432,
    "zone": "South Mumbai",
    "fast_train_stop": False,
    "exit_tips": "Access to Shivaji Park, Portuguese Church, and traditional South Indian culinary lane.",
    "auto_rickshaw_available": False
  },
  {
    "id": "stn-prabhadevi",
    "name": "Prabhadevi",
    "hindi_name": "प्रभादेवी",
    "marathi_name": "प्रभादेवी",
    "lines": ["western"],
    "latitude": 19.0131,
    "longitude": 72.8315,
    "zone": "South Mumbai",
    "fast_train_stop": False,
    "exit_tips": "Footbridge connection to Parel Central. Close to Siddhivinayak Temple & modern corporate towers.",
    "auto_rickshaw_available": False
  },

  # --- Central Railway Inner & Suburban Connectors ---
  {
    "id": "stn-sandhurst-road",
    "name": "Sandhurst Road",
    "hindi_name": "सँडहर्स्ट रोड",
    "marathi_name": "सँडहर्स्ट रोड",
    "lines": ["central", "harbour"],
    "latitude": 18.9614,
    "longitude": 72.8394,
    "zone": "South Mumbai",
    "fast_train_stop": False,
    "exit_tips": "Double-decker heritage interchange for Central Main and elevated Harbour line.",
    "auto_rickshaw_available": False
  },
  {
    "id": "stn-chinchpokli",
    "name": "Chinchpokli",
    "hindi_name": "चिंचपोकळी",
    "marathi_name": "चिंचपोकळी",
    "lines": ["central"],
    "latitude": 18.9868,
    "longitude": 72.8317,
    "zone": "South Mumbai",
    "fast_train_stop": False,
    "exit_tips": "Access to Lalbaug, historic textile mill lands, and Chinchpokli bridge.",
    "auto_rickshaw_available": False
  },
  {
    "id": "stn-currey-road",
    "name": "Currey Road",
    "hindi_name": "करी रोड",
    "marathi_name": "करी रोड",
    "lines": ["central"],
    "latitude": 18.9952,
    "longitude": 72.8325,
    "zone": "South Mumbai",
    "fast_train_stop": False,
    "exit_tips": "Heart of Lower Parel textile mill redevelopment and One International Center.",
    "auto_rickshaw_available": False
  },
  {
    "id": "stn-parel",
    "name": "Parel",
    "hindi_name": "परळ",
    "marathi_name": "परळ",
    "lines": ["central"],
    "latitude": 19.0084,
    "longitude": 72.8364,
    "zone": "South Mumbai",
    "fast_train_stop": True,
    "exit_tips": "Connected via FOB to Prabhadevi WR. Proximity to KEM, Tata Memorial, and ITC Grand Central.",
    "auto_rickshaw_available": False
  },
  {
    "id": "stn-sion",
    "name": "Sion",
    "hindi_name": "सायन",
    "marathi_name": "सायन",
    "lines": ["central"],
    "latitude": 19.0396,
    "longitude": 72.8624,
    "zone": "Central Suburbs",
    "fast_train_stop": False,
    "exit_tips": "West exit for Sion Hillock Fort and garden. Boundary line where auto-rickshaws become available.",
    "auto_rickshaw_available": True
  },
  {
    "id": "stn-vidyavihar",
    "name": "Vidyavihar",
    "hindi_name": "विद्याविहार",
    "marathi_name": "विद्याविहार",
    "lines": ["central"],
    "latitude": 19.0798,
    "longitude": 72.8973,
    "zone": "Central Suburbs",
    "fast_train_stop": False,
    "exit_tips": "Direct access to Somaiya Vidyavihar University campus & serene academic grounds.",
    "auto_rickshaw_available": True
  },
  {
    "id": "stn-vikhroli",
    "name": "Vikhroli",
    "hindi_name": "विक्रोळी",
    "marathi_name": "विक्रोळी",
    "lines": ["central"],
    "latitude": 19.1102,
    "longitude": 72.9288,
    "zone": "Central Suburbs",
    "fast_train_stop": False,
    "exit_tips": "East exit for Godrej Mangroves & creekside trails. West exit for LBS Marg.",
    "auto_rickshaw_available": True
  },
  {
    "id": "stn-kanjurmarg",
    "name": "Kanjurmarg",
    "hindi_name": "कांजूरमार्ग",
    "marathi_name": "कांजूरमार्ग",
    "lines": ["central"],
    "latitude": 19.1303,
    "longitude": 72.9351,
    "zone": "Central Suburbs",
    "fast_train_stop": True,
    "exit_tips": "Direct connector route to Powai Lake and IIT Bombay (10 min auto ride).",
    "auto_rickshaw_available": True
  },
  {
    "id": "stn-nahur",
    "name": "Nahur",
    "hindi_name": "नाहूर",
    "marathi_name": "नाहूर",
    "lines": ["central"],
    "latitude": 19.1554,
    "longitude": 72.9463,
    "zone": "Central Suburbs",
    "fast_train_stop": False,
    "exit_tips": "Quiet residential link between Bhandup and Mulund. Fast auto access to Airoli bridge.",
    "auto_rickshaw_available": True
  },
  {
    "id": "stn-dombivli",
    "name": "Dombivli",
    "hindi_name": "डोंबिवली",
    "marathi_name": "डोंबिवली",
    "lines": ["central"],
    "latitude": 19.2184,
    "longitude": 73.0867,
    "zone": "Thane / Beyond",
    "fast_train_stop": True,
    "exit_tips": "Major commuter hub with bustling street food lanes and cultural theatre spaces.",
    "auto_rickshaw_available": True
  },

  # --- Harbour Line Complete Spine ---
  {
    "id": "stn-dockyard-road",
    "name": "Dockyard Road",
    "hindi_name": "डॉकयार्ड रोड",
    "marathi_name": "डॉकयार्ड रोड",
    "lines": ["harbour"],
    "latitude": 18.9664,
    "longitude": 72.8437,
    "zone": "South Mumbai",
    "fast_train_stop": False,
    "exit_tips": "Access to Mazgaon port docks and historic Joseph Baptista Garden atop Bhandarwada hill.",
    "auto_rickshaw_available": False
  },
  {
    "id": "stn-reay-road",
    "name": "Reay Road",
    "hindi_name": "रे रोड",
    "marathi_name": "रे रोड",
    "lines": ["harbour"],
    "latitude": 18.9758,
    "longitude": 72.8456,
    "zone": "South Mumbai",
    "fast_train_stop": False,
    "exit_tips": "Heritage station building. Connects to shipbreaking yards and Darukhana docks.",
    "auto_rickshaw_available": False
  },
  {
    "id": "stn-cotton-green",
    "name": "Cotton Green",
    "hindi_name": "कॉटन ग्रीन",
    "marathi_name": "कॉटन ग्रीन",
    "lines": ["harbour"],
    "latitude": 18.9861,
    "longitude": 72.8475,
    "zone": "South Mumbai",
    "fast_train_stop": False,
    "exit_tips": "Historic 1920s Art Deco station serving the old cotton exchange warehouse district.",
    "auto_rickshaw_available": False
  },
  {
    "id": "stn-sewri",
    "name": "Sewri",
    "hindi_name": "शिवडी",
    "marathi_name": "शिवडी",
    "lines": ["harbour"],
    "latitude": 18.9995,
    "longitude": 72.8542,
    "zone": "South Mumbai",
    "fast_train_stop": False,
    "exit_tips": "Prime winter flamingo watching mudflats and historic 17th-century Sewri Fort bastion.",
    "auto_rickshaw_available": False
  },
  {
    "id": "stn-gtb-nagar",
    "name": "GTB Nagar",
    "hindi_name": "जी.टी.बी. नगर",
    "marathi_name": "जी.टी.बी. नगर",
    "lines": ["harbour"],
    "latitude": 19.0326,
    "longitude": 72.8643,
    "zone": "Central Suburbs",
    "fast_train_stop": False,
    "exit_tips": "Guru Tegh Bahadur Nagar / Koliwada famous for authentic Rawalpindi street food.",
    "auto_rickshaw_available": True
  },
  {
    "id": "stn-chunabhatti",
    "name": "Chunabhatti",
    "hindi_name": "चुनाभट्टी",
    "marathi_name": "चुनाभट्टी",
    "lines": ["harbour"],
    "latitude": 19.0520,
    "longitude": 72.8752,
    "zone": "Central Suburbs",
    "fast_train_stop": False,
    "exit_tips": "Start of the elevated BKC connector flyover.",
    "auto_rickshaw_available": True
  },
  {
    "id": "stn-tilak-nagar",
    "name": "Tilak Nagar",
    "hindi_name": "टिळक नगर",
    "marathi_name": "टिळक नगर",
    "lines": ["harbour"],
    "latitude": 19.0682,
    "longitude": 72.8945,
    "zone": "Central Suburbs",
    "fast_train_stop": False,
    "exit_tips": "Direct FOB connection to Lokmanya Tilak Terminus (LTT) long-distance trains.",
    "auto_rickshaw_available": True
  },
  {
    "id": "stn-govandi",
    "name": "Govandi",
    "hindi_name": "गोवंडी",
    "marathi_name": "गोवंडी",
    "lines": ["harbour"],
    "latitude": 19.0558,
    "longitude": 72.9152,
    "zone": "Central Suburbs",
    "fast_train_stop": False,
    "exit_tips": "Close to Deonar & Chembur East suburbs.",
    "auto_rickshaw_available": True
  },
  {
    "id": "stn-mankhurd",
    "name": "Mankhurd",
    "hindi_name": "मानखुर्द",
    "marathi_name": "मानखुर्द",
    "lines": ["harbour"],
    "latitude": 19.0494,
    "longitude": 72.9318,
    "zone": "Central Suburbs",
    "fast_train_stop": False,
    "exit_tips": "Last station before the Vashi creek bridge entering Navi Mumbai.",
    "auto_rickshaw_available": True
  },
  {
    "id": "stn-sanpada",
    "name": "Sanpada",
    "hindi_name": "सानपाडा",
    "marathi_name": "सानपाडा",
    "lines": ["harbour"],
    "latitude": 19.0664,
    "longitude": 73.0097,
    "zone": "Navi Mumbai",
    "fast_train_stop": False,
    "exit_tips": "Quiet residential sectors and palm-lined avenues of Sanpada.",
    "auto_rickshaw_available": True
  },
  {
    "id": "stn-juinagar",
    "name": "Juinagar",
    "hindi_name": "जुईनगर",
    "marathi_name": "जुईनगर",
    "lines": ["harbour"],
    "latitude": 19.0583,
    "longitude": 73.0184,
    "zone": "Navi Mumbai",
    "fast_train_stop": False,
    "exit_tips": "Trans-harbour line junction towards Thane.",
    "auto_rickshaw_available": True
  },
  {
    "id": "stn-nerul",
    "name": "Nerul",
    "hindi_name": "नेरुळ",
    "marathi_name": "नेरुळ",
    "lines": ["harbour"],
    "latitude": 19.0333,
    "longitude": 73.0175,
    "zone": "Navi Mumbai",
    "fast_train_stop": True,
    "exit_tips": "Hub for DY Patil Stadium, jewel of Navi Mumbai lake promenade, and Uran line trains.",
    "auto_rickshaw_available": True
  },
  {
    "id": "stn-seawoods",
    "name": "Seawoods-Darave",
    "hindi_name": "सीवूड्स-दारावे",
    "marathi_name": "सीवूड्स-दारावे",
    "lines": ["harbour"],
    "latitude": 19.0195,
    "longitude": 73.0186,
    "zone": "Navi Mumbai",
    "fast_train_stop": True,
    "exit_tips": "Grand Central Mall directly integrated above the railway platforms.",
    "auto_rickshaw_available": True
  },
  {
    "id": "stn-kharghar-rail",
    "name": "Kharghar (HR)",
    "hindi_name": "खारघर",
    "marathi_name": "खारघर",
    "lines": ["harbour"],
    "latitude": 19.0278,
    "longitude": 73.0673,
    "zone": "Navi Mumbai",
    "fast_train_stop": True,
    "exit_tips": "Access to Utsav Chowk, Central Park, golf course, and Pandavkada waterfalls.",
    "auto_rickshaw_available": True
  },
  {
    "id": "stn-khandeshwar",
    "name": "Khandeshwar",
    "hindi_name": "खांदेश्वर",
    "marathi_name": "खांदेश्वर",
    "lines": ["harbour"],
    "latitude": 18.9997,
    "longitude": 73.1042,
    "zone": "Navi Mumbai",
    "fast_train_stop": False,
    "exit_tips": "Serene residential node before Panvel, close to Khandeshwar lake.",
    "auto_rickshaw_available": True
  }
]

with open('lib/transit.ts', 'r', encoding='utf-8') as f:
    code = f.read()

# Build TS objects string
ts_entries = []
for s in NEW_STATIONS:
    lines_str = ", ".join(f"'{l}'" for l in s['lines'])
    entry = f"""  {{
    id: '{s["id"]}',
    name: '{s["name"]}',
    hindi_name: '{s["hindi_name"]}',
    marathi_name: '{s["marathi_name"]}',
    lines: [{lines_str}],
    latitude: {s["latitude"]},
    longitude: {s["longitude"]},
    zone: '{s["zone"]}',
    fast_train_stop: {str(s["fast_train_stop"]).lower()},
    exit_tips: '{s["exit_tips"].replace("'", "\\'")}',
    auto_rickshaw_available: {str(s["auto_rickshaw_available"]).lower()},
  }},"""
    ts_entries.append(entry)

insert_text = "\n" + "\n".join(ts_entries) + "\n"

# Find position right before `export const TRANSIT_LINE_TRACKS`
target = "export const TRANSIT_LINE_TRACKS"
if target not in code:
    print("ERROR: Target line not found in lib/transit.ts")
    exit(1)

# Find the `];` that closes TRANSIT_STATIONS before TRANSIT_LINE_TRACKS
pos = code.find(target)
# Search backwards for `];`
close_bracket_pos = code.rfind("];", 0, pos)
if close_bracket_pos == -1:
    print("ERROR: Could not find closing bracket of TRANSIT_STATIONS")
    exit(1)

updated_code = code[:close_bracket_pos] + insert_text + code[close_bracket_pos:]

with open('lib/transit.ts', 'w', encoding='utf-8') as f:
    f.write(updated_code)

print(f"Successfully added {len(NEW_STATIONS)} stations to lib/transit.ts!")
