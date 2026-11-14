const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyA6Ev35vqkwEWyAJOkEC1fU_g8UR8iZXfk';
const CACHE_FILE = path.join(__dirname, '..', 'data', 'google_maps_cache.json');
const MASTER_FILE = path.join(__dirname, '..', 'data', 'places_mumbai.json');
const CAT_DIR = path.join(__dirname, '..', 'data', 'places_mumbai');

// Haversine formula to calculate distance in meters
function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // metres
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

// Load cache
let cache = {};
if (fs.existsSync(CACHE_FILE)) {
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    console.log(`Loaded ${Object.keys(cache).length} entries from cache.`);
  } catch (e) {
    cache = {};
  }
}

function saveCache() {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
}

async function queryGooglePlaces(queryText) {
  if (cache[queryText]) {
    return cache[queryText];
  }

  const url = 'https://places.googleapis.com/v1/places:searchText';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.businessStatus',
      },
      body: JSON.stringify({
        textQuery: queryText,
        maxResultCount: 1,
        locationBias: {
          circle: {
            center: { latitude: 19.076, longitude: 72.8777 },
            radius: 50000.0, // 50km radius around Mumbai
          },
        },
      }),
    });

    if (res.status === 429) {
      console.warn('Rate limit hit (429)! Saving cache and pausing...');
      saveCache();
      return null;
    }

    if (!res.ok) {
      console.error(`HTTP error ${res.status} for query: "${queryText}"`);
      return null;
    }

    const data = await res.json();
    const place = data.places && data.places.length > 0 ? data.places[0] : null;

    cache[queryText] = place ? {
      id: place.id,
      name: place.displayName?.text,
      address: place.formattedAddress,
      latitude: place.location?.latitude,
      longitude: place.location?.longitude,
      businessStatus: place.businessStatus,
    } : { notFound: true };

    return cache[queryText];
  } catch (err) {
    console.error(`Fetch exception for "${queryText}":`, err.message);
    return null;
  }
}

async function main() {
  console.log('=== KHOJ MUMBAI: GOOGLE MAPS RECALIBRATION & AUDIT ===');
  const master = JSON.parse(fs.readFileSync(MASTER_FILE, 'utf8'));
  console.log(`Loaded ${master.length} master places.`);

  let recalibrated = 0;
  let exactMatches = 0;
  let notFoundCount = 0;
  let closedCount = 0;
  let skipped = 0;

  // Let's process in batches and save cache regularly
  for (let i = 0; i < master.length; i++) {
    const p = master[i];
    
    // Construct clean search query
    // Clean out parentheticals that might confuse search e.g. "McDonald's (Carter Road)" -> "McDonald's Carter Road Mumbai"
    const cleanName = p.name.replace(/[()]/g, ' ').replace(/\s+/g, ' ').trim();
    const query = `${cleanName} ${p.neighborhood || ''} Mumbai India`.replace(/\s+/g, ' ').trim();

    const gPlace = await queryGooglePlaces(query);

    if (gPlace === null) {
      console.log(`Paused at index ${i}/${master.length}.`);
      break;
    }

    if (gPlace.notFound) {
      console.log(`[?] NOT FOUND on Google Maps: "${p.name}" (${p.neighborhood})`);
      notFoundCount++;
    } else {
      if (gPlace.businessStatus === 'CLOSED_PERMANENTLY') {
        console.log(`[X] CLOSED PERMANENTLY: "${p.name}" -> ${gPlace.address}`);
        closedCount++;
      }

      const dist = getDistanceMeters(p.latitude, p.longitude, gPlace.latitude, gPlace.longitude);

      if (dist > 150) {
        console.log(
          `[⚡ RECALIBRATED] ${p.name} (${p.neighborhood}): drifted by ${Math.round(dist)}m -> snapped to (${gPlace.latitude.toFixed(5)}, ${gPlace.longitude.toFixed(5)})`
        );
        p.latitude = Number(gPlace.latitude.toFixed(6));
        p.longitude = Number(gPlace.longitude.toFixed(6));
        p.gmaps_verified = true;
        p.gmaps_place_id = gPlace.id;
        p.gmaps_address = gPlace.address;
        recalibrated++;
      } else {
        p.gmaps_verified = true;
        p.gmaps_place_id = gPlace.id;
        p.gmaps_address = gPlace.address;
        exactMatches++;
      }
    }

    // Save cache every 25 queries
    if ((i + 1) % 25 === 0 || i === master.length - 1) {
      saveCache();
      console.log(`Progress: ${i + 1}/${master.length} (${recalibrated} recalibrated, ${exactMatches} verified accurate).`);
    }

    // Gentle pacing (50ms) to prevent burst limits
    await new Promise((r) => setTimeout(r, 60));
  }

  saveCache();

  // Save back updated master places
  fs.writeFileSync(MASTER_FILE, JSON.stringify(master, null, 2), 'utf8');
  console.log(`Saved updated master places to ${MASTER_FILE}`);

  // Synchronize category files
  const masterMap = new Map(master.map((p) => [p.id, p]));
  const catFiles = fs.readdirSync(CAT_DIR).filter((f) => f.endsWith('.json'));

  for (const catFile of catFiles) {
    const fullPath = path.join(CAT_DIR, catFile);
    const catPlaces = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    let catUpdated = 0;

    for (let j = 0; j < catPlaces.length; j++) {
      const updated = masterMap.get(catPlaces[j].id);
      if (updated) {
        catPlaces[j] = updated;
        catUpdated++;
      }
    }

    fs.writeFileSync(fullPath, JSON.stringify(catPlaces, null, 2), 'utf8');
  }

  console.log(`\n=== AUDIT SUMMARY ===`);
  console.log(`Total Places Checked: ${master.length}`);
  console.log(`Recalibrated Coordinates (>150m drift): ${recalibrated}`);
  console.log(`Verified Accurate (within 150m): ${exactMatches}`);
  console.log(`Not Found / Needs Review: ${notFoundCount}`);
  console.log(`Permanently Closed: ${closedCount}`);
}

main().catch((err) => console.error('Fatal error in main:', err));

