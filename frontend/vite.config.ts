import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { defineConfig, loadEnv, type ProxyOptions } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // .env, .env.local 등과 셸 환경 변수에서 VITE_BACKEND_URL을 읽는다.
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = env.VITE_BACKEND_URL || 'http://localhost:8080'

  // 브라우저는 같은 출처(/api)로만 요청하고, 개발 서버가 백엔드로 전달한다. → 백엔드 CORS 설정 불필요
  const proxy: Record<string, ProxyOptions> = {
    '/api': {
      target: backendUrl,
      changeOrigin: true,
      configure: (proxyServer) => {
        // 백엔드가 꺼져 있으면 ApiResponse 형식의 502를 돌려준다. 화면은 message를 그대로 표시한다.
        proxyServer.on('error', (_err, _req, res) => {
          const response = res as ServerResponse<IncomingMessage>
          if (!('writeHead' in response) || response.headersSent) return
          response.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' })
          response.end(
            JSON.stringify({
              isSuccess: false,
              code: 'FE_PROXY_502',
              message: `백엔드 서버(${backendUrl})에 연결할 수 없습니다.`,
              data: null,
            }),
          )
        })
      },
    },
  }

  return {
    plugins: [react(), tailwindcss()],
    server: { proxy },
    preview: { proxy },
  }
})
