import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export const playerId: Writable<string | undefined> = writable(
	(browser && localStorage.getItem('playerId')) || ''
);

playerId.subscribe((value) => {
	if (browser) return (localStorage.playerId = value);
});
