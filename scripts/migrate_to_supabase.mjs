/**
 * KHOJ MUMBAI: Automated Supabase Cloud Uploader
 * 
 * Usage:
 *   node scripts/migrate_to_supabase.mjs <SUPABASE_URL> <SUPABASE_SERVICE_ROLE_KEY_OR_ANON_KEY>
 * 
 * Or set environment variables:
 *   SUPABASE_URL=https://xyz.supabase.co
 *   SUPABASE_KEY=eyJh...
 *   node scripts/migrate_to_supabase.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read arguments or environment variables
const supabaseUrl = process.argv[2] || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.argv[3] || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Missing Supabase credentials!');
  console.log('Usage: node scripts/migrate_to_supabase.mjs <SUPABASE_URL> <SUPABASE_KEY>');
  console.log('Example: node scripts/migrate_to_supabase.mjs https://xyz.supabase.co eyJhbGci...\n');
  process.exit(1);
}

const placesPath = path.resolve(__dirname, '../data/places_mumbai.json');
if (!fs.existsSync(placesPath)) {
  console.error(`❌ Could not find places file at: ${placesPath}`);
  process.exit(1);
}

const rawData = fs.readFileSync(placesPath, 'utf8');
const places = JSON.parse(rawData);

console.log(`\n🚀 Loaded ${places.length} spots from data/places_mumbai.json`);
console.log(`📡 Connecting to Supabase at: ${supabaseUrl}`);

// Clean & prepare rows matching schema
const rows = places.map((p) => ({
  id: p.id,
  slug: p.slug || p.id,
  name: p.name,
  short_name: p.short_name || null,
  category: p.category,
  subcategory: p.subcategory || null,
  spot_tier: p.spot_tier || 'underrated',
  city: p.city || 'Mumbai',
  neighborhood: p.neighborhood || null,
  latitude: Number(p.latitude),
  longitude: Number(p.longitude),
  access_type: p.access_type || 'public',
  safety_level: p.safety_level || 'high',
  safety_notes: p.safety_notes || null,
  hiddenness_score: p.hiddenness_score ?? 0.8,
  vibe_score: p.vibe_score ?? 0.9,
  safety_score: p.safety_score ?? 0.85,
  accessibility_score: p.accessibility_score ?? 0.8,
  crowd_level: p.crowd_level ?? 2,
  best_time_to_visit: p.best_time_to_visit || null,
  description: p.description || '',
  vibe_tags: Array.isArray(p.vibe_tags) ? p.vibe_tags : [],
  photo_url: p.photo_url || '',
  source: p.source || 'curated',
  budget_tier: p.budget_tier || 'pocket_friendly',
  approx_cost: p.approx_cost || null,
  price_level: p.price_level ?? 1,
}));

async function uploadInBatches() {
  const BATCH_SIZE = 50;
  const endpoint = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/places?on_conflict=id`;

  console.log(`📦 Uploading in batches of ${BATCH_SIZE}...`);

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify(batch),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`\n❌ Error uploading batch ${i / BATCH_SIZE + 1}:`, errText);
      process.exit(1);
    }

    console.log(`  ✓ Uploaded spots ${i + 1} to ${Math.min(i + BATCH_SIZE, rows.length)} of ${rows.length}`);
  }

  console.log('\n🎉 SUCCESS! All Mumbai hidden spots are live in your Supabase database!\n');
}

uploadInBatches().catch((err) => {
  console.error('\n❌ Migration failed:', err);
  process.exit(1);
});
