import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			'/face-api': {
				target: 'https://face.mbabm.uz',
				changeOrigin: true,
				secure: true,
				rewrite: path => path.replace(/^\/face-api/, ''),
			},
		},
	},
})
