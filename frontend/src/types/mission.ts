/** 미션 상태. 그 외 값은 BE 확인 필요 (docs/api.md) */
export type MissionStatus = 'ASSIGNED' | 'COMPLETED'

/** GET /api/v1/missions/today 항목, POST /api/v1/missions/{id}/complete 응답 */
export interface Mission {
  id: number
  title: string
  description: string
  /** AI가 이 미션을 보낸 이유 */
  reason: string
  status: MissionStatus
  /** ISO 8601 */
  assignedAt: string
  /** ISO 8601, 완료 전에는 null */
  completedAt: string | null
  /** 미션 일러스트 경로. 없으면 null (BE 확인 필요) */
  imageUrl: string | null
}
