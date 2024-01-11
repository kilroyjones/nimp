import { REGION_WIDTH, REGION_HEIGHT } from '$lib/stores/constants.store';
import { get } from 'svelte/store';

const toRegionKey = (x: number, y: number): string => {
	return (
		Math.floor(x / get(REGION_WIDTH)).toString() + Math.floor(y / get(REGION_HEIGHT)).toString()
	);
};

export const Conversion = {
	toRegionKey
};
