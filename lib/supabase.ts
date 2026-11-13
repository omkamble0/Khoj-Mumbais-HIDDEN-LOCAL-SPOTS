import { Place } from './types';
import { getAllPlaces, getPlaceById } from './places';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Fetch all places from Supabase Cloud Database with automatic edge caching
 * and zero-downtime fallback to local JSON file.
 */
export async function getPlacesFromDb(): Promise<Place[]> {
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const endpoint = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/places?select=*&order=id.asc`;
      const res = await fetch(endpoint, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
        // Edge CDN Cache on Vercel/Next.js for 1 hour (Instant response, zero database exhaustion)
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data as Place[];
        }
      } else {
        console.warn(`Supabase returned status ${res.status}, falling back to local dataset`);
      }
    } catch (error) {
      console.warn('Supabase fetch failed, gracefully falling back to local JSON:', error);
    }
  }

  // Multi-tier fallback to local disk / static bundle
  return getAllPlaces();
}

/**
 * Fetch a single place by ID or slug from Supabase or local fallback.
 */
export async function getPlaceByIdFromDb(id: string): Promise<Place | undefined> {
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const endpoint = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/places?or=(id.eq.${id},slug.eq.${id})&limit=1`;
      const res = await fetch(endpoint, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data[0] as Place;
        }
      }
    } catch (error) {
      console.warn('Supabase place by id failed, using fallback:', error);
    }
  }

  return getPlaceById(id);
}
