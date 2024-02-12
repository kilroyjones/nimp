// Modules
import { writable, type Writable } from 'svelte/store';
import { RegionState, x, y } from './region.state';

// Types and constants
import type { Bounds, Location } from '$shared/types';
import type { Dig, Post } from '$lib/types';
import type { Region } from '$shared/models';
import { REGION_WIDTH_DIGS, DIG_HEIGHT, DIG_WIDTH, UPDATE_DISTANCE } from '$shared/constants';
import { Conversion } from '$shared/conversion';

type Claim = {
	x: number;
	y: number;
	w: number;
	h: number;
	valid: boolean;
};
export const claimToDraw: Writable<Claim | undefined> = writable(undefined);
export const digsToDraw: Writable<Array<Dig>> = writable(new Array());
export const postsToDraw: Writable<Array<Post>> = writable(new Array());

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
const getDigsToDraw = (region: Region, bounds: Bounds): Array<Dig> => {
	const startCol = Math.floor((bounds.x1 - region.x) / DIG_WIDTH);
	const startRow = Math.floor((bounds.y1 - region.y) / DIG_HEIGHT);
	const endCol = Math.floor((bounds.x2 - region.x) / DIG_WIDTH);
	const endRow = Math.floor((bounds.y2 - region.y) / DIG_HEIGHT);

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
 *
 */
const getPostsToDraw = (region: Region, bounds: Bounds): Array<Post> => {
	let postsArray: Post[] = [];
	Object.values(region.posts).forEach((post: any) => {
		if (
			post.loc.x >= bounds.x1 &&
			post.loc.x <= bounds.x2 &&
			post.loc.y >= bounds.y1 &&
			post.loc.y <= bounds.y2
		) {
			const loc = Conversion.toDigLocationLocal(post.loc, region);
			postsArray.push({
				regionKey: region.key,
				postKey: `${loc.x.toString() + loc.y.toString()}`,
				content: post.content,
				x: post.loc.x,
				y: post.loc.y,
				width: post.width,
				height: post.height
			});
		}
	});
	return postsArray;
};

/**
 *
 */
const setSelection = (topLeft: Location, bottomRight: Location, valid: boolean) => {
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

/**
 *
 */
const resetSelection = () => {
	claimToDraw.update((_) => {
		return undefined;
	});
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
const update = (loc: Location, windowWidth: number, windowHeight: number) => {
	// Define view frame and areas (regions covered)
	const viewBounds: Bounds = {
		x1: loc.x - UPDATE_DISTANCE,
		y1: loc.y - UPDATE_DISTANCE,
		x2: loc.x + windowWidth + UPDATE_DISTANCE,
		y2: loc.y + windowHeight + UPDATE_DISTANCE
	};
	// console.log('VIEW', viewBounds);

	let digs: Array<Dig> = [];
	let posts: Array<Post> = [];

	const regions = RegionState.getAll();
	if (regions) {
		regions.forEach((region) => {
			// console.log('CALC:', viewBounds);
			digs = digs.concat(getDigsToDraw(region, viewBounds));
			posts = posts.concat(getPostsToDraw(region, viewBounds));
		});

		digsToDraw.update((_) => {
			return digs;
		});

		postsToDraw.update((_) => {
			return posts;
		});
	}
};

export const DrawState = {
	resetSelection,
	setSelection,
	update
};
