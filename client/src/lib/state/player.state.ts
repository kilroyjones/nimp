import { browser } from '$app/environment';
import { get, writable } from 'svelte/store';
import type { Player } from '$shared/types';
import type { Writable } from 'svelte/store';

const player: Writable<Player | undefined> = writable(undefined);

if (browser) {
	const storedPlayer = localStorage.getItem('player');
	if (storedPlayer) {
		try {
			const parsedPlayer: Player = JSON.parse(storedPlayer);
			player.set(parsedPlayer);
		} catch (e) {
			console.error('Error parsing player from localStorage:', e);
			player.set(undefined);
		}
	}

	player.subscribe((value) => {
		if (value === undefined) {
			localStorage.removeItem('player');
		} else {
			localStorage.setItem('player', JSON.stringify(value));
		}
	});
}

const getId = (): string | undefined => {
	return get(player)?.id;
};

const isDefined = (): boolean => {
	if (get(player)) {
		return true;
	}
	return false;
};

const isAccountRegistered = (): boolean => {
	const temp = get(player);
	if (temp) {
		return temp.registered;
	}
	return false;
};

const set = (playerData: Player) => {
	player.set(playerData);
};

const getName = (): string | undefined => {
	return get(player)?.name;
};

const getToken = (): string | undefined => {
	return get(player)?.token
};

export const PlayerState = {
	isAccountRegistered,
	isDefined,
	getId,
	getName,
	getToken, 
	set
};
