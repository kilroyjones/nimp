import { writable } from 'svelte/store';

export const isDebugMode = writable(true);
export const isClaimMode = writable(true);
export const showActions = writable(false);
export const showTextEditor = writable(false);
