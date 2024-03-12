import { writable, type Writable } from 'svelte/store';

// Todo, probably remove this
export const publishedContent = writable(1);

export const showPicker = writable(false);
export const brushSize: Writable<number> = writable(8);
export const brushColor = writable('#ff0022');
export const selectedClaimId = writable(-1);
export const canvasSize = writable(256);
