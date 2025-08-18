import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://developer-lostark.game.onstove.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // API 키 헤더 추가
            proxyReq.setHeader('authorization', `bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDAwMTU5NTYifQ.fOc6qiM5XMOEb-PdpWHv-c-Z1-s0T5EqFHHOsffnBhQODGBDKyYcgvn4ehblVViQRz6cpHaO8AwjhSKOTFkX3BAAJrPdkMYSgupvYMbAS1DERAmX6Hm_5gScTndrwac08FlKkujonFHQ__3V1TyGKrzI74Xkl209oEc1Xit7drgpHzMFGbMD5EzJ9e6pb3EBhcfyldCT5tPEmxsg-m4Sw33hWxaETYRLnTgzSmy6_5Qw6rqLLETgEsYruRY1V_HLD3yOwYjOxThR2DLpU671n5Ktovy-6roHkuMWJCBob9U8oxMRchgAa7lSVm4WvPT7xoLk_yN-KQtQTLH5gUeGxg`);
            proxyReq.setHeader('accept', 'application/json');
          });
        }
      }
    }
  }
})
