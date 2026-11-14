import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toDateKey, seedDemoDone } from '../utils/date'

export const useAppStore = create(
  persist(
    (set) => ({
      profile: null, // { occupationId }
      done: {},      // { '2026-11-14': ['desk-1'] }

      setProfile: (profile) => set({ profile }),

      complete: (missionId) =>
        set((s) => {
          const k = toDateKey()
          const cur = s.done[k] ?? []
          if (cur.includes(missionId)) return s
          return { done: { ...s.done, [k]: [...cur, missionId] } }
        }),

      seedDemo: (days) =>
        set((s) => ({ done: { ...s.done, ...seedDemoDone(days) } })),

      reset: () => set({ profile: null, done: {} }),
    }),
    { name: 'app' }
  )
)
