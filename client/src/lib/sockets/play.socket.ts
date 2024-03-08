/**
 * This connects to your websocket server in the /server folder at the root of
 * the project. We are only listening to connect and disconnect at this point as
 * the client is not processing any messages from the server.
 *
 * At a later point we will modify the Message type to allow other information
 * types to be sent as data, but for now we'll leave this as is.
 */

// Modules
import { Socket, io } from 'socket.io-client';
import { RegionHandler } from '$lib/handlers/region.handler';

// Types and constants
import type {
	UpdateDigResponse,
	UpdateInventoryResponse,
	UpdatePostResponse,
	UpdateRegionResponse,
	UpdateResourcesResponse
} from '$shared/messages';
import { WorldState } from '$lib/state/world.state';
import { writable, type Writable } from 'svelte/store';
import { PlayerHandler } from '$lib/handlers/player.handler';

let socket: Socket | undefined;

export const isOnline: Writable<boolean> = writable(false);
/**
 *
 */
const connect = (id: string) => {
	if (socket && socket.connected) {
		console.log('Socket already connected.');
		return;
	}

	console.log('Connecting to server...');
	const SERVER_URL = 'http://localhost:3000/'; // Replace with your server's URL
	socket = io(SERVER_URL, {
		query: {
			id: id
		}
	});
	/**
	 * CONNECTION
	 */
	socket.on('connect', async () => {
		console.log('Connected to the server');
		isOnline.set(true);
		WorldState.update();
	});

	socket.on('disconnect', async () => {
		isOnline.set(false);
		console.log('Disconnected from server');
	});
	/**
	 * ACTIONS
	 */
	socket.on('update-digs', async (msg: UpdateDigResponse) => {
		console.log('IN - [update-digs]', msg);
		if (msg) {
			RegionHandler.receiveUpdateDigs(msg);
		}
	});

	socket.on('update-posts', async (msg: UpdatePostResponse) => {
		console.log('IN - [update-posts]', msg);
		if (msg) {
			RegionHandler.receiveUpdatePosts(msg);
		}
	});

	socket.on('update-resources', async (msg: UpdateResourcesResponse) => {
		console.log('IN - [update-resources]', msg);
		if (msg) {
			PlayerHandler.receiveUpdateResources(msg);
		}
	});
	/**
	 * REGIONS
	 */
	socket.on('update-regions', async (msg: UpdateRegionResponse) => {
		console.log('IN - [update-resources]', msg);
		if (msg) {
			RegionHandler.receiveUpdateRegions(msg);
		}
	});
};

/**
 *
 */
const isConnected = (): boolean => {
	return socket?.connected || false;
};

/**
 * From the server side the endpoint is what determines
 * the action we'll take.
 *
 */
const send = async (endpoint: string, msg: any) => {
	console.log(`Out [${endpoint}]:`, msg);
	if (socket) {
		socket.emit(endpoint, msg);
	}
};

export const PlaySocket = {
	connect,
	isConnected,
	send
};
