import { browser } from '$app/environment';
// import { player } from '$lib/state/player.state';
import type { Player } from '$shared/types';
import { get } from 'svelte/store';

/**
 * Incoming messages
 */
const receiveHandshake = (player: Player) => {
	// if (browser) {
	// 	localStorage.setItem('playerId', player.id);
	// }
	// playerName.set(player.name);
	// console.log(get(playerName));
};

export const PlayerHandler = {
	receiveHandshake
};
