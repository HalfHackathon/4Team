import type { ApiResponse } from '../types/api'
import type { ItemDetail, ItemSummary } from '../types/item'

/** docs/api.md 의 /api/v1/items 예시와 같은 데이터. 문서를 바꾸면 여기도 함께 바꾼다. */
const ITEMS: ItemDetail[] = [
  {
    id: 1,
    title: '사무직 거북목 스트레칭 후기',
    summary: '점심시간 10분 스트레칭으로 목 통증이 줄었어요.',
    content:
      '모니터 높이를 눈높이에 맞추고, 점심시간마다 10분씩 목·어깨 스트레칭을 했습니다. 2주 정도 지나니 오후 두통이 확실히 줄었어요.',
    createdAt: '2026-11-10T12:30:00+09:00',
  },
  {
    id: 2,
    title: '교대 근무자 수면 루틴 공유',
    summary: '야간 근무 후 암막 커튼과 고정 취침 시간을 지켜요.',
    content:
      '야간 근무가 끝나면 바로 샤워하고 암막 커튼을 친 방에서 같은 시간에 잠듭니다. 퇴근길에는 선글라스를 써서 햇빛을 줄여요.',
    createdAt: '2026-11-11T08:15:00+09:00',
  },
]

export function getItemsMock(): ApiResponse<ItemSummary[]> {
  return {
    isSuccess: true,
    code: 'SUCCESS_200',
    message: '호출에 성공했습니다.',
    data: ITEMS.map(({ id, title, summary, createdAt }) => ({ id, title, summary, createdAt })),
  }
}

export function getItemMock(id: number): ApiResponse<ItemDetail> {
  const item = ITEMS.find((it) => it.id === id)
  if (!item) {
    return {
      isSuccess: false,
      code: 'ITEM_404_1',
      message: '해당 항목을 찾을 수 없습니다.',
      data: null,
    }
  }
  return { isSuccess: true, code: 'SUCCESS_200', message: '호출에 성공했습니다.', data: item }
}
