# Cell Salts & Astrology Tracker

A React Native (Expo + TypeScript) app that pairs Schuessler's 12 Cell (Tissue)
Salts with the Zodiac, and lets you log symptoms, track which salt you took,
and record how well it worked over time.

> **Disclaimer:** This app is a wellness/reflection tool. Cell salts are a
> complementary, traditional practice and are not a substitute for
> professional medical advice, diagnosis, or treatment. The app shows a
> disclaimer on first launch and this note applies throughout.

---

## Tech Stack

- **Expo SDK 57** (React Native 0.86, React 19), TypeScript (strict mode)
- **React Navigation v7** — bottom tabs + native stack, with modal-style
  presentation for "Find My Salt" and "Log Entry"
- **Zustand** for state management, persisted to **AsyncStorage**
- **expo-notifications** for local follow-up reminders (2h / 12h / 24h)
- **expo-file-system / expo-print / expo-sharing** for JSON + PDF export
- **expo-location** (optional convenience) for filling in birth
  latitude/longitude used by the Ascendant calculation
- **@react-native-community/datetimepicker** for date/time inputs
- Hand-rolled `StyleSheet`-based UI (no external UI kit), celestial dark/light
  theme with deep blues + gold accents

## Project Structure

```
/src
  /assets         # (placeholder — add real icons/images here)
  /components     # Reusable UI: Card, Button, Chip, StarRating, BarChart, etc.
  /constants      # Zodiac dataset, Cell Salt dataset, theme tokens
  /navigation     # Root stack + bottom tab navigators, param list types
  /screens        # Home, Detail, FindMySalt (search/filter/browse + quiz),
                  # LogEntry, LogDetail, Tracker, Analytics, Profile
  /store          # Zustand store (profile + logs), persisted to AsyncStorage
  /types          # Shared TypeScript interfaces & static enums
  /utils          # date utils, notifications, export (PDF/JSON), theme hook
App.tsx           # Entry point — wraps navigation + disclaimer modal
app.json          # Expo config (icons, permissions, expo-notifications plugin)
```

## Getting Started

```bash
npm install
npx expo start
```

Then press `a` for Android, `i` for iOS (macOS + Xcode required), or scan the
QR code with **Expo Go** on your device.

### Requirements

- Node.js 18+
- For iOS builds: macOS + Xcode
- For Android builds: Android Studio / an emulator, or a physical device with
  Expo Go

## Core Features

1. **Home Dashboard** — Zodiac wheel, sun/moon/rising sign highlights, quick
   actions, and recent activity.
2. **Find My Salt** — Two modes in one screen: "By Birth Date" (auto zodiac
   calculation, including the Capricorn year-wrap edge case) and "By
   Symptom" — a full searchable/filterable browse of all 12 salts (search
   by name or symptom, filter by body system), tapping through to a full
   detail view (indications, deficiency symptoms, dietary sources). There
   is no separate Directory tab — this screen is the single place to look
   up a salt, whether you know your sign or just what's bothering you.
3. **Symptom Tracker** — Log active symptoms, the salt + potency taken,
   start date/time, and baseline severity (1–10). Optional local
   notifications remind you to rate efficacy at 2h / 12h / 24h.
4. **Efficacy Reporting** — Rate relief with a 5-star scale and a relief-level
   tag; view a "Most Effective Salts" ranking, total-uses-vs-success-rate
   breakdown, and export your full history to JSON or a formatted PDF.
5. **Profile & Settings** — Set name, birth date (directly typeable, auto-
   fills Sun Sign), birth time & location (computes Moon Sign and Ascendant
   via real astronomical formulas — see below), dark mode, notification
   preferences, and your glass UI gradient theme.
6. **Glassmorphic UI** — Every card is a blurred, translucent glass surface
   (`expo-blur`) floating over a full-screen animated gradient backdrop.
   Six gradient presets (Nebula, Ocean, Sunset, Aurora, Rose Quartz,
   Midnight) are selectable from Profile, each with a light/dark variant —
   and in dark mode, flat (non-blurred) surfaces like Chip backgrounds,
   TextInput fields, and list rows are also tinted toward the selected
   preset's hue instead of one fixed navy tone.
7. **Smooth tab transitions** — Bottom tabs cross-fade/slide (`animation:
   'shift'`) instead of cutting abruptly, and the tab bar itself is a
   blurred glass surface.

## Moon Sign & Ascendant Calculation

Unlike the Sun Sign (which only needs a calendar date), the Moon Sign and
Ascendant genuinely require birth **time** and **location** — the Moon
moves through the zodiac in ~27.3 days, and the Ascendant (the point of the
ecliptic rising on the eastern horizon) changes roughly every two hours.
Profile has an optional "Birth Time & Location" section (local time,
latitude/longitude — with an optional "Use Current Location" shortcut via
`expo-location` — and the UTC offset in effect at that time/place) plus a
"Calculate" button that runs the real formulas in `src/utils/astronomy.ts`:

- **Moon position**: a truncated periodic-term series in the Meeus/Schlyter
  tradition, accurate to roughly 0.3–0.5°.
- **Ascendant**: the standard spherical-trigonometry formula relating local
  sidereal time, latitude, and the obliquity of the ecliptic.

Both were independently verified — the Moon formula against Meeus's
published 1992-04-12 worked example, and the Ascendant formula from first
principles (confirming the resulting ecliptic point actually sits on the
horizon and is rising, not setting) — before being wired into the UI. The
result is presented as a best-effort estimate, not a certainty; a birth
time that's off by more than a few minutes, or one that falls right at a
sign boundary, can shift the outcome, which is an inherent limitation of
any simplified calculation. Manual sign pickers remain available below the
calculator for anyone who already knows their placements.

## Notes on Implementation Choices

- **No external chart library** — the analytics bar chart is a small,
  dependency-free component (`src/components/BarChart.tsx`) to avoid version
  drift across Expo SDK upgrades. Swap in `react-native-svg`-based charts or
  `victory-native` if you want richer visuals later.
- **Zustand + `persist` middleware** backed by AsyncStorage gives offline-first
  persistence without a full SQLite/WatermelonDB setup; migrating to
  WatermelonDB later is straightforward since all state is already isolated
  in `src/store`.
- **`expo-file-system`'s new `File`/`Paths` API** (SDK 54+) is used for JSON
  export instead of the deprecated `FileSystem.documentDirectory` string API.
- **Birth date entry** (`src/components/DateInput.tsx`) is a directly
  typeable `MM/DD/YYYY` field with input masking and validation — this is
  the primary interaction on every platform, including web, where the
  native `@react-native-community/datetimepicker` has inconsistent support.
  On iOS/Android a calendar-icon button additionally opens the native
  picker inside a `Modal` overlay (so it never disturbs page layout) as a
  shortcut.
- **Find My Salt's "By Symptom" layout** (search + filter + full salt list,
  formerly the standalone Directory screen) only gives the results
  `FlatList` `flex: 1`; everything above it (search input, body-system
  filter row) is a fixed, non-scrolling header block using a plain
  horizontal `ScrollView` instead of a nested `FlatList` — this avoids the
  row-overlap you'd get from an unsized scrollable child inside a flex
  column, and the screen is wrapped in `SafeAreaView` for notch/inset
  safety on phones. "By Birth Date" mode, having no list, stays a plain
  `ScrollView`.
- **Glass UI** (`src/components/Card.tsx`, `GradientBackdrop.tsx`) layers
  `expo-blur`'s `BlurView` + a semi-transparent tint over a full-screen
  `expo-linear-gradient` backdrop rendered once in `App.tsx`. All screen
  containers use `backgroundColor: 'transparent'` so the gradient shows
  through everywhere; the gradient itself cross-fades (via `Animated`) when
  you switch presets or toggle dark mode.

## Suggested Next Steps

- Add real app icons/splash assets under `/src/assets` (currently uses Expo's
  default placeholders referenced in `app.json`).
- Wire up `expo-notifications` push tokens if you want remote reminders in
  addition to local ones.
- Add authentication + cloud sync if multi-device history is needed.
