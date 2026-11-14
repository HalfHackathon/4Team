import type { ApiResponse } from '../types/api'
import type { Mission } from '../types/mission'

/**
 * docs/api.md 의 /api/v1/missions 예시와 같은 데이터.
 * 완료 처리 결과를 화면에 반영하기 위해 메모리에 상태를 둔다.
 * 새로고침하면 처음 상태로 돌아간다 (시연 초기화).
 */
const SEED: Mission[] = [
  {
    id: 1,
    title: '식사시 채소 먼저 먹기',
    description: '점심 식사 때 채소 반찬부터 먼저 먹어 보세요.',
    reason: '앉아서 일하는 시간이 길면 식후 혈당이 빠르게 오를 수 있어요.',
    status: 'ASSIGNED',
    assignedAt: '2026-11-14T08:00:00+09:00',
    completedAt: null,
    imageUrl: '/images/missions/salad.png',
  },
  {
    id: 2,
    title: '근력 한 세트 하기',
    description: '스쿼트 15회나 팔굽혀펴기 10회를 한 세트 해 보세요.',
    reason: '오래 앉아 있으면 하체와 코어 근력이 약해지기 쉬워요.',
    status: 'ASSIGNED',
    assignedAt: '2026-11-14T08:00:00+09:00',
    completedAt: null,
    imageUrl: '/images/missions/strength.png',
  },
]

let missions: Mission[] = structuredClone(SEED)

const SUCCESS = { isSuccess: true, code: 'SUCCESS_200', message: '호출에 성공했습니다.' } as const

export function getTodayMissionsMock(): ApiResponse<Mission[]> {
  return { ...SUCCESS, data: missions }
}

export function completeMissionMock(id: number): ApiResponse<Mission> {
  const target = missions.find((m) => m.id === id)
  if (!target) {
    return {
      isSuccess: false,
      code: 'MISSION_404_1',
      message: '해당 미션을 찾을 수 없습니다.',
      data: null,
    }
  }
  if (target.status === 'COMPLETED') {
    return {
      isSuccess: false,
      code: 'MISSION_409_1',
      message: '이미 완료한 미션입니다.',
      data: null,
    }
  }
  const updated: Mission = { ...target, status: 'COMPLETED', completedAt: new Date().toISOString() }
  missions = missions.map((m) => (m.id === id ? updated : m))
  return { ...SUCCESS, data: updated }
}
