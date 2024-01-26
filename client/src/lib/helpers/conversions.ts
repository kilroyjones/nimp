import type { Location } from '$shared/models';
import {
	REGION_WIDTH,
	REGION_HEIGHT,
	CELL_WIDTH,
	CELL_HEIGHT,
	REGION_HEIGHT_CELLS,
	REGION_WIDTH_CELLS
} from '$lib/constants';

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

/**
 *
 */
const toCellIndex = (x: number, y: number): number => {
	return Math.floor(x / CELL_WIDTH) + Math.floor(y / CELL_HEIGHT) * REGION_WIDTH_CELLS;
};

const setCharAt = (str: string, index: number, chr: string) => {
	if (index > str.length - 1) {
		return str;
	}
	return str.substring(0, index) + chr + str.substring(index + 1);
};

const getCharAt = (str: string, index: number) => {
	if (index < str.length - 1) {
		return str[index];
	}
	return '';
};

export const Conversion = {
	getCharAt,
	setCharAt,
	toCellIndex,
	toRegionKey,
	toLocation
};
