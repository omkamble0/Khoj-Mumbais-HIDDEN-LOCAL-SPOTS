const fs = require('fs');
const path = require('path');

const MASTER_FILE = path.join(__dirname, '..', 'data', 'places_mumbai.json');
const CAT_DIR = path.join(__dirname, '..', 'data', 'places_mumbai');
const GMAPS_CACHE_FILE = path.join(__dirname, '..', 'data', 'google_maps_cache.json');
const OSM_CACHE_FILE = path.join(__dirname, '..', 'data', 'osm_cache.json');

// Haversine formula to compute distance in meters
function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Load caches
let gmapsCache = {};
if (fs.existsSync(GMAPS_CACHE_FILE)) {
  try {
    gmapsCache = JSON.parse(fs.readFileSync(GMAPS_CACHE_FILE, 'utf8'));
  } catch (e) {
    gmapsCache = {};
  }
}

let osmCache = {};
if (fs.existsSync(OSM_CACHE_FILE)) {
  try {
    osmCache = JSON.parse(fs.readFileSync(OSM_CACHE_FILE, 'utf8'));
  } catch (e) {
    osmCache = {};
  }
}

function saveOsmCache() {
  fs.writeFileSync(OSM_CACHE_FILE, JSON.stringify(osmCache, null, 2), 'utf8');
}

// Mumbai Metropolitan Region Bounding Box
// West: 72.70, South: 18.80, East: 73.30, North: 19.55
function isInsideMMR(lat, lon) {
  return lat >= 18.75 && lat <= 19.55 && lon >= 72.70 && lon <= 73.35;
}

async function queryOSM(queryText) {
  if (osmCache[queryText] !== undefined) {
    return osmCache[queryText];
  }

  // Bounded to MMR viewbox
  const url =
    'https://nominatim.openstreetmap.org/search?q=' +
    encodeURIComponent(queryText) +
    '&format=json&limit=1&viewbox=72.70,19.55,73.35,18.75&bounded=1';

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'KhojMumbaiHybridRecalibrator/1.0 (travel@khojmumbai.local)',
      },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (data && data.length > 0) {
      const match = data[0];
      const lat = parseFloat(match.lat);
      const lon = parseFloat(match.lon);

      if (isInsideMMR(lat, lon)) {
        osmCache[queryText] = {
          name: match.display_name,
          latitude: lat,
          longitude: lon,
          type: match.type,
        };
      } else {
        osmCache[queryText] = { notFound: true, reason: 'outside_mmr' };
      }
    } else {
      osmCache[queryText] = { notFound: true };
    }

    return osmCache[queryText];
  } catch (err) {
    console.error(`Fetch exception for "${queryText}":`, err.message);
    return null;
  }
}

async function runHybridRecalibration() {
  console.log('=== KHOJ MUMBAI: HYBRID RECALIBRATION (GMAPS + OSM) ===');
  const master = JSON.parse(fs.readFileSync(MASTER_FILE, 'utf8'));
  console.log(`Total master places: ${master.length}`);

  let gmapsCount = 0;
  let osmRecalibrated = 0;
  let osmAccurate = 0;
  let unverifiedCount = 0;

  for (let i = 0; i < master.length; i++) {
    const p = master[i];

    // If already verified by Google Maps, skip to keep balance
    if (p.gmaps_verified) {
      gmapsCount++;
      continue;
    }

    // Try OSM with clean name + neighborhood
    const cleanName = p.name.replace(/[()]/g, ' ').replace(/\s+/g, ' ').trim();
    let query = `${cleanName} ${p.neighborhood || ''} Mumbai India`.replace(/\s+/g, ' ').trim();

    let result = await queryOSM(query);

    // Fallback search with just name + Mumbai if neighborhood search returned empty
    if (!result || result.notFound) {
      query = `${cleanName} Mumbai India`.replace(/\s+/g, ' ').trim();
      result = await queryOSM(query);
    }

    if (result && !result.notFound) {
      const dist = getDistanceMeters(p.latitude, p.longitude, result.latitude, result.longitude);

      // If within realistic threshold (< 12 km), apply recalibration
      if (dist > 150 && dist < 12000) {
        console.log(
          `[⚡ OSM RECALIBRATED] ${p.name} (${p.neighborhood}): drifted by ${Math.round(dist)}m -> snapped to (${result.latitude.toFixed(5)}, ${result.longitude.toFixed(5)})`
        );
        p.latitude = Number(result.latitude.toFixed(6));
        p.longitude = Number(result.longitude.toFixed(6));
        p.osm_verified = true;
        p.osm_name = result.name;
        osmRecalibrated++;
      } else if (dist <= 150) {
        p.osm_verified = true;
        osmAccurate++;
      } else {
        // Distance > 12km is likely an ambiguous homonym in another part of MMR; keep existing coordinates
        unverifiedCount++;
      }
    } else {
      unverifiedCount++;
    }

    // Save caches and master every 20 places
    if ((i + 1) % 20 === 0 || i === master.length - 1) {
      saveOsmCache();
      fs.writeFileSync(MASTER_FILE, JSON.stringify(master, null, 2), 'utf8');
      console.log(
        `Progress: ${i + 1}/${master.length} | GMaps: ${gmapsCount} | OSM Snapped: ${osmRecalibrated} | Accurate: ${osmAccurate} | Pending: ${unverifiedCount}`
      );
    }

    // Polite 1.1s rate limit for OSM Nominatim
    await new Promise((r) => setTimeout(r, 1100));
  }

  saveOsmCache();
  fs.writeFileSync(MASTER_FILE, JSON.stringify(master, null, 2), 'utf8');

  // Sync category files
  const masterMap = new Map(master.map((p) => [p.id, p]));
  const catFiles = fs.readdirSync(CAT_DIR).filter((f) => f.endsWith('.json'));

  for (const catFile of catFiles) {
    const fullPath = path.join(CAT_DIR, catFile);
    const catPlaces = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

    for (let j = 0; j < catPlaces.length; j++) {
      const updated = masterMap.get(catPlaces[j].id);
      if (updated) {
        catPlaces[j] = updated;
      }
    }

    fs.writeFileSync(fullPath, JSON.stringify(catPlaces, null, 2), 'utf8');
  }

  console.log(`\n=== HYBRID RECALIBRATION FINAL REPORT ===`);
  console.log(`Total Places: ${master.length}`);
  console.log(`Google Maps Verified & Snapped: ${gmapsCount}`);
  console.log(`OpenStreetMap Verified & Snapped: ${osmRecalibrated}`);
  console.log(`Verified Accurate within 150m: ${osmAccurate}`);
  console.log(`Remaining Micro-venues / Hidden Local Dives: ${unverifiedCount}`);
}

runHybridRecalibration().catch((err) => console.error('Fatal error in hybrid recalibration:', err));

