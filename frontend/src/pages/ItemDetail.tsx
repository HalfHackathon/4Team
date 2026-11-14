import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toErrorMessage } from '../api/client'
import { getItem } from '../api/items'
import Banner from '../components/Banner'
import type { ItemDetail as ItemDetailData } from '../types/item'
import { formatDate } from '../utils/format'

export default function ItemDetail() {
  const { id } = useParams()
  const itemId = Number(id)
  const [item, setItem] = useState<ItemDetailData | null>(null)
  const [error, setError] = useState<string | null>(
    Number.isInteger(itemId) ? null : '잘못된 항목 주소입니다.',
  )

  useEffect(() => {
    if (!Number.isInteger(itemId)) return
    let ignore = false
    getItem(itemId)
      .then((data) => {
        if (!ignore) setItem(data)
      })
      .catch((e: unknown) => {
        if (!ignore) setError(toErrorMessage(e))
      })
    return () => {
      ignore = true
    }
  }, [itemId])

  return (
    <section className="space-y-3">
      <Link to="/" className="text-sm text-blue-600">
        ← 목록으로
      </Link>
      {error && <Banner message={error} />}
      {!error && item === null && <p className="text-sm text-gray-500">불러오는 중…</p>}
      {item && (
        <article className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-bold">{item.title}</h2>
          <p className="text-xs text-gray-400">{formatDate(item.createdAt)}</p>
          <p className="leading-relaxed whitespace-pre-line">{item.content}</p>
        </article>
      )}
    </section>
  )
}
