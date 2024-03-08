import { browser } from '$app/environment';
import { InventoryState } from '$lib/state/inventory.state';
import { PlayerState } from '$lib/state/player.state';
import type { UpdateResourcesResponse } from '$shared/messages';
// import { player } from '$lib/state/player.state';
import type { Inventory, Player, Resources } from '$shared/types';
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

const receiveUpdateResources = (updatedResources: UpdateResourcesResponse) => {
	console.log(updatedResources);
	InventoryState.setResources(updatedResources);
};

export const PlayerHandler = {
	receiveHandshake,
	receiveUpdateResources
};
