/**
 * This connects to your websocket server in the /server folder at the root of
 * the project. We are only listening to connect and disconnect at this point as
 * the client is not processing any messages from the server.
 *
 * At a later point we will modify the Message type to allow other information
 * types to be sent as data, but for now we'll leave this as is.
 */
import { browser } from '$app/environment';
import { io } from 'socket.io-client';
import { get } from 'svelte/store';
import { playerId } from '$lib/stores/player.store';
import type { Action } from '@sveltejs/kit';
import { regionsInView } from '$lib/stores/world.store';

const SERVER_URL = 'http://localhost:3000'; // Replace with your server's URL

// TODO: Form a better structure in localstore for user data
console.log('HERE: ', get(playerId));
const socket = io(SERVER_URL, {
	query: {
		playerId: get(playerId) || ''
	}
});

export type Location = {
	x: number;
	y: number;
};

export type RegionKey = string;

export type DigMessage = {
	key: RegionKey;
	loc: Location;
};

export type ExploreMessage = {
	regions: string[];
};

type Message = {
	data: DigMessage | ExploreMessage;
};

socket.on('connect', () => {
	console.log('Connected to the server');
});

socket.on('disconnect', () => {
	console.log('Disconnected from server');
});

socket.on('handshake', (msg) => {
	console.log(msg);
	if (browser) localStorage.setItem('playerId', msg.playerId);
});

socket.on('explore', (msg: any) => {
	console.log(msg);
	console.log(msg.data);
	if (msg.data.regions) {
		regionsInView.set(msg.data.regions);
		console.log('here', get(regionsInView));
	}
});
/**
 * From the server side the endpoint is what determines
 * the action we'll take.
 */
function send(endpoint: string, msg: Message) {
	console.log('Msg: ', msg);
	socket.emit(endpoint, msg);
}

export const socketClient = {
	send
};
