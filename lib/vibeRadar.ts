import { Place, PlaceCategory } from './types';

export type VibeTimeWindowId = 'morning' | 'afternoon' | 'sunset' | 'evening' | 'night';

export interface VibeTimeWindow {
  id: VibeTimeWindowId;
  label: string;
  tagline: string;
  icon: string;
  startHour: number;
  endHour: number;
  recommendedCategories: PlaceCategory[];
  accentColor: string; // Tailwind color class or hex
}

export const VIBE_WINDOWS: VibeTimeWindow[] = [
  {
    id: 'morning',
    label: 'Morning Calm',
    tagline: 'Sea-breeze promenades, quiet gardens, & sunrise heritage',
    icon: '🌅',
    startHour: 5,
    endHour: 11.5,
    recommendedCategories: ['walks', 'gardens', 'waterfront', 'heritage', 'spiritual'],
    accentColor: '#10b981', // Emerald
  },
  {
    id: 'afternoon',
    label: 'Afternoon Retreat',
    tagline: 'Cool AC cafes, quiet libraries, & indie art galleries',
    icon: '☀️',
    startHour: 11.5,
    endHour: 16.5,
    recommendedCategories: ['cafes', 'books', 'culture', 'bazaars'],
    accentColor: '#f59e0b', // Amber
  },
  {
    id: 'sunset',
    label: 'Golden Hour',
    tagline: 'Seafront sunsets, sea-fort ramparts, & cliffside viewpoints',
    icon: '🌇',
    startHour: 16.5,
    endHour: 19,
    recommendedCategories: ['viewpoints', 'waterfront', 'forts', 'cafes'],
    accentColor: '#ff3e18', // Vermilion
  },
  {
    id: 'evening',
    label: 'Evening Buzz',
    tagline: 'Permit room addas, crispy chakna, & bustling night walks',
    icon: '🍻',
    startHour: 19,
    endHour: 22.5,
    recommendedCategories: ['bars', 'bazaars', 'walks', 'cafes'],
    accentColor: '#8b5cf6', // Violet
  },
  {
    id: 'night',
    label: 'Midnight Haven',
    tagline: 'Late-night chill, rock karaoke, & breezy 24/7 seafronts',
    icon: '🌙',
    startHour: 22.5,
    endHour: 5,
    recommendedCategories: ['bars', 'waterfront'],
    accentColor: '#06b6d4', // Cyan
  },
];

/**
 * Returns current Mumbai / local time window and formatted time
 */
export function getCurrentVibeWindow(date = new Date()): {
  window: VibeTimeWindow;
  timeString: string;
  hourFraction: number;
} {
  // Use local hours + minutes as a decimal (e.g. 17:30 -> 17.5)
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const hourFraction = hours + minutes / 60;

  // Format 12-hour time string (e.g. "5:30 PM")
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const timeString = `${displayHours}:${displayMinutes} ${ampm}`;

  // Find matching window
  for (const win of VIBE_WINDOWS) {
    if (win.id === 'night') {
      // Handles overnight wrap-around (22.5 -> 24 and 0 -> 5)
      if (hourFraction >= win.startHour || hourFraction < win.endHour) {
        return { window: win, timeString, hourFraction };
      }
    } else if (hourFraction >= win.startHour && hourFraction < win.endHour) {
      return { window: win, timeString, hourFraction };
    }
  }

  // Fallback to sunset/evening
  return { window: VIBE_WINDOWS[2], timeString, hourFraction };
}

/**
 * Checks if a specific place is currently in its optimal "Peak Window"
 */
export function checkIsPlacePeakingNow(
  place: Place,
  currentWindow = getCurrentVibeWindow().window
): { isPeaking: boolean; badgeText: string; reason: string } {
  const b = (place.best_time_to_visit || '').toLowerCase();
  const desc = (place.description || '').toLowerCase();
  const tags = (place.vibe_tags || []).map((t) => t.toLowerCase());

  // Direct category alignment
  const isCategoryMatch = currentWindow.recommendedCategories.includes(place.category);

  // Time-of-day keyword matching
  let textMatch = false;
  let reason = '';

  if (currentWindow.id === 'morning') {
    if (
      b.includes('morning') ||
      b.includes('sunrise') ||
      b.includes('early') ||
      b.includes('6:00 am') ||
      b.includes('7:00 am') ||
      b.includes('dawn')
    ) {
      textMatch = true;
      reason = 'Peak morning serenity & clean sea breeze';
    }
  } else if (currentWindow.id === 'afternoon') {
    if (
      b.includes('afternoon') ||
      b.includes('midday') ||
      b.includes('lunch') ||
      b.includes('2:00 pm') ||
      b.includes('indoor')
    ) {
      textMatch = true;
      reason = 'Optimal afternoon refuge away from city heat';
    }
  } else if (currentWindow.id === 'sunset') {
    if (
      b.includes('sunset') ||
      b.includes('golden hour') ||
      b.includes('late afternoon') ||
      b.includes('5:00 pm') ||
      b.includes('5:30 pm') ||
      b.includes('6:00 pm') ||
      tags.includes('sunset') ||
      tags.includes('viewpoint')
    ) {
      textMatch = true;
      reason = 'Golden hour lighting & setting sun vista';
    }
  } else if (currentWindow.id === 'evening') {
    if (
      b.includes('evening') ||
      b.includes('post-work') ||
      b.includes('7:00 pm') ||
      b.includes('8:00 pm') ||
      b.includes('night') ||
      tags.includes('permit-room') ||
      tags.includes('dive-bar') ||
      tags.includes('bazaar')
    ) {
      textMatch = true;
      reason = 'Prime evening energy & swift table service';
    }
  } else if (currentWindow.id === 'night') {
    if (
      b.includes('late night') ||
      b.includes('midnight') ||
      b.includes('10:00 pm') ||
      b.includes('11:00 pm') ||
      tags.includes('karaoke') ||
      tags.includes('late-night') ||
      tags.includes('promenade')
    ) {
      textMatch = true;
      reason = 'Late night haven & nocturnal Mumbai pulse';
    }
  }

  const isPeaking = textMatch || isCategoryMatch;
  const badgeText = isPeaking ? `${currentWindow.icon} PEAK TIME NOW` : '';

  return {
    isPeaking,
    badgeText,
    reason: reason || `${currentWindow.label} favorite in ${place.neighborhood || place.city}`,
  };
}

/**
 * Serendipity Generator: Rasta Roulette roll algorithm
 */
export function rollRastaRoulette(
  places: Place[],
  options: {
    mode?: 'pure' | 'peaking' | 'hidden' | 'near';
    userLat?: number;
    userLng?: number;
    currentCategory?: PlaceCategory;
  } = {}
): Place | null {
  if (!places || places.length === 0) return null;

  const { mode = 'pure', currentCategory } = options;

  let candidatePool = [...places];

  // Optional category bias
  if (currentCategory && currentCategory !== 'all') {
    const categoryMatches = candidatePool.filter((p) => p.category === currentCategory);
    if (categoryMatches.length >= 3) {
      candidatePool = categoryMatches;
    }
  }

  if (mode === 'peaking') {
    const { window } = getCurrentVibeWindow();
    const peakingPool = candidatePool.filter((p) => checkIsPlacePeakingNow(p, window).isPeaking);
    if (peakingPool.length > 0) {
      candidatePool = peakingPool;
    }
  } else if (mode === 'hidden') {
    const hiddenPool = candidatePool.filter((p) => p.spot_tier === 'hidden_gem' || (p.hiddenness_score || 0) >= 0.7);
    if (hiddenPool.length > 0) {
      candidatePool = hiddenPool;
    }
  } else if (mode === 'near' && options.userLat && options.userLng) {
    // Sort by proximity and pick from closest 25 spots
    const sortedByDistance = [...candidatePool].sort((a, b) => {
      const distA = Math.hypot(a.latitude - options.userLat!, a.longitude - options.userLng!);
      const distB = Math.hypot(b.latitude - options.userLat!, b.longitude - options.userLng!);
      return distA - distB;
    });
    candidatePool = sortedByDistance.slice(0, 25);
  }

  const randomIndex = Math.floor(Math.random() * candidatePool.length);
  return candidatePool[randomIndex];
}

