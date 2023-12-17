import { parse } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { nanoid } from 'nanoid';
import type { IncomingMessage } from 'http';
import type { Duplex } from 'stream';

export const GlobalThisWSS = Symbol.for('sveltekit.wss');

export interface ExtendedWebSocket extends WebSocket {
	socketId: string;
}

export type ExtendedWebSocketServer = WebSocketServer;

export type ExtendedGlobal = typeof globalThis & {
	[GlobalThisWSS]: ExtendedWebSocketServer;
};

export const onHttpServerUpgrade = (req: IncomingMessage, sock: Duplex, head: Buffer) => {
	const pathname = req.url ? parse(req.url).pathname : null;
	if (pathname !== '/websocket') return;

	const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];

	wss.handleUpgrade(req, sock, head, (ws: WebSocket) => {
		const extendedWs = ws as ExtendedWebSocket;
		console.log('[handleUpgrade] creating new connection');
		extendedWs.socketId = nanoid();
		// extendedWs.userId should be set according to your logic

		wss.emit('connection', extendedWs, req);
	});
};

export const createWSSGlobalInstance = () => {
	const wss = new WebSocketServer({ noServer: true });

	(globalThis as ExtendedGlobal)[GlobalThisWSS] = wss;

	wss.on('connection', (ws: WebSocket) => {
		const extendedWs = ws as ExtendedWebSocket;
		extendedWs.socketId = nanoid();
		console.log(`[wss:global] client connected (${extendedWs.socketId})`);

		ws.on('close', () => {
			console.log(`[wss:global] client disconnected (${extendedWs.socketId})`);
		});
	});

	return wss;
};
