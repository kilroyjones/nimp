import { writable } from 'svelte/store';

export const isDebugMode = writable(true);
export const showActions = writable(false);
export const showTextEditor = writable(false);
export const showPainter = writable(false);
