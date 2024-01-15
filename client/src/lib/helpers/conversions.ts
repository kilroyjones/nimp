import type { Location } from '$shared/models';
import { REGION_WIDTH, REGION_HEIGHT } from '$lib/constants';

/**
 *
 */
const toRegionKey = (x: number, y: number): string => {
	return Math.floor(x / REGION_WIDTH).toString() + Math.floor(y / REGION_HEIGHT).toString();
};

/**
 *
 */
const toLocation = (x: number, y: number): Location => {
	return { x: x, y: y };
};

export const Conversion = {
	toRegionKey,
	toLocation
};
