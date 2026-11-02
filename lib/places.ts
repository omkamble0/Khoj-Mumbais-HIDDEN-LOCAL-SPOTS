import fs from 'fs';
import path from 'path';
import { Place, PlaceCategory } from './types';

const MUMBAI_DIR = path.join(process.cwd(), 'data', 'places_mumbai');
const SINGLE_FILE = path.join(process.cwd(), 'data', 'places_mumbai.json');

/**
 * Loads all places across modular category files in data/places_mumbai/*.json
 * Fallback to data/places_mumbai.json if the directory is missing.
 */
export function getAllPlaces(): Place[] {
  try {
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
        return allPlaces;
      }
    }

    // Fallback to legacy single file
    if (fs.existsSync(SINGLE_FILE)) {
      const content = fs.readFileSync(SINGLE_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Error loading places:', error);
  }

  return [];
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
