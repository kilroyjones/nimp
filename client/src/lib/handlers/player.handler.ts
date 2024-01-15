import { browser } from '$app/environment';
import { socketClient } from '$lib/socket/client';

/**
 * Incoming messages
 */
const receiveHandshake = (playerId: string) => {
	if (browser) localStorage.setItem('playerId', playerId);
};

export const PlayerHandler = {
	receiveHandshake
};
