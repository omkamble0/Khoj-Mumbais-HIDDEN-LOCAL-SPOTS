const fs = require('fs');
const path = require('path');

const MASTER_FILE = path.join(__dirname, '..', 'data', 'places_mumbai.json');
const FF_FILE = path.join(__dirname, '..', 'data', 'places_mumbai', 'fastfood.json');

const ANDHERI_BATCH = [
  {
    id: "ff-mcd-andheri-west-station",
    slug: "mcdonalds-andheri-west-station-sv-road",
    name: "McDonald's (Andheri West Station / SV Road)",
    short_name: "McD Andheri West",
    category: "cafes",
    subcategory: "McDonald's Fast Food Outlet",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹99–₹299 combos",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Andheri West / Station Approach",
    latitude: 19.11950,
    longitude: 72.84580,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Very high footfall transit forecourt near Andheri Railway Station and Metro Line 1 interchange.",
    hiddenness_score: 0.1,
    vibe_score: 0.90,
    safety_score: 0.96,
    accessibility_score: 0.99,
    crowd_level: 5,
    best_time_to_visit: "Evening commuter rush (5:30 PM – 9:30 PM)",
    description: "One of the highest-velocity transit McDonald's in Mumbai situated right outside Andheri Local Station West and Metro exit on SV Road. Serving piping hot McSpicy burgers, fries, and cold cokes.",
    vibe_tags: [
      "fast-food",
      "mcd",
      "mcdonalds",
      "andheri-west",
      "station-approach",
      "metro-interchange",
      "burgers",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1552895638-f7fe08d2f7d5?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "mcdonalds",
        name: "McDonald's Andheri West Station",
        floor: "Ground Floor",
        timing: "7:00 AM – 1:00 AM"
      }
    ]
  },
  {
    id: "ff-mcd-andheri-east-station",
    slug: "mcdonalds-andheri-east-station-mv-road",
    name: "McDonald's (Andheri East Station / MV Road)",
    short_name: "McD Andheri East",
    category: "cafes",
    subcategory: "McDonald's Fast Food Outlet",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹99–₹299 combos",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Andheri East / Station Approach",
    latitude: 19.11890,
    longitude: 72.84850,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Arterial station road connecting railway exit to BEST bus terminus and auto stand.",
    hiddenness_score: 0.1,
    vibe_score: 0.88,
    safety_score: 0.95,
    accessibility_score: 0.99,
    crowd_level: 5,
    best_time_to_visit: "Morning rush and evening return commute",
    description: "Prominent suburban commuter outlet outside Andheri Station East on MV Road. Quick breakfast wraps, hashbrowns, burgers, and iced coffees for Central & Western commuters.",
    vibe_tags: [
      "fast-food",
      "mcd",
      "mcdonalds",
      "andheri-east",
      "station-approach",
      "burgers",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1552895638-f7fe08d2f7d5?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "mcdonalds",
        name: "McDonald's Andheri East Station",
        floor: "Ground Floor",
        timing: "7:00 AM – 1:00 AM"
      }
    ]
  },
  {
    id: "ff-bk-andheri-east-chakala",
    slug: "burger-king-andheri-east-chakala",
    name: "Burger King (Andheri East / Chakala Metro)",
    short_name: "Burger King Chakala",
    category: "cafes",
    subcategory: "Burger King Fast Food Restaurant",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹129–₹349 meals",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Andheri East / Chakala - JB Nagar",
    latitude: 19.11320,
    longitude: 72.86820,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Prime commercial business corridor along Andheri-Kurla Road near Chakala Metro.",
    hiddenness_score: 0.1,
    vibe_score: 0.89,
    safety_score: 0.96,
    accessibility_score: 0.98,
    crowd_level: 4,
    best_time_to_visit: "Corporate lunch (1:00 PM – 3:30 PM) & evening (6:00 PM – 9:30 PM)",
    description: "High-volume corporate and tech-park burger hub situated directly beneath the Chakala Metro Line 1 pillar. Flame-grilled Whoppers, onion rings, and crispy chicken combos.",
    vibe_tags: [
      "fast-food",
      "burger-king",
      "whopper",
      "chakala",
      "jb-nagar",
      "andheri-east",
      "metro-corridor",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "burger king",
        name: "Burger King Chakala Metro",
        floor: "Ground Floor",
        timing: "10:00 AM – 12:00 AM"
      }
    ]
  },
  {
    id: "ff-bk-andheri-lokhandwala",
    slug: "burger-king-andheri-west-lokhandwala",
    name: "Burger King (Andheri West / Lokhandwala Complex)",
    short_name: "Burger King Lokhandwala",
    category: "cafes",
    subcategory: "Burger King Fast Food Restaurant",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹129–₹349 meals",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Andheri West / Lokhandwala",
    latitude: 19.14320,
    longitude: 72.82850,
    access_type: "public",
    safety_level: "high",
    safety_notes: "High-street retail boulevard with heavy pedestrian movement and private security.",
    hiddenness_score: 0.1,
    vibe_score: 0.91,
    safety_score: 0.97,
    accessibility_score: 0.96,
    crowd_level: 4,
    best_time_to_visit: "Evening market hours & late night (5:00 PM – 11:30 PM)",
    description: "Bustling Lokhandwala high street Burger King. Popular celebrity and TV actor hangout serving flame-grilled Whoppers, fiery fries, and chocolate sundaes.",
    vibe_tags: [
      "fast-food",
      "burger-king",
      "whopper",
      "lokhandwala",
      "andheri-west",
      "high-street",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "burger king",
        name: "Burger King Lokhandwala",
        floor: "Ground Floor",
        timing: "10:00 AM – 1:00 AM"
      }
    ]
  },
  {
    id: "ff-kfc-andheri-east-chakala",
    slug: "kfc-andheri-east-chakala-metro",
    name: "KFC (Andheri East / Chakala Metro)",
    short_name: "KFC Chakala",
    category: "cafes",
    subcategory: "KFC Fried Chicken Restaurant",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹150–₹399 meals",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Andheri East / Chakala - JB Nagar",
    latitude: 19.11380,
    longitude: 72.86850,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Prime Andheri-Kurla Road commercial stretch outside Chakala Metro gate 2.",
    hiddenness_score: 0.1,
    vibe_score: 0.90,
    safety_score: 0.96,
    accessibility_score: 0.98,
    crowd_level: 4,
    best_time_to_visit: "Lunch and dinner rush (1:00 PM – 9:30 PM)",
    description: "High-decibel corporate and tech-corridor KFC on Andheri-Kurla Road. Famous for Hot & Crispy chicken buckets, Zinger burgers, and peri peri chicken strips.",
    vibe_tags: [
      "fast-food",
      "kfc",
      "fried-chicken",
      "chakala",
      "andheri-east",
      "metro-corridor",
      "zinger",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "kfc",
        name: "KFC Chakala Metro",
        floor: "Ground Floor",
        timing: "11:00 AM – 11:30 PM"
      }
    ]
  },
  {
    id: "ff-kfc-andheri-west-station",
    slug: "kfc-andheri-west-station-road",
    name: "KFC (Andheri West / Station Road)",
    short_name: "KFC Andheri West",
    category: "cafes",
    subcategory: "KFC Fried Chicken Restaurant",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹150–₹399 meals",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Andheri West / Station Approach",
    latitude: 19.11980,
    longitude: 72.84620,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Directly opposite railway station FOB exit on busy SV Road.",
    hiddenness_score: 0.1,
    vibe_score: 0.89,
    safety_score: 0.96,
    accessibility_score: 0.99,
    crowd_level: 5,
    best_time_to_visit: "Evening commuter rush (5:00 PM – 9:30 PM)",
    description: "Rapid-service transit KFC directly opposite Andheri West Western Railway and Metro exit. Zinger burgers, chicken popcorn, and Krushers for commuters.",
    vibe_tags: [
      "fast-food",
      "kfc",
      "fried-chicken",
      "andheri-west",
      "station-approach",
      "zinger",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "kfc",
        name: "KFC Andheri West Station",
        floor: "Ground Floor",
        timing: "11:00 AM – 12:00 AM"
      }
    ]
  },
  {
    id: "ff-subway-andheri-west-station",
    slug: "subway-andheri-west-station-road",
    name: "Subway (Andheri West / Station Road)",
    short_name: "Subway Andheri West",
    category: "cafes",
    subcategory: "Subway Fresh Subs & Salads",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹150–₹350 subs",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Andheri West / Station Road",
    latitude: 19.11920,
    longitude: 72.84660,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Directly located on station approach road near Shoppers Stop.",
    hiddenness_score: 0.1,
    vibe_score: 0.88,
    safety_score: 0.96,
    accessibility_score: 0.99,
    crowd_level: 4,
    best_time_to_visit: "Lunch (12:30 PM – 3:30 PM) or quick dinner",
    description: "Fresh custom 6-inch subs, wraps, and freshly baked cookies directly outside Andheri West local station for health-conscious commuters.",
    vibe_tags: [
      "fast-food",
      "subway",
      "subs",
      "andheri-west",
      "station-road",
      "healthy-bites",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "subway",
        name: "Subway Andheri West Station",
        floor: "Ground Floor",
        timing: "9:00 AM – 11:30 PM"
      }
    ]
  },
  {
    id: "ff-subway-andheri-lokhandwala",
    slug: "subway-andheri-west-lokhandwala",
    name: "Subway (Andheri West / Lokhandwala Market)",
    short_name: "Subway Lokhandwala",
    category: "cafes",
    subcategory: "Subway Fresh Subs & Salads",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹150–₹350 subs",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Andheri West / Lokhandwala",
    latitude: 19.14180,
    longitude: 72.82780,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Located along Lokhandwala Back Road shopping hub with regular security.",
    hiddenness_score: 0.2,
    vibe_score: 0.91,
    safety_score: 0.97,
    accessibility_score: 0.96,
    crowd_level: 3,
    best_time_to_visit: "Post-workout & afternoon lunch hours",
    description: "A favorite neighborhood sub shop for gym-goers, media professionals, and shoppers in Lokhandwala Complex. Custom multi-grain subs, protein salads, and drinks.",
    vibe_tags: [
      "fast-food",
      "subway",
      "subs",
      "lokhandwala",
      "andheri-west",
      "healthy-bites",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "subway",
        name: "Subway Lokhandwala",
        floor: "Ground Floor",
        timing: "9:30 AM – 11:30 PM"
      }
    ]
  },
  {
    id: "ff-subway-andheri-east-jbnagar",
    slug: "subway-andheri-east-jb-nagar",
    name: "Subway (Andheri East / JB Nagar Metro)",
    short_name: "Subway JB Nagar",
    category: "cafes",
    subcategory: "Subway Fresh Subs & Salads",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹150–₹350 subs",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Andheri East / JB Nagar",
    latitude: 19.11410,
    longitude: 72.87150,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Metro Line 1 corridor right outside JB Nagar station.",
    hiddenness_score: 0.1,
    vibe_score: 0.88,
    safety_score: 0.96,
    accessibility_score: 0.98,
    crowd_level: 4,
    best_time_to_visit: "Lunch & evening hours (1:00 PM – 8:00 PM)",
    description: "Busy metro-corridor sub shop catering to commercial offices and IT hubs in JB Nagar and Marol Naka. Quick toasted subs and salad platters.",
    vibe_tags: [
      "fast-food",
      "subway",
      "subs",
      "jb-nagar",
      "andheri-east",
      "metro-corridor",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "subway",
        name: "Subway JB Nagar",
        floor: "Ground Floor",
        timing: "9:00 AM – 11:00 PM"
      }
    ]
  },
  {
    id: "ff-dominos-andheri-west-svroad",
    slug: "dominos-andheri-west-sv-road",
    name: "Domino's Pizza (Andheri West / SV Road Station)",
    short_name: "Domino's Andheri West",
    category: "cafes",
    subcategory: "Domino's Pizza & Sides",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹150–₹350 for two",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Andheri West / SV Road",
    latitude: 19.11880,
    longitude: 72.84550,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Directly located on SV Road near Nadco Shopping Centre.",
    hiddenness_score: 0.1,
    vibe_score: 0.88,
    safety_score: 0.96,
    accessibility_score: 0.99,
    crowd_level: 4,
    best_time_to_visit: "Lunch and dinner rush (12:00 PM – 10:30 PM)",
    description: "High-traffic pizza outlet right off Andheri West railway station. Piping hot Cheese Burst pizzas, Garlic Breadsticks, and Choco Lava Cakes.",
    vibe_tags: [
      "fast-food",
      "dominos",
      "pizza",
      "andheri-west",
      "sv-road",
      "station-approach",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "dominos",
        name: "Domino's Andheri West Station",
        floor: "Ground Floor",
        timing: "11:00 AM – 12:00 AM"
      }
    ]
  },
  {
    id: "ff-dominos-andheri-lokhandwala",
    slug: "dominos-andheri-west-lokhandwala",
    name: "Domino's Pizza (Andheri West / Lokhandwala)",
    short_name: "Domino's Lokhandwala",
    category: "cafes",
    subcategory: "Domino's Pizza & Sides",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹150–₹350 for two",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Andheri West / Lokhandwala",
    latitude: 19.14250,
    longitude: 72.82810,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Main market road in Lokhandwala Complex with well-lit surroundings.",
    hiddenness_score: 0.1,
    vibe_score: 0.90,
    safety_score: 0.97,
    accessibility_score: 0.96,
    crowd_level: 4,
    best_time_to_visit: "Evening snacks & late night pizza (5:00 PM – 11:30 PM)",
    description: "Prominent Lokhandwala pizza kitchen and dine-in. Fresh dough pizzas, stuffed cheese breads, and chicken wings in the heart of Oshiwara.",
    vibe_tags: [
      "fast-food",
      "dominos",
      "pizza",
      "lokhandwala",
      "andheri-west",
      "cheese-burst",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "dominos",
        name: "Domino's Lokhandwala",
        floor: "Ground Floor",
        timing: "11:00 AM – 1:00 AM"
      }
    ]
  },
  {
    id: "ff-dominos-andheri-east-chakala",
    slug: "dominos-andheri-east-chakala-metro",
    name: "Domino's Pizza (Andheri East / Chakala Metro)",
    short_name: "Domino's Chakala",
    category: "cafes",
    subcategory: "Domino's Pizza & Sides",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹150–₹350 for two",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Andheri East / Chakala",
    latitude: 19.11280,
    longitude: 72.86920,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Commercial office avenue on Andheri-Kurla Road near Chakala Metro.",
    hiddenness_score: 0.1,
    vibe_score: 0.88,
    safety_score: 0.96,
    accessibility_score: 0.98,
    crowd_level: 4,
    best_time_to_visit: "Corporate team lunch and evening dinners (12:30 PM – 9:30 PM)",
    description: "Primary corporate pizza delivery and dine-in hub on Andheri-Kurla Road. Cheesy pizzas, garlic bread, and desserts for MIDC and SEEPZ office goers.",
    vibe_tags: [
      "fast-food",
      "dominos",
      "pizza",
      "chakala",
      "andheri-east",
      "corporate-hub",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "dominos",
        name: "Domino's Chakala",
        floor: "Ground Floor",
        timing: "11:00 AM – 12:00 AM"
      }
    ]
  },
  {
    id: "ff-pizzahut-andheri-lokhandwala",
    slug: "pizza-hut-andheri-west-lokhandwala",
    name: "Pizza Hut (Andheri West / Lokhandwala)",
    short_name: "Pizza Hut Lokhandwala",
    category: "cafes",
    subcategory: "Pizza Hut Pan Pizza & Pasta",
    spot_tier: "iconic",
    budget_tier: "moderate",
    approx_cost: "₹250–₹550 for two",
    price_level: 2,
    city: "Mumbai",
    neighborhood: "Andheri West / Lokhandwala",
    latitude: 19.14200,
    longitude: 72.82890,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Prime shopping boulevard in Lokhandwala Complex with heavy pedestrian flow.",
    hiddenness_score: 0.1,
    vibe_score: 0.91,
    safety_score: 0.97,
    accessibility_score: 0.96,
    crowd_level: 4,
    best_time_to_visit: "Evening and weekend dinners (6:30 PM – 10:30 PM)",
    description: "Classic sit-down Pizza Hut on Lokhandwala High Street. Golden-crust pan pizzas, stuffed crusts, and warm garlic bread for family dinners and friend meetups.",
    vibe_tags: [
      "fast-food",
      "pizza-hut",
      "pizza",
      "pan-pizza",
      "lokhandwala",
      "andheri-west",
      "comfort-food"
    ],
    photo_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "pizza hut",
        name: "Pizza Hut Lokhandwala",
        floor: "Ground Floor",
        timing: "11:00 AM – 11:30 PM"
      }
    ]
  },
  {
    id: "ff-pizzahut-andheri-east-chakala",
    slug: "pizza-hut-andheri-east-chakala-metro",
    name: "Pizza Hut (Andheri East / Chakala Metro)",
    short_name: "Pizza Hut Chakala",
    category: "cafes",
    subcategory: "Pizza Hut Pan Pizza & Pasta",
    spot_tier: "iconic",
    budget_tier: "moderate",
    approx_cost: "₹250–₹550 for two",
    price_level: 2,
    city: "Mumbai",
    neighborhood: "Andheri East / Chakala - JB Nagar",
    latitude: 19.11350,
    longitude: 72.86780,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Commercial boulevard near Chakala Metro Station gate 1.",
    hiddenness_score: 0.1,
    vibe_score: 0.89,
    safety_score: 0.96,
    accessibility_score: 0.98,
    crowd_level: 4,
    best_time_to_visit: "Corporate lunch & evening meetings (1:00 PM – 9:00 PM)",
    description: "Spacious Pizza Hut dining restaurant on Andheri-Kurla Road. Deep dish pan pizzas, cheesy pastas, and mocktails for office teams and locals.",
    vibe_tags: [
      "fast-food",
      "pizza-hut",
      "pizza",
      "pan-pizza",
      "chakala",
      "andheri-east",
      "metro-corridor",
      "comfort-food"
    ],
    photo_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "pizza hut",
        name: "Pizza Hut Chakala",
        floor: "Ground Floor",
        timing: "11:00 AM – 11:00 PM"
      }
    ]
  },
  {
    id: "ff-tacobell-andheri-infiniti",
    slug: "taco-bell-andheri-west-infiniti",
    name: "Taco Bell (Andheri West / Infiniti Mall Zone)",
    short_name: "Taco Bell Andheri",
    category: "cafes",
    subcategory: "Taco Bell Mexican Quick Bites",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹149–₹399 combos",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Andheri West / Link Road",
    latitude: 19.14150,
    longitude: 72.83120,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Prime Link Road shopping district directly opposite Infiniti Mall Andheri.",
    hiddenness_score: 0.1,
    vibe_score: 0.92,
    safety_score: 0.97,
    accessibility_score: 0.97,
    crowd_level: 4,
    best_time_to_visit: "Afternoon & weekend evenings (4:00 PM – 10:30 PM)",
    description: "Crunchy tacos, loaded burritos, cheesy quesadillas, and seasoned Mexican fries near Infiniti Mall Andheri on New Link Road.",
    vibe_tags: [
      "fast-food",
      "taco-bell",
      "tacos",
      "burritos",
      "mexican",
      "andheri-west",
      "link-road",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "taco bell",
        name: "Taco Bell Andheri West",
        floor: "Ground Floor",
        timing: "11:00 AM – 11:00 PM"
      }
    ]
  },
  {
    id: "ff-tibbs-andheri-west-station",
    slug: "tibbs-frankie-andheri-west-station",
    name: "Tibbs Frankie (Andheri West Station Forecourt)",
    short_name: "Tibbs Andheri West",
    category: "cafes",
    subcategory: "Tibbs Original Mumbai Frankie",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹70–₹160 per frankie",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Andheri West / Station Forecourt",
    latitude: 19.11940,
    longitude: 72.84680,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Directly located at Western Railway local station exit with continuous commuter security.",
    hiddenness_score: 0.1,
    vibe_score: 0.92,
    safety_score: 0.95,
    accessibility_score: 0.99,
    crowd_level: 5,
    best_time_to_visit: "Evening transit rush (5:00 PM – 9:30 PM)",
    description: "Iconic Mumbai frankie kiosk situated right at Andheri station west exit. Hot spiced chicken, paneer, and mutton rolls wrapped in flaky rotis with secret vinegar onions.",
    vibe_tags: [
      "fast-food",
      "tibbs",
      "frankie",
      "rolls",
      "andheri-west",
      "andheri-station",
      "mumbai-original",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "tibbs frankie",
        name: "Tibbs Frankie Andheri Station",
        floor: "Station Exit Kiosk",
        timing: "11:00 AM – 11:30 PM"
      }
    ]
  },
  {
    id: "ff-jumboking-andheri-station-west",
    slug: "jumbo-king-andheri-station-west",
    name: "Jumbo King (Andheri Station West - Concourse)",
    short_name: "Jumbo King Andheri West",
    category: "cafes",
    subcategory: "Jumbo King Mumbai Burger Chain",
    spot_tier: "iconic",
    budget_tier: "free",
    approx_cost: "₹39–₹89 per burger",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Andheri West / Station Concourse",
    latitude: 19.11960,
    longitude: 72.84640,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Major Western Railway and Metro interchange concourse with 24/7 security.",
    hiddenness_score: 0.1,
    vibe_score: 0.88,
    safety_score: 0.96,
    accessibility_score: 0.99,
    crowd_level: 5,
    best_time_to_visit: "Morning rush & evening return commute",
    description: "The busiest grab-and-go Mumbai burger joint in the western suburbs directly at Andheri Western Railway and Metro Line 1 interchange concourse. Piping hot potato burgers and fries.",
    vibe_tags: [
      "fast-food",
      "jumboking",
      "burger",
      "desi-burger",
      "andheri-station",
      "andheri-west",
      "pocket-friendly",
      "quick-grab"
    ],
    photo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "jumbo king",
        name: "Jumbo King Andheri West",
        floor: "Station Concourse Level",
        timing: "6:30 AM – 11:30 PM"
      }
    ]
  },
  {
    id: "ff-jumboking-andheri-station-east",
    slug: "jumbo-king-andheri-station-east",
    name: "Jumbo King (Andheri Station East - Auto Stand)",
    short_name: "Jumbo King Andheri East",
    category: "cafes",
    subcategory: "Jumbo King Mumbai Burger Chain",
    spot_tier: "iconic",
    budget_tier: "free",
    approx_cost: "₹39–₹89 per burger",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Andheri East / Station Exit East",
    latitude: 19.11870,
    longitude: 72.84880,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Directly located at Andheri East station auto rickshaw stand exit.",
    hiddenness_score: 0.1,
    vibe_score: 0.87,
    safety_score: 0.95,
    accessibility_score: 0.99,
    crowd_level: 5,
    best_time_to_visit: "Commuter rush hours",
    description: "Quick-serve burger outlet at Andheri East railway station exit. Crispy corn and Schezwan potato burgers served in seconds to transit commuters.",
    vibe_tags: [
      "fast-food",
      "jumboking",
      "burger",
      "desi-burger",
      "andheri-east",
      "pocket-friendly",
      "quick-grab"
    ],
    photo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "jumbo king",
        name: "Jumbo King Andheri East",
        floor: "Station Exit 2",
        timing: "6:30 AM – 11:30 PM"
      }
    ]
  },
  {
    id: "ff-starbucks-andheri-lokhandwala",
    slug: "starbucks-andheri-west-lokhandwala",
    name: "Starbucks Flagship (Andheri West / Lokhandwala)",
    short_name: "Starbucks Lokhandwala",
    category: "cafes",
    subcategory: "Starbucks Specialty Coffee & Lounge",
    spot_tier: "iconic",
    budget_tier: "moderate",
    approx_cost: "₹250–₹500 coffees",
    price_level: 2,
    city: "Mumbai",
    neighborhood: "Andheri West / Lokhandwala Market",
    latitude: 19.14380,
    longitude: 72.82820,
    access_type: "commercial",
    safety_level: "high",
    safety_notes: "Prime Lokhandwala high street location with private security and outdoor seating.",
    hiddenness_score: 0.1,
    vibe_score: 0.95,
    safety_score: 0.98,
    accessibility_score: 0.96,
    crowd_level: 4,
    best_time_to_visit: "Afternoon work sessions & evening meetups (2:00 PM – 10:00 PM)",
    description: "The primary media and celebrity meeting lounge in Andheri West. Two levels of seating, iced caramel macchiatos, cold brews, and free Wi-Fi in the heart of Lokhandwala Complex.",
    vibe_tags: [
      "coffee",
      "starbucks",
      "lokhandwala",
      "andheri-west",
      "cafe",
      "media-hangout",
      "study-spot",
      "youth-adda"
    ],
    photo_url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "starbucks",
        name: "Starbucks Lokhandwala",
        floor: "Ground & 1st Floor",
        timing: "7:30 AM – 12:30 AM"
      }
    ]
  }
];

function seed() {
  console.log('Seeding Andheri Batch into Fastfood and Master places...');
  let ff = JSON.parse(fs.readFileSync(FF_FILE, 'utf8'));
  let master = JSON.parse(fs.readFileSync(MASTER_FILE, 'utf8'));

  let addedCount = 0;
  for (const place of ANDHERI_BATCH) {
    if (!ff.some(p => p.id === place.id)) {
      ff.push(place);
      addedCount++;
    }
    if (!master.some(p => p.id === place.id)) {
      master.push(place);
    }
  }

  fs.writeFileSync(FF_FILE, JSON.stringify(ff, null, 2), 'utf8');
  fs.writeFileSync(MASTER_FILE, JSON.stringify(master, null, 2), 'utf8');

  console.log(`Successfully added ${addedCount} verified Andheri fast-food venues.`);
  console.log(`fastfood.json count: ${ff.length}`);
  console.log(`master places_mumbai.json count: ${master.length}`);
}

seed();
