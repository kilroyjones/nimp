// Modules
import { get as getStore, writable, type Writable } from 'svelte/store';
import { windowWidth, windowHeight } from './world.state';

// Types and constants
import type { Dig } from '$lib/types';
import type { Location, Region } from '$shared/models';

import {
	REGION_WIDTH,
	REGION_HEIGHT,
	REGION_WIDTH_CELLS,
	CELL_HEIGHT,
	CELL_WIDTH,
	UPDATE_DISTANCE
} from '$shared/constants';
import { Data } from '$shared/data';
import { RegionHandler } from '$lib/handlers/region.handler';

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
 * Determines if a specific region exists based on its key
 *
 * @param {string} key - A region key
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
 */
const get = function (key: string): Region | undefined {
	return getStore(regions).get(key);
};

/**
 * Gets all regions.
 *
 * @param {string} key - A region key
 */
const getAll = function (): Map<string, Region> | undefined {
	return getStore(regions);
};

/**
 * Gets a list of region keys based on if they are currently viewable or not.
 *
 * @param {string} key - A region key
 *
 * This is based on the current location in the world.
 */
const getViewable = (loc: Location): Array<string> => {
	let xMin = Math.floor(loc.x / REGION_WIDTH);
	let yMin = Math.floor(loc.y / REGION_HEIGHT);
	let xMax = Math.floor((loc.x + getStore(windowWidth)) / REGION_WIDTH);
	let yMax = Math.floor((loc.y + getStore(windowHeight)) / REGION_HEIGHT);

	let viewable: Array<string> = Array<string>();

	for (let xCoord = xMin; xCoord <= xMax; xCoord++) {
		for (let yCoord = yMin; yCoord <= yMax; yCoord++) {
			viewable.push(xCoord.toString() + yCoord.toString());
		}
	}

	return viewable;
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

export const RegionState = {
	add,
	exists,
	get,
	getAll,
	getViewable,
	remove,
	update,
	updateDigs
};
