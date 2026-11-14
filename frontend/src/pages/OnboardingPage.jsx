import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OCCUPATIONS } from '../data/mock'
import { useAppStore } from '../store/useAppStore'

export default function OnboardingPage() {
  const setProfile = useAppStore((s) => s.setProfile)
  const navigate = useNavigate()
  const [occupationId, setOccupationId] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    if (!occupationId) return
    setProfile({ occupationId })
    navigate('/home', { replace: true })
  }

  return (
    <main style={{ padding: 16 }}>
      <h1>직종을 선택하세요</h1>
      <form onSubmit={onSubmit}>
        <fieldset>
          <legend>직종</legend>
          {OCCUPATIONS.map((o) => (
            <label key={o.id} style={{ display: 'block' }}>
              <input
                type="radio"
                name="occupation"
                value={o.id}
                checked={occupationId === o.id}
                onChange={() => setOccupationId(o.id)}
              />{' '}
              {o.label}
            </label>
          ))}
        </fieldset>
        <button
          type="submit"
          disabled={!occupationId}
          style={{ border: '1px solid #333', padding: '2px 8px', marginTop: 8 }}
        >
          시작하기
        </button>
      </form>
    </main>
  )
}
