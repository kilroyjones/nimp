import { browser } from '$app/environment';
import { Conversion } from '$lib/helpers/conversions';
import { socketClient } from '$lib/socket/client';

/**
 * Receive messages
 */
const receiveUpdateRegions = () => {
	// socketClient.send('update-regions', {
	// 	regionsJoin: regionsJoin,
	// 	regionsLeave: regionsLeave
	// });
};

/**
 * Send messages
 */
const sendUpdateRegions = (regionsJoin: Array<string>, regionsLeave: Array<string>) => {
	console.log(regionsJoin, '---', regionsLeave);
	socketClient.send('update-regions', {
		regionsJoin: regionsJoin,
		regionsLeave: regionsLeave
	});
};

const sendCreateRegion = (x: number, y: number) => {
	socketClient.send('create-region', {
		key: Conversion.toRegionKey(x, y),
		loc: Conversion.toLocation(x, y)
	});
};

export const WorldHandler = {
	receiveUpdateRegions,

	sendCreateRegion,
	sendUpdateRegions
};
