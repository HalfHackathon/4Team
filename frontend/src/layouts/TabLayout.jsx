import { NavLink, Outlet } from 'react-router-dom'

const TABS = [
  { to: '/home', label: '홈' },
  { to: '/routine', label: '루틴' },
  { to: '/diet', label: '식단' },
  { to: '/me', label: '내 정보' },
]

export default function TabLayout() {
  return (
    <div>
      <main style={{ padding: 16, paddingBottom: 120 }}>
        <Outlet />
      </main>
      <footer
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#fff',
          borderTop: '1px solid #ddd',
        }}
      >
        <nav>
          <ul style={{ display: 'flex', justifyContent: 'space-around', padding: 8 }}>
            {TABS.map((t) => (
              <li key={t.to}>
                <NavLink
                  to={t.to}
                  style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}
                >
                  {t.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <p style={{ fontSize: 12, textAlign: 'center', padding: 4 }}>
          본 서비스는 의료 진단이 아닌 생활습관 코칭을 제공합니다.
        </p>
      </footer>
    </div>
  )
}
