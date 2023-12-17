import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { createWSSGlobalInstance, onHttpServerUpgrade } from './src/lib/websocket/server';

export default defineConfig({
	plugins: [
		sveltekit(),
		{
			name: 'integratedWebsocketServer',
			configureServer(server) {
				createWSSGlobalInstance();
				server.httpServer?.on('upgrade', onHttpServerUpgrade);
			},
			configurePreviewServer(server) {
				createWSSGlobalInstance();
				server.httpServer?.on('upgrade', onHttpServerUpgrade);
			}
		}
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
