import { ZodiacSign } from '../types';

// Zodiac glyphs (unicode astrological symbols)
export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    id: 'aries',
    name: 'Aries',
    symbol: '\u2648',
    element: 'Fire',
    dateRange: 'Mar 21 – Apr 19',
    startMonth: 3,
    startDay: 21,
    endMonth: 4,
    endDay: 19,
    cellSaltId: 'kali-phos',
    rulingPlanet: 'Mars',
  },
  {
    id: 'taurus',
    name: 'Taurus',
    symbol: '\u2649',
    element: 'Earth',
    dateRange: 'Apr 20 – May 20',
    startMonth: 4,
    startDay: 20,
    endMonth: 5,
    endDay: 20,
    cellSaltId: 'nat-sulph',
    rulingPlanet: 'Venus',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    symbol: '\u264A',
    element: 'Air',
    dateRange: 'May 21 – Jun 20',
    startMonth: 5,
    startDay: 21,
    endMonth: 6,
    endDay: 20,
    cellSaltId: 'kali-mur',
    rulingPlanet: 'Mercury',
  },
  {
    id: 'cancer',
    name: 'Cancer',
    symbol: '\u264B',
    element: 'Water',
    dateRange: 'Jun 21 – Jul 22',
    startMonth: 6,
    startDay: 21,
    endMonth: 7,
    endDay: 22,
    cellSaltId: 'calc-fluor',
    rulingPlanet: 'Moon',
  },
  {
    id: 'leo',
    name: 'Leo',
    symbol: '\u264C',
    element: 'Fire',
    dateRange: 'Jul 23 – Aug 22',
    startMonth: 7,
    startDay: 23,
    endMonth: 8,
    endDay: 22,
    cellSaltId: 'mag-phos',
    rulingPlanet: 'Sun',
  },
  {
    id: 'virgo',
    name: 'Virgo',
    symbol: '\u264D',
    element: 'Earth',
    dateRange: 'Aug 23 – Sep 22',
    startMonth: 8,
    startDay: 23,
    endMonth: 9,
    endDay: 22,
    cellSaltId: 'kali-sulph',
    rulingPlanet: 'Mercury',
  },
  {
    id: 'libra',
    name: 'Libra',
    symbol: '\u264E',
    element: 'Air',
    dateRange: 'Sep 23 – Oct 22',
    startMonth: 9,
    startDay: 23,
    endMonth: 10,
    endDay: 22,
    cellSaltId: 'nat-phos',
    rulingPlanet: 'Venus',
  },
  {
    id: 'scorpio',
    name: 'Scorpio',
    symbol: '\u264F',
    element: 'Water',
    dateRange: 'Oct 23 – Nov 21',
    startMonth: 10,
    startDay: 23,
    endMonth: 11,
    endDay: 21,
    cellSaltId: 'calc-sulph',
    rulingPlanet: 'Pluto',
  },
  {
    id: 'sagittarius',
    name: 'Sagittarius',
    symbol: '\u2650',
    element: 'Fire',
    dateRange: 'Nov 22 – Dec 21',
    startMonth: 11,
    startDay: 22,
    endMonth: 12,
    endDay: 21,
    cellSaltId: 'silicea',
    rulingPlanet: 'Jupiter',
  },
  {
    id: 'capricorn',
    name: 'Capricorn',
    symbol: '\u2651',
    element: 'Earth',
    dateRange: 'Dec 22 – Jan 19',
    startMonth: 12,
    startDay: 22,
    endMonth: 1,
    endDay: 19,
    cellSaltId: 'calc-phos',
    rulingPlanet: 'Saturn',
  },
  {
    id: 'aquarius',
    name: 'Aquarius',
    symbol: '\u2652',
    element: 'Air',
    dateRange: 'Jan 20 – Feb 18',
    startMonth: 1,
    startDay: 20,
    endMonth: 2,
    endDay: 18,
    cellSaltId: 'nat-mur',
    rulingPlanet: 'Uranus',
  },
  {
    id: 'pisces',
    name: 'Pisces',
    symbol: '\u2653',
    element: 'Water',
    dateRange: 'Feb 19 – Mar 20',
    startMonth: 2,
    startDay: 19,
    endMonth: 3,
    endDay: 20,
    cellSaltId: 'ferr-phos',
    rulingPlanet: 'Neptune',
  },
];

export const ZODIAC_MAP: Record<string, ZodiacSign> = ZODIAC_SIGNS.reduce(
  (acc, sign) => {
    acc[sign.id] = sign;
    return acc;
  },
  {} as Record<string, ZodiacSign>
);

export const ELEMENT_COLORS: Record<string, string> = {
  Fire: '#E4572E',
  Earth: '#4F7942',
  Air: '#8CA6C9',
  Water: '#2A6F97',
};

/**
 * Given a birth date, determine the zodiac sign (handles year-wrapping
 * signs like Capricorn which spans Dec 22 -> Jan 19).
 */
export function getZodiacSignForDate(date: Date): ZodiacSign {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (const sign of ZODIAC_SIGNS) {
    if (sign.startMonth === sign.endMonth) {
      if (month === sign.startMonth && day >= sign.startDay && day <= sign.endDay) {
        return sign;
      }
    } else if (sign.startMonth > sign.endMonth) {
      // Wraps around year end (Capricorn)
      if (
        (month === sign.startMonth && day >= sign.startDay) ||
        (month === sign.endMonth && day <= sign.endDay)
      ) {
        return sign;
      }
    } else {
      if (
        (month === sign.startMonth && day >= sign.startDay) ||
        (month === sign.endMonth && day <= sign.endDay) ||
        (month > sign.startMonth && month < sign.endMonth)
      ) {
        return sign;
      }
    }
  }

  // Fallback (should never happen with valid data)
  return ZODIAC_SIGNS[0];
}
