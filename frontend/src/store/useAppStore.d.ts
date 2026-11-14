// useAppStore.js 의 타입 선언. TS 화면에서 store를 쓰기 위한 것으로, JS 파일과 함께 맞춰 수정한다.
import type { StoreApi, UseBoundStore } from 'zustand'

export interface AppState {
  profile: { occupationId: string } | null
  /** 'YYYY-MM-DD'(KST) → 그날 완료한 미션 키 목록 */
  done: Record<string, string[]>
  setProfile: (profile: { occupationId: string }) => void
  complete: (missionId: string) => void
  seedDemo: (days: number) => void
  reset: () => void
}

export const useAppStore: UseBoundStore<StoreApi<AppState>>
