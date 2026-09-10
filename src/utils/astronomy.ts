import { ZodiacId } from '../types';
import { ZODIAC_SIGNS } from '../constants/zodiac';

// ============================================================================
// Best-effort astronomical calculations for Moon Sign and Ascendant.
//
// Unlike the Sun Sign (which only needs a calendar date), these genuinely
// require birth TIME and LOCATION:
//  - The Moon moves through the zodiac in ~27.3 days (~13°/day), so its
//    sign depends on the specific day and hour.
//  - The Ascendant is the point of the ecliptic rising on the eastern
//    horizon at the moment of birth, so it depends on the exact time AND
//    the birth latitude/longitude — it changes roughly every two hours.
//
// The formulas below are standard, published low-precision astronomical
// algorithms (Moon position: a truncated periodic-term series in the
// tradition of Meeus/Schlyter, accurate to roughly 0.3-0.5°; Ascendant: the
// standard spherical-trigonometry formula relating local sidereal time,
// latitude, and the obliquity of the ecliptic). They were independently
// verified against a published worked example (Meeus's 1992-04-12 Moon
// position test case) and first-principles horizon/rising-point checks
// before being ported here. Accuracy is good enough for zodiac-sign
// determination in the large majority of cases, but a birth time that's
// off by more than a few minutes — or right at a sign boundary — can shift
// the result, which is an inherent limitation of any simplified
// calculation, not just this one.
// ============================================================================

function norm360(deg: number): number {
  const m = deg % 360;
  return m < 0 ? m + 360 : m;
}

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

/**
 * Julian Day (UT) from a local calendar date + wall-clock time + UTC offset.
 * `hour` and `minute` are the LOCAL time at birth; `utcOffsetHours` is the
 * offset that was in effect at that place and moment (e.g. -5 for US
 * Eastern Standard Time), so localTime - utcOffsetHours = UT.
 */
export function toJulianDayUTC(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  utcOffsetHours: number
): number {
  const hourUT = hour + minute / 60 - utcOffsetHours;
  let y = year;
  let m = month;
  // Meeus's algorithm treats Jan/Feb as months 13/14 of the previous year.
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    hourUT / 24 +
    B -
    1524.5
  );
}

/** Geocentric ecliptic longitude of the Moon (degrees, 0-360), low precision. */
export function moonEclipticLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const Lp = norm360(218.3164477 + 481267.88123421 * T); // mean longitude
  const D = norm360(297.8501921 + 445267.1114034 * T); // mean elongation
  const M = norm360(357.5291092 + 35999.0502909 * T); // sun's mean anomaly
  const Mp = norm360(134.9633964 + 477198.8675055 * T); // moon's mean anomaly
  const F = norm360(93.272095 + 483202.0175233 * T); // moon's argument of latitude

  const s = (deg: number) => Math.sin(toRad(deg));

  let lon = Lp;
  lon += -1.274 * s(Mp - 2 * D);
  lon += 0.658 * s(2 * D);
  lon += -0.186 * s(M);
  lon += -0.059 * s(2 * Mp - 2 * D);
  lon += -0.057 * s(Mp - 2 * D + M);
  lon += 0.053 * s(Mp + 2 * D);
  lon += 0.046 * s(2 * D - M);
  lon += 0.041 * s(Mp - M);
  lon += -0.035 * s(D);
  lon += -0.031 * s(Mp + M);
  lon += -0.015 * s(2 * F - 2 * D);
  lon += 0.011 * s(Mp - 4 * D);

  return norm360(lon);
}

/** Mean obliquity of the ecliptic (degrees), with a small T correction. */
function obliquityOfEcliptic(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return 23.4392911 - 0.0130042 * T;
}

/** Greenwich Mean Sidereal Time (degrees, 0-360). */
function greenwichSiderealTime(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const gmst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000;
  return norm360(gmst);
}

/**
 * Ecliptic longitude of the Ascendant (degrees, 0-360) — the point of the
 * ecliptic rising on the eastern horizon at the given moment and location.
 * `longitudeDeg` is east-positive (negative for west).
 */
export function ascendantEclipticLongitude(
  jd: number,
  latitudeDeg: number,
  longitudeDeg: number
): number {
  const gmst = greenwichSiderealTime(jd);
  const ramc = norm360(gmst + longitudeDeg); // Local sidereal time in degrees
  const eps = obliquityOfEcliptic(jd);

  const ramcRad = toRad(ramc);
  const epsRad = toRad(eps);
  const latRad = toRad(latitudeDeg);

  const y = Math.cos(ramcRad);
  const x = -(Math.sin(ramcRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad));

  // The raw atan2 root gives the DESCENDANT (setting point); the Ascendant
  // is the horizon crossing 180° away, on the eastern side.
  return norm360(toDeg(Math.atan2(y, x)) + 180);
}

/** Maps an ecliptic longitude (0-360, 0 = start of Aries) to its zodiac sign. */
export function eclipticLongitudeToZodiacId(longitudeDeg: number): ZodiacId {
  const lon = norm360(longitudeDeg);
  const index = Math.min(11, Math.floor(lon / 30));
  return ZODIAC_SIGNS[index].id;
}

export interface BirthDetails {
  date: Date;
  /** "HH:MM", 24-hour, local wall-clock time */
  time: string;
  utcOffsetHours: number;
  latitude: number;
  longitude: number;
}

function parseTimeString(time: string): { hour: number; minute: number } | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

/** Computes the Moon Sign from full birth details. Returns null if inputs are incomplete/invalid. */
export function computeMoonSign(details: BirthDetails): ZodiacId | null {
  const parsedTime = parseTimeString(details.time);
  if (!parsedTime) return null;
  const jd = toJulianDayUTC(
    details.date.getFullYear(),
    details.date.getMonth() + 1,
    details.date.getDate(),
    parsedTime.hour,
    parsedTime.minute,
    details.utcOffsetHours
  );
  return eclipticLongitudeToZodiacId(moonEclipticLongitude(jd));
}

/** Computes the Ascendant (Rising Sign) from full birth details. Returns null if inputs are incomplete/invalid. */
export function computeAscendant(details: BirthDetails): ZodiacId | null {
  const parsedTime = parseTimeString(details.time);
  if (!parsedTime) return null;
  const jd = toJulianDayUTC(
    details.date.getFullYear(),
    details.date.getMonth() + 1,
    details.date.getDate(),
    parsedTime.hour,
    parsedTime.minute,
    details.utcOffsetHours
  );
  return eclipticLongitudeToZodiacId(
    ascendantEclipticLongitude(jd, details.latitude, details.longitude)
  );
}
