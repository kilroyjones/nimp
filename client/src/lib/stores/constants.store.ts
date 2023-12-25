import { readable } from 'svelte/store';

export const CELL_WIDTH = readable(64);
export const CELL_HEIGHT = readable(64);
export const REGION_WIDTH = readable(3200);
export const REGION_HEIGHT = readable(2048);
export const UPDATE_DISTANCE = readable(200);
