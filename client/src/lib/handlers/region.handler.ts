// MODULES
import { Conversion } from '$shared/conversion';
import { socketClient } from '$lib/socket/client';
import { WorldState } from '$lib/state/world.state';

// TYPES AND CONSTANTS
import type { Location } from '$shared/types';
import type { UpdateRegionResponse } from '$shared/messages';
import { RegionState } from '$lib/state/region.state';

/**
 * Handles the digs updates.
 *
 * @param {Object} updateDigs - An object containing the region key and the updated digs string.
 * @param {string} updateDigs.regionKey - The key of the region that has been updated.
 * @param {string} updateDigs.digs - The new digs string for the region.
 *
 * This will replace a regions existing digs string.
 */
const receiveUpdateDigs = (updateDigs: { regionKey: string; digs: string }) => {
	RegionState.updateDigs(updateDigs.regionKey, updateDigs.digs);
	WorldState.update();
};

/**
 * Handles the regions updates.
 *
 * @param {UpdateRegionResponse} updateRegionResponse - The response object containing the updated regions data.
 * @param {Array<Region>} updateRegionResponse.regions - The array of updated regions.
 */
const receiveUpdateRegions = (updateRegionResponse: UpdateRegionResponse) => {
	RegionState.add(updateRegionResponse.regions);
	WorldState.update();
};

/**
 * Sends a request to create a new region based on the given location.
 *
 * @param {Location} loc - The location object representing where the new region should be created.
 */
const sendCreateRegion = (loc: Location) => {
	if (RegionState.exists(Conversion.toRegionKey(loc)) == false) {
		socketClient.send('create-region', {
			key: Conversion.toRegionKey(loc),
			loc: loc
		});
	}
};

/**
 * Sends a request to update the list of regions a player is joining or leaving.
 *
 * @param {Array<string>} regionsJoin - An array of region keys that the player is joining.
 * @param {Array<string>} regionsLeave - An array of region keys that the player is leaving.
 */
const sendUpdateRegions = (regionsJoin: Array<string>, regionsLeave: Array<string>) => {
	socketClient.send('update-regions', {
		regionsJoin: regionsJoin,
		regionsLeave: regionsLeave
	});
};

export const RegionHandler = {
	receiveUpdateDigs,
	receiveUpdateRegions,

	sendCreateRegion,
	sendUpdateRegions
};
