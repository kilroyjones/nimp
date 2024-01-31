// Modules
import { get, writable } from 'svelte/store';

// Types and constants
import type { Location } from '$shared/models';
import { RegionState } from './region.state';
import { DrawState } from './draw.state';

// Stores
export const windowWidth = writable(0);
export const windowHeight = writable(0);
export const x = writable(0);
export const y = writable(0);

/**
 *
 */
export const update = () => {
	const loc: Location = { x: get(x), y: get(y) };
	RegionState.update(loc);
	DrawState.update(loc, get(windowWidth), get(windowHeight));
};

/**
 *
 */
export const WorldState = {
	update
};
