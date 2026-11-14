import { getItemMock, getItemsMock } from '../mocks/items'
import type { ItemDetail, ItemSummary } from '../types/item'
import { request } from './client'

/** GET /api/v1/items */
export function getItems(): Promise<ItemSummary[]> {
  return request<ItemSummary[]>('/api/v1/items', { mock: getItemsMock })
}

/** GET /api/v1/items/{id} */
export function getItem(id: number): Promise<ItemDetail> {
  return request<ItemDetail>(`/api/v1/items/${id}`, { mock: () => getItemMock(id) })
}
