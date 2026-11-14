import { NavLink, Outlet } from 'react-router-dom'

// Figma 하단 탭 바 (노드 9:752). 아이콘은 public/images/tab/ 의 Figma SVG를 마스크로 써서
// 활성(#373840)·비활성(#C6C8D2) 색만 바꾼다.
const TABS = [
  { to: '/home', label: '홈', icon: '/images/tab/home.svg', width: 30, height: 29 },
  { to: '/ranking', label: '랭킹', icon: '/images/tab/ranking.svg', width: 31, height: 30 },
  { to: '/me', label: '마이', icon: '/images/tab/my.svg', width: 30, height: 30 },
]

function TabIcon({ tab, active }) {
  return (
    <span
      className={`relative block ${active ? 'bg-tab-active' : 'bg-tab-inactive'}`}
      style={{
        width: tab.width,
        height: tab.height,
        maskImage: `url(${tab.icon})`,
        maskSize: '100% 100%',
        maskRepeat: 'no-repeat',
      }}
    >
      {/* 홈 아이콘 안쪽 가로선: 시안에서는 바 배경색(#EBECF4)으로 칠해져 있다 */}
      {tab.to === '/home' && (
        <span className="absolute top-[22.76px] left-[7.5px] h-[2.5px] w-[15px] rounded-full bg-tab-bar" />
      )}
    </span>
  )
}

export default function TabLayout() {
  return (
    <div>
      {/* 아래 여백: 탭 바(70px) + 바닥 간격(45px) + 여유 */}
      <main className="p-4 pb-[136px]">
        <Outlet />
        <p className="mt-6 text-center text-[11px] text-tab-inactive">
          본 서비스는 의료 진단이 아닌 생활습관 코칭을 제공합니다.
        </p>
      </main>
      <nav
        aria-label="하단 탭"
        className="fixed bottom-[45px] left-1/2 z-10 flex h-[70px] w-[253px] -translate-x-1/2 items-end justify-between rounded-full bg-tab-bar px-[41px] pb-5"
      >
        {TABS.map((tab) => (
          <NavLink key={tab.to} to={tab.to} aria-label={tab.label} className="-m-2 p-2">
            {({ isActive }) => <TabIcon tab={tab} active={isActive} />}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
