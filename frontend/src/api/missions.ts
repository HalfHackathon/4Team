import { completeMissionMock, getTodayMissionsMock } from '../mocks/missions'
import type { Mission } from '../types/mission'
import { request } from './client'

/** 스트릭 기록(useAppStore.done)에 남기는 미션 키 */
export const missionDoneKey = (id: number) => `mission-${id}`

/** GET /api/v1/missions/today */
export function getTodayMissions(): Promise<Mission[]> {
  return request<Mission[]>('/api/v1/missions/today', { mock: getTodayMissionsMock })
}

/** POST /api/v1/missions/{id}/complete */
export function completeMission(id: number): Promise<Mission> {
  return request<Mission>(`/api/v1/missions/${id}/complete`, {
    method: 'POST',
    mock: () => completeMissionMock(id),
  })
}
