// 샘플 데이터입니다. 실제 서비스 전에는 공신력 있는 근거 출처로 교체해야 합니다.

// 시연용 사용자 이름 (Figma 시안 문구). 이름 입력 기능이 생기면 profile로 옮긴다.
export const MOCK_USER_NAME = '용훈'

export const OCCUPATIONS = [
  {
    id: 'desk',
    label: '사무·개발 (장시간 좌식)',
    risks: ['목·어깨 근골격계 부담', '안구 피로', '운동 부족'],
    // Figma 시안 문구 그대로 (수치 근거 확인 필요)
    riskMessage: '개발자의 32%가 손목 터널 증후군을 앓고 있어요!',
    missions: [
      { id: 'desk-1', title: '목·어깨 스트레칭', sec: 180 },
      { id: 'desk-2', title: '20-20-20 눈 휴식', sec: 60 },
    ],
  },
  {
    id: 'shift',
    label: '교대·야간 근무',
    risks: ['수면 리듬 불균형', '만성 피로', '소화 불편'],
    riskMessage: '교대 근무는 수면 리듬이 깨지기 쉬워요!',
    missions: [
      { id: 'shift-1', title: '근무 전 가벼운 스트레칭', sec: 180 },
      { id: 'shift-2', title: '퇴근 후 수면 준비 루틴', sec: 180 },
    ],
  },
  {
    id: 'service',
    label: '서비스·감정노동',
    risks: ['스트레스·번아웃', '성대 피로', '하지 피로'],
    riskMessage: '감정노동은 스트레스가 쌓이기 쉬워요!',
    missions: [
      { id: 'service-1', title: '호흡 정리 1분', sec: 60 },
      { id: 'service-2', title: '종아리·발 스트레칭', sec: 180 },
    ],
  },
]

export const BADGE_MILESTONES = [3, 7, 14, 30]
export const getOccupation = (id) => OCCUPATIONS.find((o) => o.id === id)
