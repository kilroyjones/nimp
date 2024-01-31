import { browser } from '$app/environment';

/**
 * Incoming messages
 */
const receiveHandshake = (playerId: string) => {
	if (browser) {
		localStorage.setItem('playerId', playerId);
	}
};

export const PlayerHandler = {
	receiveHandshake
};
