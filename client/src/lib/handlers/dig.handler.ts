import { Conversion } from '$lib/helpers/conversions';
import { socketClient } from '$lib/socket/client';
import { WorldState } from '$lib/state/world.state';
import type { UpdateRegionResponse } from '$shared/messages';

/**
 * Send messages
 */
const sendDig = (key: string, x: number, y: number) => {
	socketClient.send('dig', {
		key: key,
		loc: { x: x, y: y }
	});
};

export const DigHandler = {
	sendDig
};
