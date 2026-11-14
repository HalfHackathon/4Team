/** GET /api/v1/items 목록 항목 */
export interface ItemSummary {
  id: number
  title: string
  summary: string
  /** ISO 8601 */
  createdAt: string
}

/** GET /api/v1/items/{id} 상세 */
export interface ItemDetail extends ItemSummary {
  content: string
}
