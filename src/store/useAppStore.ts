import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogEntry, UserProfile, FollowUpRating, SaltEfficacyStat, CellSaltId } from '../types';

interface AppState {
  profile: UserProfile;
  logs: LogEntry[];

  // Profile actions
  updateProfile: (updates: Partial<UserProfile>) => void;
  markDisclaimerSeen: () => void;
  toggleDarkMode: () => void;

  // Log actions
  addLogEntry: (entry: Omit<LogEntry, 'id' | 'createdAt' | 'followUps'>) => string;
  addFollowUp: (logId: string, followUp: Omit<FollowUpRating, 'id'>) => void;
  deleteLogEntry: (logId: string) => void;
  updateLogEntry: (logId: string, updates: Partial<LogEntry>) => void;

  // Derived / analytics
  getEfficacyStats: () => SaltEfficacyStat[];
  getMostEffectiveSalts: (limit?: number) => SaltEfficacyStat[];
}

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

const DEFAULT_PROFILE: UserProfile = {
  darkMode: false,
  hasSeenDisclaimer: false,
  notificationsEnabled: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,
      logs: [],

      updateProfile: (updates) =>
        set((state) => ({ profile: { ...state.profile, ...updates } })),

      markDisclaimerSeen: () =>
        set((state) => ({ profile: { ...state.profile, hasSeenDisclaimer: true } })),

      toggleDarkMode: () =>
        set((state) => ({ profile: { ...state.profile, darkMode: !state.profile.darkMode } })),

      addLogEntry: (entry) => {
        const id = generateId();
        const newEntry: LogEntry = {
          ...entry,
          id,
          createdAt: new Date().toISOString(),
          followUps: [],
        };
        set((state) => ({ logs: [newEntry, ...state.logs] }));
        return id;
      },

      addFollowUp: (logId, followUp) =>
        set((state) => ({
          logs: state.logs.map((log) =>
            log.id === logId
              ? {
                  ...log,
                  followUps: [
                    ...log.followUps,
                    { ...followUp, id: generateId() },
                  ],
                }
              : log
          ),
        })),

      deleteLogEntry: (logId) =>
        set((state) => ({ logs: state.logs.filter((l) => l.id !== logId) })),

      updateLogEntry: (logId, updates) =>
        set((state) => ({
          logs: state.logs.map((l) => (l.id === logId ? { ...l, ...updates } : l)),
        })),

      getEfficacyStats: () => {
        const { logs } = get();
        const bySalt = new Map<CellSaltId, LogEntry[]>();
        logs.forEach((log) => {
          const arr = bySalt.get(log.cellSaltId) ?? [];
          arr.push(log);
          bySalt.set(log.cellSaltId, arr);
        });

        const stats: SaltEfficacyStat[] = [];
        bySalt.forEach((entries, cellSaltId) => {
          const allFollowUps = entries.flatMap((e) => e.followUps);
          const totalFollowUps = allFollowUps.length;
          const averageStars =
            totalFollowUps > 0
              ? allFollowUps.reduce((sum, f) => sum + f.starRating, 0) / totalFollowUps
              : 0;
          const positiveCount = allFollowUps.filter(
            (f) => f.reliefStatus === 'completely_relieved' || f.reliefStatus === 'moderate_relief'
          ).length;
          const successRate = totalFollowUps > 0 ? (positiveCount / totalFollowUps) * 100 : 0;

          stats.push({
            cellSaltId,
            totalUses: entries.length,
            totalFollowUps,
            averageStars: Math.round(averageStars * 10) / 10,
            successRate: Math.round(successRate),
          });
        });

        return stats.sort((a, b) => b.totalUses - a.totalUses);
      },

      getMostEffectiveSalts: (limit = 5) => {
        const stats = get().getEfficacyStats();
        return [...stats]
          .filter((s) => s.totalFollowUps > 0)
          .sort((a, b) => {
            if (b.successRate !== a.successRate) return b.successRate - a.successRate;
            return b.averageStars - a.averageStars;
          })
          .slice(0, limit);
      },
    }),
    {
      name: 'cell-salts-astro-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ profile: state.profile, logs: state.logs }),
    }
  )
);
