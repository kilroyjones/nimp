/**
 * This connects to your websocket server in the /server folder at the root of
 * the project. We are only listening to connect and disconnect at this point as
 * the client is not processing any messages from the server.
 *
 * At a later point we will modify the Message type to allow other information
 * types to be sent as data, but for now we'll leave this as is.
 */
import { io } from 'socket.io-client';
import { get } from 'svelte/store';
import { playerId } from '$lib/state/player.state';
import { RegionHandler } from '$lib/handlers/region.handler';
import type { HandshakeResponse } from '$shared/messages';
import { PlayerHandler } from '../handlers/player.handler';

const SERVER_URL = 'http://localhost:3000'; // Replace with your server's URL

// TODO: Form a better structure in localstore for user data
const socket = io(SERVER_URL, {
	query: {
		playerId: get(playerId) || ''
	}
});

// Messages
socket.on('connect', () => {
	console.log('Connected to the server');
});

socket.on('disconnect', () => {
	console.log('Disconnected from server');
});

socket.on('handshake', (msg: HandshakeResponse) => {
	const data: HandshakeResponse = msg;
	console.log(`[Handshake] - ${msg.playerId} `);
	if (msg.playerId) {
		PlayerHandler.receiveHandshake(msg.playerId);
	}
});

socket.on('update-regions', (msg) => {
	const res = JSON.parse(msg);
	console.log('IN - [update-regions]', res);
	if (res.data) {
		RegionHandler.receiveUpdateRegions(res.data);
	}
});

/**
 * From the server side the endpoint is what determines
 * the action we'll take.
 *
 */
function send(endpoint: string, msg: any) {
	console.log(`Out [${endpoint}]:`, msg);
	socket.emit(endpoint, msg);
}

export const socketClient = {
	send
};
