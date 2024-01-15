// Modules and functions
import { difference } from '$lib/helpers/set';
import { get, writable } from 'svelte/store';
import { REGION_WIDTH, REGION_HEIGHT } from '../constants';
import { WorldHandler } from '$lib/handlers/world.handler';

// Types
import type { RegionClient } from '$shared/models';

// Stores
export const windowWidth = writable(0);
export const windowHeight = writable(0);
export const x = writable(0);
export const y = writable(0);

// Variables
export let regionsJoined: Set<string> = new Set<string>();
export let regionsData: Map<string, RegionClient> = new Map<string, RegionClient>();

/**
 *
 */
const addRegions = function (regions: RegionClient[]) {
	regions.forEach((region) => regionsData.set(region.key, region));
	// TODO: Is this still necessary??
	regions = regions;
};

/**
 *
 */
const removeRegions = function (regions: RegionClient[]) {};

/**
 *
 */
export const updateRegionSet = () => {
	let xMin = Math.floor(get(x) / REGION_WIDTH);
	let yMin = Math.floor(get(y) / REGION_HEIGHT);
	let xMax = Math.floor(get(x) + get(windowWidth) / REGION_WIDTH);
	let yMax = Math.floor(get(y) + get(windowHeight) / REGION_HEIGHT);

	let regionsViewable: Set<string> = new Set<string>();

	// Determine what is currently viewable
	for (let xCoord = xMin; xCoord <= xMax; xCoord++) {
		for (let yCoord = yMin; yCoord <= yMax; yCoord++) {
			const key = xCoord.toString() + yCoord.toString();
			regionsViewable.add(key);
		}
	}

	let regionsLeave: Set<string> = difference(regionsJoined, regionsViewable);
	let regionsJoin: Set<string> = difference(regionsViewable, regionsJoined);
	regionsJoined = regionsViewable;

	WorldHandler.sendUpdateRegions(Array.from(regionsJoin), Array.from(regionsLeave));
};

/**
 *
 */
export const WorldState = {
	// Variables

	// Functions
	addRegions,
	removeRegions,
	updateRegionSet
};
