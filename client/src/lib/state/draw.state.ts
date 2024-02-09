// Modules
import { get, writable, type Writable } from 'svelte/store';
import { RegionState } from './region.state';

// Types and constants
import type { Bounds, Location } from '$shared/types';
import type { Dig } from '$lib/types';
import type { Region } from '$shared/models';
import {
	REGION_WIDTH,
	REGION_HEIGHT,
	REGION_WIDTH_DIGS,
	DIG_HEIGHT,
	DIG_WIDTH,
	UPDATE_DISTANCE
} from '$shared/constants';

type Claim = {
	x: number;
	y: number;
	w: number;
	h: number;
	valid: boolean;
};
export const digsToDraw: Writable<Array<Dig>> = writable(new Array());
export const postsToDraw: Writable<Array<Post>> = writable(new Array());
// export const claimToDraw: Writable<Array<Dig>> = writable(new Array());
export const claimToDraw: Writable<Claim | undefined> = writable(undefined);

/**
 * Calculates the digs within a region that fall within a given view frame.
 *
 * @param {Region} region - The region object based on shared type.
 * @param {Bounds} viewFrame - An object representing the view frame coordinates (x1, y1, x2, y2).
 * @returns {Array} An array of objects, each representing a cell to be drawn.
 *
 * The function is essentially taking an overlap of the region and the viewframe and finding
 * the digs that lie within that space.
 *
 */
const getDigsToDraw = (region: Region, viewFrame: Bounds): Array<Dig> => {
	// Calculate the overlapping bounds
	const x1 = Math.max(region.x, viewFrame.x1);
	const y1 = Math.max(region.y, viewFrame.y1);
	const x2 = Math.min(region.x + REGION_WIDTH, viewFrame.x2);
	const y2 = Math.min(region.y + REGION_HEIGHT, viewFrame.y2);

	// Compute dig locations to draw
	const startCol = Math.floor((x1 - region.x) / DIG_WIDTH);
	const startRow = Math.floor((y1 - region.y) / DIG_HEIGHT);
	const endCol = Math.floor((x2 - region.x) / DIG_WIDTH);
	const endRow = Math.floor((y2 - region.y) / DIG_HEIGHT);

	const result = new Array((endRow - startRow) * (endCol - startCol));
	let idx = 0;

	for (let row = startRow; row < endRow; row++) {
		let index = row * REGION_WIDTH_DIGS;
		for (let col = startCol; col < endCol; col++) {
			result[idx++] = {
				x: region.x + col * DIG_WIDTH,
				y: region.y + row * DIG_HEIGHT,
				value: region.digs.charAt(index + col)
			};
		}
	}
	return result;
};

/**
 * Updates the digs to be drawn based on the current location and window dimensions.
 *
 * @param {Location} loc - The current location from which to calculate the view bounds.
 * @param {number} windowWidth - The width of the viewing window.
 * @param {number} windowHeight - The height of the viewing window.
 *
 * This function update the currently drawn field base on the current window size
 * and location. It calculates the bounds and creates an array of Dig objects.
 */
const update = function (loc: Location, windowWidth: number, windowHeight: number) {
	// Define view frame and areas (regions covered)
	const viewBounds: Bounds = {
		x1: loc.x - UPDATE_DISTANCE,
		y1: loc.y - UPDATE_DISTANCE,
		x2: loc.x + windowWidth + UPDATE_DISTANCE,
		y2: loc.y + windowHeight + UPDATE_DISTANCE
	};

	let digs: Array<Dig> = [];
	const regions = RegionState.getAll();
	if (regions) {
		regions.forEach((region) => {
			digs = digs.concat(getDigsToDraw(region, viewBounds));
		});

		digsToDraw.update((_) => {
			return digs;
		});
	}
};

const setSelection = function (topLeft: Location, bottomRight: Location, valid: boolean) {
	const temp = {
		x: topLeft.x,
		y: topLeft.y,
		w: bottomRight.x - topLeft.x,
		h: bottomRight.y - topLeft.y,
		valid: valid
	};

	// console.log(temp);
	claimToDraw.update((_) => {
		return {
			x: topLeft.x,
			y: topLeft.y,
			w: bottomRight.x - topLeft.x + DIG_WIDTH,
			h: bottomRight.y - topLeft.y + DIG_HEIGHT,
			valid: valid
		};
	});
};

const resetSelection = function () {
	claimToDraw.update((_) => {
		return undefined;
	});
};

export const DrawState = {
	resetSelection,
	setSelection,
	update
};
