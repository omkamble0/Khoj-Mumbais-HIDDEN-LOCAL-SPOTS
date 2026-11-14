const fs = require('fs');
const path = require('path');

const MASTER_FILE = path.join(__dirname, '..', 'data', 'places_mumbai.json');
const FF_FILE = path.join(__dirname, '..', 'data', 'places_mumbai', 'fastfood.json');

const MALAD_BATCH = [
  {
    id: "ff-mcd-malad-inorbit",
    slug: "mcdonalds-malad-inorbit-mall",
    name: "McDonald's (Malad West / Inorbit Mall)",
    short_name: "McD Inorbit Malad",
    category: "cafes",
    subcategory: "McDonald's Fast Food Outlet",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹99–₹299 combos",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Malad West / Inorbit Mall",
    latitude: 19.17285,
    longitude: 72.83615,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Premier suburban shopping mall with high security and multi-level parking.",
    hiddenness_score: 0.1,
    vibe_score: 0.94,
    safety_score: 0.98,
    accessibility_score: 0.99,
    crowd_level: 5,
    best_time_to_visit: "Afternoon lunch & weekend evenings (12:30 PM – 9:30 PM)",
    description: "Flagship McDonald's located in the vibrant food court of Inorbit Mall Malad. High-speed burger counters serving Big Spicy McSpicy, golden fries, and soft serves to shoppers and college students.",
    vibe_tags: [
      "fast-food",
      "mcd",
      "mcdonalds",
      "malad-west",
      "inorbit-mall",
      "link-road",
      "mall-hangout",
      "burgers",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1552895638-f7fe08d2f7d5?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "mcdonalds",
        name: "McDonald's Inorbit Mall Malad",
        floor: "Food Court, 2nd Floor",
        timing: "10:30 AM – 11:30 PM"
      }
    ]
  },
  {
    id: "ff-mcd-malad-infiniti",
    slug: "mcdonalds-malad-infiniti-mall",
    name: "McDonald's (Malad West / Infiniti Mall)",
    short_name: "McD Infiniti Malad",
    category: "cafes",
    subcategory: "McDonald's Fast Food Outlet",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹99–₹299 combos",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Malad West / Infiniti Mall",
    latitude: 19.18430,
    longitude: 72.83445,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Major entertainment destination mall on Link Road with 24/7 security.",
    hiddenness_score: 0.1,
    vibe_score: 0.93,
    safety_score: 0.98,
    accessibility_score: 0.98,
    crowd_level: 5,
    best_time_to_visit: "Post-movie hours & weekend evenings (2:00 PM – 10:00 PM)",
    description: "Bustling McDonald's outlet in Infiniti Mall Malad's sprawling food court. A favorite stop for families, youth, and moviegoers catching Hollywood and Bollywood flicks at PVR.",
    vibe_tags: [
      "fast-food",
      "mcd",
      "mcdonalds",
      "malad-west",
      "infiniti-mall",
      "link-road",
      "mindspace",
      "burgers",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1552895638-f7fe08d2f7d5?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "mcdonalds",
        name: "McDonald's Infiniti Mall Malad",
        floor: "Level 3 Food Court",
        timing: "11:00 AM – 11:30 PM"
      }
    ]
  },
  {
    id: "ff-mcd-malad-sv-road",
    slug: "mcdonalds-malad-west-sv-road-station",
    name: "McDonald's (Malad West / SV Road Station)",
    short_name: "McD Malad Station SV Rd",
    category: "cafes",
    subcategory: "McDonald's Fast Food Outlet",
    spot_tier: "iconic",
    budget_tier: "pocket_friendly",
    approx_cost: "₹99–₹299 combos",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Malad West / SV Road",
    latitude: 19.18625,
    longitude: 72.84755,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Very high footfall market road right outside Malad railway station.",
    hiddenness_score: 0.1,
    vibe_score: 0.89,
    safety_score: 0.96,
    accessibility_score: 0.99,
    crowd_level: 5,
    best_time_to_visit: "Evening commuter rush (5:00 PM – 10:30 PM)",
    description: "High-traffic standalone McDonald's on SV Road just 2 minutes walking distance from Malad West railway station. Perfect quick meal grab for suburban commuters and shoppers.",
    vibe_tags: [
      "fast-food",
      "mcd",
      "mcdonalds",
      "malad-west",
      "sv-road",
      "station-road",
      "commuter-hub",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1552895638-f7fe08d2f7d5?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "mcdonalds",
        name: "McDonald's Malad SV Road",
        floor: "Ground Floor",
        timing: "8:00 AM – 12:30 AM"
      }
    ]
  },
  {
    id: "ff-bk-malad-inorbit",
    slug: "burger-king-malad-inorbit-mall",
    name: "Burger King (Malad West / Inorbit Mall)",
    short_name: "Burger King Inorbit Malad",
    category: "cafes",
    subcategory: "Burger King Fast Food Outlet",
    spot_tier: "popular",
    budget_tier: "pocket_friendly",
    approx_cost: "₹129–₹349 meals",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Malad West / Inorbit Mall",
    latitude: 19.17290,
    longitude: 72.83620,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Inside Inorbit Mall food court with full amenities and security.",
    hiddenness_score: 0.1,
    vibe_score: 0.92,
    safety_score: 0.98,
    accessibility_score: 0.99,
    crowd_level: 4,
    best_time_to_visit: "Lunch & dinner rush (1:00 PM – 9:30 PM)",
    description: "Flame-grilled Whopper headquarters at Inorbit Mall Malad. Serves crispy chicken fries, veggie Whoppers, chocolate shakes, and fiery crunchy fries.",
    vibe_tags: [
      "fast-food",
      "burger-king",
      "bk",
      "inorbit-mall",
      "malad-west",
      "whopper",
      "link-road"
    ],
    photo_url: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "burger_king",
        name: "Burger King Inorbit Malad",
        floor: "Level 2 Food Court",
        timing: "10:30 AM – 11:30 PM"
      }
    ]
  },
  {
    id: "ff-bk-malad-infiniti",
    slug: "burger-king-malad-infiniti-mall",
    name: "Burger King (Malad West / Infiniti Mall)",
    short_name: "Burger King Infiniti Malad",
    category: "cafes",
    subcategory: "Burger King Fast Food Outlet",
    spot_tier: "popular",
    budget_tier: "pocket_friendly",
    approx_cost: "₹129–₹349 meals",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Malad West / Infiniti Mall",
    latitude: 19.18440,
    longitude: 72.83450,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Air-conditioned 3rd floor food court at Infiniti Mall.",
    hiddenness_score: 0.1,
    vibe_score: 0.91,
    safety_score: 0.98,
    accessibility_score: 0.98,
    crowd_level: 4,
    best_time_to_visit: "Evening movie crowds (4:00 PM – 10:00 PM)",
    description: "Popular flame-grilled burger outpost in Infiniti Mall Malad. Offering hot Peri Peri fries, Veggie Whopper combos, and creamy Oreo milkshakes.",
    vibe_tags: [
      "fast-food",
      "burger-king",
      "bk",
      "infiniti-mall",
      "malad-west",
      "mindspace",
      "whopper"
    ],
    photo_url: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "burger_king",
        name: "Burger King Infiniti Malad",
        floor: "3rd Floor Food Court",
        timing: "11:00 AM – 11:00 PM"
      }
    ]
  },
  {
    id: "ff-kfc-malad-inorbit",
    slug: "kfc-malad-inorbit-mall",
    name: "KFC (Malad West / Inorbit Mall)",
    short_name: "KFC Inorbit Malad",
    category: "cafes",
    subcategory: "KFC Fast Food Outlet",
    spot_tier: "popular",
    budget_tier: "pocket_friendly",
    approx_cost: "₹149–₹399 combos",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Malad West / Inorbit Mall",
    latitude: 19.17280,
    longitude: 72.83610,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Centrally monitored mall food court with heavy family footfall.",
    hiddenness_score: 0.1,
    vibe_score: 0.92,
    safety_score: 0.98,
    accessibility_score: 0.99,
    crowd_level: 5,
    best_time_to_visit: "Weekend lunches & family dinners (1:00 PM – 9:00 PM)",
    description: "Colonel Sanders' signature hot and crispy fried chicken, zinger burgers, and popcorn chicken buckets in the Inorbit Mall Malad food court.",
    vibe_tags: [
      "fast-food",
      "kfc",
      "fried-chicken",
      "zinger",
      "inorbit-mall",
      "malad-west",
      "link-road"
    ],
    photo_url: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "kfc",
        name: "KFC Inorbit Malad",
        floor: "Food Court, Level 2",
        timing: "11:00 AM – 11:30 PM"
      }
    ]
  },
  {
    id: "ff-kfc-malad-infiniti",
    slug: "kfc-malad-infiniti-mall",
    name: "KFC (Malad West / Infiniti Mall)",
    short_name: "KFC Infiniti Malad",
    category: "cafes",
    subcategory: "KFC Fast Food Outlet",
    spot_tier: "popular",
    budget_tier: "pocket_friendly",
    approx_cost: "₹149–₹399 combos",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Malad West / Infiniti Mall",
    latitude: 19.18435,
    longitude: 72.83455,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Inside Infiniti Mall Malad with 24/7 security and clean dining areas.",
    hiddenness_score: 0.1,
    vibe_score: 0.91,
    safety_score: 0.98,
    accessibility_score: 0.98,
    crowd_level: 4,
    best_time_to_visit: "Evening snacks & dinners (3:30 PM – 10:30 PM)",
    description: "Famous for original recipe drumsticks, zinger rice bowls, and peri-peri chicken tenders right beside the movie hall at Infiniti Mall Malad.",
    vibe_tags: [
      "fast-food",
      "kfc",
      "fried-chicken",
      "zinger",
      "infiniti-mall",
      "malad-west",
      "mindspace"
    ],
    photo_url: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "kfc",
        name: "KFC Infiniti Malad",
        floor: "Level 3 Food Court",
        timing: "11:00 AM – 11:00 PM"
      }
    ]
  },
  {
    id: "ff-tacobell-malad-inorbit",
    slug: "taco-bell-malad-inorbit-mall",
    name: "Taco Bell (Malad West / Inorbit Mall)",
    short_name: "Taco Bell Inorbit Malad",
    category: "cafes",
    subcategory: "Taco Bell Fast Food Outlet",
    spot_tier: "popular",
    budget_tier: "pocket_friendly",
    approx_cost: "₹149–₹399 meals",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Malad West / Inorbit Mall",
    latitude: 19.17295,
    longitude: 72.83625,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Top-tier shopping center food court with excellent hygiene and crowd management.",
    hiddenness_score: 0.1,
    vibe_score: 0.93,
    safety_score: 0.98,
    accessibility_score: 0.99,
    crowd_level: 4,
    best_time_to_visit: "Afternoon lunch & weekend evenings (1:00 PM – 9:00 PM)",
    description: "Signature Mexican-inspired quick service food featuring cheesy Gordita crunches, crunchy tacos, quesadillas, loaded nachos, and unlimited refills in Inorbit Malad.",
    vibe_tags: [
      "fast-food",
      "taco-bell",
      "mexican",
      "tacos",
      "nachos",
      "inorbit-mall",
      "malad-west"
    ],
    photo_url: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "taco_bell",
        name: "Taco Bell Inorbit Malad",
        floor: "Level 2 Food Court",
        timing: "11:00 AM – 11:00 PM"
      }
    ]
  },
  {
    id: "ff-subway-malad-inorbit",
    slug: "subway-malad-inorbit-mall",
    name: "Subway (Malad West / Inorbit Mall)",
    short_name: "Subway Inorbit Malad",
    category: "cafes",
    subcategory: "Subway Fast Food Outlet",
    spot_tier: "popular",
    budget_tier: "pocket_friendly",
    approx_cost: "₹149–₹349 meals",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Malad West / Inorbit Mall",
    latitude: 19.17275,
    longitude: 72.83605,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Clean, hygienic mall food court with custom ingredient assembly.",
    hiddenness_score: 0.1,
    vibe_score: 0.90,
    safety_score: 0.98,
    accessibility_score: 0.99,
    crowd_level: 3,
    best_time_to_visit: "Healthy lunch & post-shopping quick bites (12:00 PM – 8:00 PM)",
    description: "Freshly baked multigrain bread, garden vegetables, and custom subs. Popular for paneer tikka, turkey breast, roasted chicken strips, and freshly baked cookies.",
    vibe_tags: [
      "fast-food",
      "subway",
      "healthy-subs",
      "inorbit-mall",
      "malad-west",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "subway",
        name: "Subway Inorbit Malad",
        floor: "Food Court, 2nd Floor",
        timing: "10:30 AM – 11:00 PM"
      }
    ]
  },
  {
    id: "ff-subway-malad-mindspace",
    slug: "subway-malad-west-mindspace",
    name: "Subway (Malad West / Mindspace Tech Park)",
    short_name: "Subway Mindspace Malad",
    category: "cafes",
    subcategory: "Subway Fast Food Outlet",
    spot_tier: "popular",
    budget_tier: "pocket_friendly",
    approx_cost: "₹149–₹349 meals",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Malad West / Mindspace",
    latitude: 19.18020,
    longitude: 72.83380,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Prime corporate IT park promenade with round-the-clock security.",
    hiddenness_score: 0.1,
    vibe_score: 0.89,
    safety_score: 0.98,
    accessibility_score: 0.97,
    crowd_level: 4,
    best_time_to_visit: "Corporate weekday lunch hours (12:30 PM – 3:30 PM)",
    description: "Essential corporate lunch hub in Mindspace IT Park Malad West. Serves fresh toasted 6-inch subs, wraps, and salads to IT professionals and media executives.",
    vibe_tags: [
      "fast-food",
      "subway",
      "mindspace",
      "corporate-lunch",
      "malad-west",
      "healthy"
    ],
    photo_url: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "subway",
        name: "Subway Mindspace Malad",
        floor: "Ground Floor, Commercial Wing",
        timing: "9:00 AM – 11:00 PM"
      }
    ]
  },
  {
    id: "ff-dominos-malad-inorbit",
    slug: "dominos-malad-inorbit-mall",
    name: "Domino's Pizza (Malad West / Inorbit Mall)",
    short_name: "Domino's Inorbit Malad",
    category: "cafes",
    subcategory: "Domino's Pizza Fast Food Outlet",
    spot_tier: "popular",
    budget_tier: "pocket_friendly",
    approx_cost: "₹199–₹499 pizzas",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Malad West / Inorbit Mall",
    latitude: 19.17288,
    longitude: 72.83618,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Located inside Inorbit Mall food court.",
    hiddenness_score: 0.1,
    vibe_score: 0.91,
    safety_score: 0.98,
    accessibility_score: 0.99,
    crowd_level: 4,
    best_time_to_visit: "Family lunch & movie snacks (1:00 PM – 9:30 PM)",
    description: "Express Domino's counter inside Inorbit Mall serving hot Cheese Burst pizzas, Garlic Breadsticks, and choco lava cakes in rapid order.",
    vibe_tags: [
      "fast-food",
      "dominos",
      "pizza",
      "inorbit-mall",
      "malad-west",
      "cheese-burst",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "dominos",
        name: "Domino's Pizza Inorbit Malad",
        floor: "2nd Floor Food Court",
        timing: "11:00 AM – 11:00 PM"
      }
    ]
  },
  {
    id: "ff-dominos-malad-orlem",
    slug: "dominos-malad-west-orlem",
    name: "Domino's Pizza (Malad West / Orlem)",
    short_name: "Domino's Orlem Malad",
    category: "cafes",
    subcategory: "Domino's Pizza Fast Food Outlet",
    spot_tier: "popular",
    budget_tier: "pocket_friendly",
    approx_cost: "₹199–₹499 pizzas",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Malad West / Orlem",
    latitude: 19.19120,
    longitude: 72.83660,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Peaceful, active residential neighborhood of Orlem near Lourdes Church.",
    hiddenness_score: 0.1,
    vibe_score: 0.90,
    safety_score: 0.97,
    accessibility_score: 0.96,
    crowd_level: 3,
    best_time_to_visit: "Dinner hangout & late night pizza orders (7:00 PM – 11:30 PM)",
    description: "Beloved neighborhood Domino's dine-in spot on Marve Road in Orlem. A go-to evening hub for local youth and families craving hot cheese burst pizzas and pasta bowls.",
    vibe_tags: [
      "fast-food",
      "dominos",
      "pizza",
      "orlem",
      "malad-west",
      "marve-road",
      "neighborhood-favorite"
    ],
    photo_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "dominos",
        name: "Domino's Pizza Orlem",
        floor: "Ground Floor, Marve Road",
        timing: "10:30 AM – Midnight"
      }
    ]
  },
  {
    id: "ff-dominos-malad-east",
    slug: "dominos-malad-east-daftary-road",
    name: "Domino's Pizza (Malad East / Daftary Road)",
    short_name: "Domino's Malad East",
    category: "cafes",
    subcategory: "Domino's Pizza Fast Food Outlet",
    spot_tier: "popular",
    budget_tier: "pocket_friendly",
    approx_cost: "₹199–₹499 pizzas",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Malad East / Daftary Road",
    latitude: 19.18480,
    longitude: 72.85620,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Bustling residential hub near station flyover and Daftary Road.",
    hiddenness_score: 0.1,
    vibe_score: 0.88,
    safety_score: 0.96,
    accessibility_score: 0.97,
    crowd_level: 4,
    best_time_to_visit: "Evening dinners & weekend gatherings (6:00 PM – 11:00 PM)",
    description: "Main Domino's pizza outlet serving the dense residential belt of Malad East. Hot farm fresh pizzas, garlic breadsticks, and quick doorstep deliveries.",
    vibe_tags: [
      "fast-food",
      "dominos",
      "pizza",
      "malad-east",
      "daftary-road",
      "family-dining",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "dominos",
        name: "Domino's Pizza Malad East",
        floor: "Ground Floor",
        timing: "11:00 AM – 11:30 PM"
      }
    ]
  },
  {
    id: "ff-pizzahut-malad-infiniti",
    slug: "pizza-hut-malad-infiniti-mall",
    name: "Pizza Hut (Malad West / Infiniti Mall)",
    short_name: "Pizza Hut Infiniti Malad",
    category: "cafes",
    subcategory: "Pizza Hut Fast Food Outlet",
    spot_tier: "popular",
    budget_tier: "pocket_friendly",
    approx_cost: "₹199–₹499 pan pizzas",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Malad West / Infiniti Mall",
    latitude: 19.18425,
    longitude: 72.83440,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Well-regulated indoor food court at Infiniti Mall.",
    hiddenness_score: 0.1,
    vibe_score: 0.90,
    safety_score: 0.98,
    accessibility_score: 0.98,
    crowd_level: 4,
    best_time_to_visit: "Lunch & movie nights (1:00 PM – 9:30 PM)",
    description: "Famous deep-dish pan pizza outlet in Infiniti Mall Malad. Serving classic stuffed-crust margherita, pepperoni, spicy chicken sausage, and garlic bread.",
    vibe_tags: [
      "fast-food",
      "pizza-hut",
      "pan-pizza",
      "infiniti-mall",
      "malad-west",
      "mindspace"
    ],
    photo_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "pizza_hut",
        name: "Pizza Hut Infiniti Malad",
        floor: "Level 3 Food Court",
        timing: "11:00 AM – 11:00 PM"
      }
    ]
  },
  {
    id: "ff-pizzahut-malad-evershine",
    slug: "pizza-hut-malad-west-evershine-nagar",
    name: "Pizza Hut (Malad West / Evershine Nagar)",
    short_name: "Pizza Hut Evershine Nagar",
    category: "cafes",
    subcategory: "Pizza Hut Fast Food Outlet",
    spot_tier: "popular",
    budget_tier: "pocket_friendly",
    approx_cost: "₹199–₹499 pan pizzas",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Malad West / Evershine Nagar",
    latitude: 19.18150,
    longitude: 72.83780,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Wide avenue in Evershine Nagar with safe neighborhood dining.",
    hiddenness_score: 0.1,
    vibe_score: 0.89,
    safety_score: 0.97,
    accessibility_score: 0.97,
    crowd_level: 3,
    best_time_to_visit: "Evening dinners & birthday parties (5:30 PM – 10:30 PM)",
    description: "Spacious standalone dine-in Pizza Hut in Evershine Nagar Malad West. Serves freshly baked stuffed crust pan pizzas, cheesy pasta bowls, and mocktails.",
    vibe_tags: [
      "fast-food",
      "pizza-hut",
      "evershine-nagar",
      "malad-west",
      "pan-pizza",
      "dine-in"
    ],
    photo_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "pizza_hut",
        name: "Pizza Hut Evershine Nagar",
        floor: "Ground Floor",
        timing: "11:00 AM – 11:30 PM"
      }
    ]
  },
  {
    id: "ff-jumboking-malad-station-west",
    slug: "jumboking-malad-west-station",
    name: "Jumbo King (Malad West / Station Road)",
    short_name: "Jumbo King Malad West",
    category: "cafes",
    subcategory: "Jumbo King Fast Food Outlet",
    spot_tier: "budget_gem",
    budget_tier: "pocket_friendly",
    approx_cost: "₹49–₹149 vada pav burgers",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Malad West / Station Road",
    latitude: 19.18685,
    longitude: 72.84805,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Massive passenger flow right at Malad railway station platform 1 exit.",
    hiddenness_score: 0.1,
    vibe_score: 0.87,
    safety_score: 0.95,
    accessibility_score: 1.0,
    crowd_level: 5,
    best_time_to_visit: "Morning rush & evening return hours (8:00 AM – 10:30 PM)",
    description: "The premier on-the-go snack stop right outside Malad West railway station. Serving piping-hot cheese grilled jumbo vada pavs, peri-peri burgers, and cold thick shakes.",
    vibe_tags: [
      "fast-food",
      "jumboking",
      "vada-pav-burger",
      "malad-west",
      "station-rush",
      "pocket-friendly",
      "mumbai-local"
    ],
    photo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "jumbo_king",
        name: "Jumbo King Malad West Station",
        floor: "Station Road Exit",
        timing: "7:30 AM – 11:30 PM"
      }
    ]
  },
  {
    id: "ff-jumboking-malad-station-east",
    slug: "jumboking-malad-east-station",
    name: "Jumbo King (Malad East / Station Road)",
    short_name: "Jumbo King Malad East",
    category: "cafes",
    subcategory: "Jumbo King Fast Food Outlet",
    spot_tier: "budget_gem",
    budget_tier: "pocket_friendly",
    approx_cost: "₹49–₹149 vada pav burgers",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Malad East / Station Approach",
    latitude: 19.18560,
    longitude: 72.85310,
    access_type: "public",
    safety_level: "high",
    safety_notes: "Busy bus station and commuter transit point.",
    hiddenness_score: 0.1,
    vibe_score: 0.86,
    safety_score: 0.95,
    accessibility_score: 1.0,
    crowd_level: 5,
    best_time_to_visit: "Commuter transit hours (8:00 AM – 10:00 PM)",
    description: "Crucial commuter fast food stall directly outside Malad East railway station and auto stand. Quick-served hot grilled vada pav burgers and cold drinks.",
    vibe_tags: [
      "fast-food",
      "jumboking",
      "vada-pav-burger",
      "malad-east",
      "commuter-hub",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "jumbo_king",
        name: "Jumbo King Malad East Station",
        floor: "Ground Level, Station Approach",
        timing: "7:30 AM – 11:00 PM"
      }
    ]
  },
  {
    id: "ff-tibbs-malad-station-west",
    slug: "tibbs-frankie-malad-west-station",
    name: "Tibbs Frankie (Malad West / Station Road)",
    short_name: "Tibbs Frankie Malad West",
    category: "cafes",
    subcategory: "Tibbs Frankie Fast Food Outlet",
    spot_tier: "budget_gem",
    budget_tier: "pocket_friendly",
    approx_cost: "₹70–₹160 roll",
    price_level: 1,
    city: "Mumbai",
    neighborhood: "Malad West / Station Road",
    latitude: 19.18670,
    longitude: 72.84815,
    access_type: "public",
    safety_level: "high",
    safety_notes: "High vibrancy station commercial street.",
    hiddenness_score: 0.1,
    vibe_score: 0.88,
    safety_score: 0.95,
    accessibility_score: 1.0,
    crowd_level: 5,
    best_time_to_visit: "Evening frankie time (4:30 PM – 10:00 PM)",
    description: "The original Mumbai frankie pioneers near Malad West station. Soft roti wraps spiced with signature Tibbs masala, chopped onions, chicken bhuna, or paneer chili.",
    vibe_tags: [
      "fast-food",
      "tibbs",
      "frankie",
      "rolls",
      "malad-west",
      "station-food",
      "pocket-friendly"
    ],
    photo_url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "tibbs_frankie",
        name: "Tibbs Frankie Malad West Station",
        floor: "Station Road Counter",
        timing: "11:00 AM – 11:00 PM"
      }
    ]
  },
  {
    id: "ff-starbucks-malad-inorbit",
    slug: "starbucks-malad-inorbit-mall",
    name: "Starbucks (Malad West / Inorbit Mall)",
    short_name: "Starbucks Inorbit Malad",
    category: "cafes",
    subcategory: "Starbucks Coffee House",
    spot_tier: "popular",
    budget_tier: "moderate",
    approx_cost: "₹250–₹500 coffee & bakes",
    price_level: 2,
    city: "Mumbai",
    neighborhood: "Malad West / Inorbit Mall",
    latitude: 19.17292,
    longitude: 72.83612,
    access_type: "commercial",
    safety_level: "high",
    safety_notes: "Ground level flagship cafe with direct mall and porch entry.",
    hiddenness_score: 0.1,
    vibe_score: 0.95,
    safety_score: 0.98,
    accessibility_score: 0.99,
    crowd_level: 4,
    best_time_to_visit: "Morning coffee & afternoon discussions (10:00 AM – 8:30 PM)",
    description: "Sleek and spacious Starbucks flagship on the ground floor of Inorbit Mall Malad. Features comfortable armchairs, artisanal pour-overs, nitro cold brews, and Java Chip Frappuccinos.",
    vibe_tags: [
      "coffee",
      "starbucks",
      "inorbit-mall",
      "malad-west",
      "cafe",
      "work-friendly",
      "youth-adda"
    ],
    photo_url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "starbucks",
        name: "Starbucks Inorbit Malad",
        floor: "Ground Floor, Entrance Courtyard",
        timing: "8:00 AM – 11:30 PM"
      }
    ]
  },
  {
    id: "ff-starbucks-malad-mindspace",
    slug: "starbucks-malad-west-mindspace",
    name: "Starbucks (Malad West / Mindspace Paradigm)",
    short_name: "Starbucks Mindspace Malad",
    category: "cafes",
    subcategory: "Starbucks Coffee House",
    spot_tier: "popular",
    budget_tier: "moderate",
    approx_cost: "₹250–₹500 coffee & bakes",
    price_level: 2,
    city: "Mumbai",
    neighborhood: "Malad West / Mindspace",
    latitude: 19.18040,
    longitude: 72.83395,
    access_type: "commercial",
    safety_level: "high",
    safety_notes: "Gated IT park corporate boulevard with security.",
    hiddenness_score: 0.1,
    vibe_score: 0.94,
    safety_score: 0.98,
    accessibility_score: 0.98,
    crowd_level: 4,
    best_time_to_visit: "Work hours & evening unwind (9:00 AM – 9:00 PM)",
    description: "High-energy coffeehouse nestled inside Mindspace Malad. Equipped with fast Wi-Fi and power outlets, making it the favorite workspace for techies, freelancers, and media professionals.",
    vibe_tags: [
      "coffee",
      "starbucks",
      "mindspace",
      "malad-west",
      "cafe",
      "work-friendly",
      "freelance-hub"
    ],
    photo_url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1000&auto=format&fit=crop&q=80",
    source: "curated_fastfood_network",
    verification_status: "verified",
    outlets: [
      {
        brand: "starbucks",
        name: "Starbucks Mindspace Malad",
        floor: "Ground Floor, Building 1",
        timing: "8:00 AM – 11:00 PM"
      }
    ]
  }
];

function seed() {
  console.log('Seeding Malad Batch into Fastfood and Master places...');
  let ff = JSON.parse(fs.readFileSync(FF_FILE, 'utf8'));
  let master = JSON.parse(fs.readFileSync(MASTER_FILE, 'utf8'));

  let addedCount = 0;
  for (const place of MALAD_BATCH) {
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

  console.log(`Successfully added ${addedCount} verified Malad fast-food venues.`);
  console.log(`fastfood.json count: ${ff.length}`);
  console.log(`master places_mumbai.json count: ${master.length}`);
}

seed();
