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
  /screens        # Home, Directory, Detail, FindMySalt, LogEntry, LogDetail,
                  # Tracker, Analytics, Profile
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
2. **Cell Salt Directory** — Search + filter by zodiac sign or body system;
   tap through to a full detail view (indications, deficiency symptoms,
   dietary sources).
3. **Find My Salt** — Quiz by birth date (auto zodiac calculation, including
   the Capricorn year-wrap edge case) or by free-text symptom search.
4. **Symptom Tracker** — Log active symptoms, the salt + potency taken,
   start date/time, and baseline severity (1–10). Optional local
   notifications remind you to rate efficacy at 2h / 12h / 24h.
5. **Efficacy Reporting** — Rate relief with a 5-star scale and a relief-level
   tag; view a "Most Effective Salts" ranking, total-uses-vs-success-rate
   breakdown, and export your full history to JSON or a formatted PDF.
6. **Profile & Settings** — Set name, birth date (auto-fills Sun Sign),
   Ascendant, Moon Sign, dark mode, and notification preferences.

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

## Suggested Next Steps

- Add real app icons/splash assets under `/src/assets` (currently uses Expo's
  default placeholders referenced in `app.json`).
- Wire up `expo-notifications` push tokens if you want remote reminders in
  addition to local ones.
- Add authentication + cloud sync if multi-device history is needed.
