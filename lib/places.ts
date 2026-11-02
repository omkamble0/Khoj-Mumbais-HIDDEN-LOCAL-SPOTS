import fs from 'fs';
import path from 'path';
import { Place, PlaceCategory } from './types';

// Statically bundled fallback for zero-failure reliability in serverless/webpack
import fallbackPlaces from '../data/places_mumbai.json';

const MUMBAI_DIR = path.join(process.cwd(), 'data', 'places_mumbai');
const SINGLE_FILE = path.join(process.cwd(), 'data', 'places_mumbai.json');

/**
 * Loads all places across modular category files in data/places_mumbai/*.json
 * With multi-layer fallback to single JSON and statically bundled JSON.
 */
export function getAllPlaces(): Place[] {
  try {
    // 1. Try reading modular directory
    if (fs.existsSync(MUMBAI_DIR)) {
      const files = fs.readdirSync(MUMBAI_DIR).filter((f) => f.endsWith('.json'));
      if (files.length > 0) {
        let allPlaces: Place[] = [];
        for (const file of files) {
          const filePath = path.join(MUMBAI_DIR, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          try {
            const parsed: Place[] = JSON.parse(content);
            allPlaces = allPlaces.concat(parsed);
          } catch (err) {
            console.error(`Error parsing ${file}:`, err);
          }
        }
        if (allPlaces.length > 0) {
          return allPlaces;
        }
      }
    }

    // 2. Fallback to single file on disk
    if (fs.existsSync(SINGLE_FILE)) {
      const content = fs.readFileSync(SINGLE_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error loading places from disk:', error);
  }

  // 3. Guaranteed fallback: statically bundled JSON
  return (fallbackPlaces as Place[]) || [];
}

/**
 * Finds a single place by ID or slug
 */
export function getPlaceById(id: string): Place | undefined {
  const places = getAllPlaces();
  return places.find((p) => p.id === id || p.slug === id);
}

/**
 * Filters places by category
 */
export function getPlacesByCategory(category: PlaceCategory): Place[] {
  const places = getAllPlaces();
  if (category === 'all') return places;
  return places.filter((p) => p.category === category);
}

/**
 * Regenerates the combined places_mumbai.json for backward compatibility or exports
 */
export function syncCombinedPlacesJson(): void {
  try {
    const places = getAllPlaces();
    if (places.length > 0) {
      fs.writeFileSync(SINGLE_FILE, JSON.stringify(places, null, 2), 'utf-8');
    }
  } catch (error) {
    console.error('Error syncing combined places json:', error);
  }
}

