import { completeMissionMock, getTodayMissionsMock } from '../mocks/missions'
import type { Mission } from '../types/mission'
import { request } from './client'

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
