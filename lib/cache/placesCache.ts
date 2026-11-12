'use client';

import { Place } from '@/lib/types';

const DB_NAME = 'khoj_mumbai_cache_v1';
const STORE_NAME = 'places_store';
const META_KEY = 'places_meta';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

interface CacheMeta {
  timestamp: number;
  count: number;
  version: string;
}

/**
 * Open or initialize browser native IndexedDB for zero-latency offline caching.
 */
function openPlacesDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Read all places from device IndexedDB in <15ms.
 */
export async function getPlacesFromCache(): Promise<Place[] | null> {
  try {
    const metaStr = localStorage.getItem(META_KEY);
    if (!metaStr) return null;

    const meta: CacheMeta = JSON.parse(metaStr);
    const isExpired = Date.now() - meta.timestamp > CACHE_TTL_MS;
    if (isExpired) {
      return null;
    }

    const db = await openPlacesDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const places = req.result as Place[];
        if (Array.isArray(places) && places.length > 0) {
          resolve(places);
        } else {
          resolve(null);
        }
      };

      req.onerror = () => resolve(null);
    });
  } catch (err) {
    console.warn('IndexedDB read fallback:', err);
    return null;
  }
}

/**
 * Persist places to device IndexedDB asynchronously without blocking UI thread.
 */
export async function savePlacesToCache(places: Place[], version = '1.0'): Promise<void> {
  if (!places || places.length === 0) return;

  try {
    const db = await openPlacesDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    // Clear old records & insert fresh dataset
    store.clear();
    for (const place of places) {
      store.put(place);
    }

    tx.oncomplete = () => {
      const meta: CacheMeta = {
        timestamp: Date.now(),
        count: places.length,
        version,
      };
      localStorage.setItem(META_KEY, JSON.stringify(meta));
    };
  } catch (err) {
    console.warn('IndexedDB write fallback:', err);
  }
}
