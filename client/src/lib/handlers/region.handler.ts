import { Conversion } from '$lib/helpers/conversions';
import { socketClient } from '$lib/socket/client';
import { WorldState } from '$lib/state/world.state';
import type { UpdateRegionResponse } from '$shared/messages';

/**
 * Receive messages
 */
const receiveUpdateDigs = (updateDigs: { regionKey: string; digs: string }) => {
	WorldState.temp(updateDigs.regionKey, updateDigs.digs);
};

const receiveUpdateRegions = (updateRegionResponse: UpdateRegionResponse) => {
	// console.log('In - [Update regions] -', updateRegionResponse.regions.length);
	WorldState.addRegions(updateRegionResponse.regions);
	WorldState.updateDraw();
};

/**
 * Send messages
 */
const sendUpdateRegions = (regionsJoin: Array<string>, regionsLeave: Array<string>) => {
	socketClient.send('update-regions', {
		regionsJoin: regionsJoin,
		regionsLeave: regionsLeave
	});
};

const sendCreateRegion = (x: number, y: number) => {
	console.log(`[WorldHandler.create] (${x},${y})`);
	socketClient.send('create-region', {
		key: Conversion.toRegionKey(x, y),
		loc: Conversion.toLocation(x, y)
	});
};

export const RegionHandler = {
	receiveUpdateDigs,
	receiveUpdateRegions,

	sendCreateRegion,
	sendUpdateRegions
};
