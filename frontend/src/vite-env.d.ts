interface ImportMetaEnv {
  /** 'true' | 'false' | 'auto' (기본 auto) */
  readonly VITE_USE_MOCK?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
