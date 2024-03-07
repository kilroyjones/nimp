// Modules
import { get as getStore, writable, type Writable } from 'svelte/store';
import { windowWidth, windowHeight } from './world.state';
import { Data } from '$shared/data';
import { RegionHandler } from '$lib/handlers/region.handler';
import { Conversion } from '$shared/conversion';

// Types and constants
import type { Dig } from '$lib/types';
import type { DigSite, Location } from '$shared/types';
import type { Post } from '$shared/types';
import type { Region } from '$shared/models';
import { REGION_WIDTH, REGION_HEIGHT, UPDATE_DISTANCE, DigStatus } from '$shared/constants';

// Stores
export const x = writable(0);
export const y = writable(0);
export const regionKeysJoined: Writable<Array<string>> = writable(new Array());
export const regions: Writable<Map<string, Region>> = writable(new Map());
export const digsToDraw: Writable<Array<Dig>> = writable(new Array());

/**
 * Adds a list of regions to the list.
 *
 * @param {Region[]} regionsToAdd - An array of Region objects to be added.
 */
const add = function (regionsToAdd: Region[]) {
	regions.update((currentRegions) => {
		regionsToAdd.forEach((region) => {
			currentRegions.set(region.key, region);
		});
		return currentRegions;
	});
};

/**
 * Determines if a specific location within a region is claimable.
 *
 * @param {Location} loc - The location object representing the specific point in the region.
 * @param {Region} region - The region object where the location is being checked.
 * @returns {boolean} True if the location is diggable, false otherwise.
 */
const isClaimable = function (loc: Location, region: Region): boolean {
	if (Data.getCharAt(region.digs, Conversion.locationToDigIndex(loc, region)) == DigStatus.DUG) {
		return true;
	}
	return false;
};

/**
 * Determines if a specific region exists based on its key
 *
 * @param {string} key - A region key
 * @returns { boolean } - Boolean value denoting if the key exists or not
 */
const exists = function (key: string): boolean {
	if (getStore(regions).has(key)) {
		return true;
	}
	return false;
};

/**
 * Gets a region based on the region key.
 *
 * @param {string} key - A region key
 * @returns { Region | undefined } - Gets the region object based on the key
 */
const get = function (key: string): Region | undefined {
	return getStore(regions).get(key);
};

/**
 * Gets all regions.
 *
 * @returns { Map<string, Region> | undefined } - Returns the map of all regions or nothing if it's not defined
 */
const getAll = function (): Map<string, Region> | undefined {
	return getStore(regions);
};

/**
 * Retrieves the dig site information at a specific location within a region.
 *
 * @param {string} key - The key identifier of the region.
 * @param {Location} loc - The location object representing the specific point in the region.
 * @returns {DigSite | undefined} An object representing the dig site at the specified location, or undefined if the region is not found or the index is out of range.
 *
 */
const getDigSite = function (key: string, loc: Location): DigSite | undefined {
	const region = RegionState.get(key);
	if (region) {
		const idx = Conversion.locationToDigIndex(loc, region);
		console.log(idx);
		if (idx >= 0 && idx <= region.digs.length) {
			console.log('s', region.digs[idx]);
			return { idx: idx, status: Conversion.toDigStatus(region.digs[idx]) };
		}
	}
};

/**
 * Gets a list of region keys based on if they are currently viewable or not.
 *
 * @param {string} key - A region key
 *
 * This is based on the current location in the world.
 */
const getViewable = (loc: Location): Array<string> => {
	let xMin = Math.floor((loc.x - UPDATE_DISTANCE) / REGION_WIDTH);
	let yMin = Math.floor((loc.y - UPDATE_DISTANCE) / REGION_HEIGHT);
	let xMax = Math.floor((loc.x + getStore(windowWidth) + UPDATE_DISTANCE) / REGION_WIDTH);
	let yMax = Math.floor((loc.y + getStore(windowHeight) + UPDATE_DISTANCE) / REGION_HEIGHT);

	let viewable: Array<string> = Array<string>();

	for (let x = xMin; x <= xMax; x++) {
		for (let y = yMin; y <= yMax; y++) {
			viewable.push(x.toString() + y.toString());
		}
	}

	return viewable;
};

/**
 * Determines if a specific location within a region is diggable.
 *
 * @param {Location} loc - The location object representing the specific point in the region.
 * @param {Region} region - The region object where the location is being checked.
 * @returns {boolean} True if the location is diggable, false otherwise.
 */
const isDiggable = function (loc: Location, region: Region): boolean {
	if (Data.getCharAt(region.digs, Conversion.locationToDigIndex(loc, region)) == '0') {
		return true;
	}
	return false;
};

/**
 * Removes all regions from currently viewable regions that in the list.
 *
 * @param {Region[]} regionsToRemove- An array of Region objects to be removed.
 */
const remove = function (regionKeysToRemove: string[]) {
	regions.update((currentRegions) => {
		regionKeysToRemove.forEach((key) => {
			currentRegions.delete(key);
		});
		return currentRegions;
	});
};

/**
 * Update the current regions joined and left
 *
 * @param {string} key - A region key
 * @param {string} digs - The digs string
 */
const update = (loc: Location) => {
	const regionKeysView = getViewable(loc);
	const regionKeysLeave = Data.arrayDifference(getStore(regionKeysJoined), regionKeysView);
	const regionKeysJoin = Data.arrayDifference(regionKeysView, getStore(regionKeysJoined));

	console.log('JOINED', getStore(regionKeysJoined));
	console.log('TOJOIN', regionKeysJoin, regionKeysLeave);

	regionKeysJoined.set(regionKeysView);
	if (regionKeysJoin.length > 0 || regionKeysLeave.length > 0) {
		RegionState.remove(regionKeysLeave);
		RegionHandler.sendUpdateRegions(regionKeysJoin, regionKeysLeave);
	}
};

/**
 * Updates a region's digs based on the region key
 *
 * @param {string} key - A region key
 * @param {string} digs - The digs string
 */
const updateDigs = (regionKey: string, digs: string) => {
	const region = getStore(regions).get(regionKey);
	if (region) {
		region.digs = digs;
	}
};

/**
 * Updates a region with post information
 *
 * @param {string} key - A region key
 * @param {string} post - The post string
 */
const updatePosts = (regionKey: string, post: Post) => {
	const region = getStore(regions).get(regionKey);
	if (region) {
		(region.posts as any)[post.key] = post;
	}
};

export const RegionState = {
	add,
	isClaimable,
	exists,
	get,
	getAll,
	getDigSite,
	getViewable,
	isDiggable,
	remove,
	update,
	updateDigs,
	updatePosts
};
