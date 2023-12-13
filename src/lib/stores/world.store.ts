import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export const x = writable(0);
export const y = writable(0);
export const windowWidth = writable(0);
export const windowHeight = writable(0);
export const regionsInView: Writable<[number, number][]> = writable([]);
