import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toErrorMessage } from '../api/client'
import { getItems } from '../api/items'
import Banner from '../components/Banner'
import type { ItemSummary } from '../types/item'
import { formatDate } from '../utils/format'

/** 샘플 목록 화면. 새 화면은 이 파일의 패턴(api 함수 호출 → data 표시 → 실패 시 Banner)을 복제한다. */
export default function ItemList() {
  const [items, setItems] = useState<ItemSummary[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false
    getItems()
      .then((data) => {
        if (!ignore) setItems(data)
      })
      .catch((e: unknown) => {
        if (!ignore) setError(toErrorMessage(e))
      })
    return () => {
      ignore = true
    }
  }, [])

  return (
    <section className="space-y-3 p-4">
      <h2 className="text-lg font-bold">목록</h2>
      {error && <Banner message={error} />}
      {!error && items === null && <p className="text-sm text-gray-500">불러오는 중…</p>}
      {items?.length === 0 && <p className="text-sm text-gray-500">항목이 없습니다.</p>}
      <ul className="space-y-2">
        {items?.map((item) => (
          <li key={item.id}>
            <Link
              to={`/items/${item.id}`}
              className="block rounded-xl border border-gray-200 bg-white p-4 shadow-sm active:bg-gray-50"
            >
              <p className="font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-gray-600">{item.summary}</p>
              <p className="mt-2 text-xs text-gray-400">{formatDate(item.createdAt)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
