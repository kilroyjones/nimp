// Modules
import { Conversion } from '$shared/conversion';
import { ActionHandler } from '$lib/handlers/action.handler';
import { RegionHandler } from '$lib/handlers/region.handler';

// Types and constants
import { DigStatus } from '$shared/constants';
import type { Location } from '$shared/models';
import { RegionState } from '$lib/state/region.state';

/**
 * Creates a new region based on the provided location if it doesn't already exist.
 *
 * @param {Location} loc - The location object used to determine the region to create.
 */
const createRegion = function (loc: Location) {
	if (RegionState.exists(Conversion.toRegionKey(loc)) == false) {
		RegionHandler.sendCreateRegion(loc);
	}
};

/**
 * Handles the action of digging at a site located at a specific location.
 *
 * @param {Location} loc - The location object representing the dig site's location.
 */
const digSite = function (loc: Location) {
	const key = Conversion.toRegionKey(loc);
	const site = RegionState.getDigSite(key, loc);
	if (site && site.status == DigStatus.UNCLAIMED) {
		ActionHandler.sendDig(key, site.idx);
	}
};

export const WorldAction = {
	createRegion,
	digSite
};
