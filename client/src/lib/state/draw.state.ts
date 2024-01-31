// Modules
import { get, writable, type Writable } from 'svelte/store';
import {
	REGION_WIDTH,
	REGION_HEIGHT,
	REGION_WIDTH_CELLS,
	CELL_HEIGHT,
	CELL_WIDTH,
	UPDATE_DISTANCE
} from '$shared/constants';

// Types and constants
import type { Bounds, Location, DigSite, Region } from '$shared/models';
import { Conversion } from '$shared/conversion';
import { Data } from '$shared/data';
import { RegionState } from './region.state';
import type { Dig } from '$lib/types';

export const digsToDraw: Writable<Array<Dig>> = writable(new Array());

/**
 *
 */
const canDig = function (loc: Location, region: Region): boolean {
	if (Data.getCharAt(region.digs, Conversion.toDigIndex(loc, region)) == '0') {
		return true;
	}
	return false;
};

const getDigSite = function (key: string, loc: Location): DigSite | undefined {
	const region = RegionState.get(key);
	if (region) {
		const idx = Conversion.toDigIndex(loc, region);
		if (idx >= 0 && idx <= region.digs.length) {
			return { idx: idx, status: Conversion.toDigStatus(region.digs[idx]) };
		}
	}
};

/**
 *
 */
function getCellsToDraw(region: any, viewFrame: any) {
	let result = [];

	console.log('VIEW', viewFrame.x1, viewFrame.y1, viewFrame.x2, viewFrame.y2);
	const x1 = Math.max(region.x, viewFrame.x1);
	const y1 = Math.max(region.y, viewFrame.y1);
	const x2 = Math.min(region.x + REGION_WIDTH, viewFrame.x2);
	const y2 = Math.min(region.y + REGION_HEIGHT, viewFrame.y2);

	const startCol = Math.floor((x1 - region.x) / CELL_WIDTH);
	const startRow = Math.floor((y1 - region.y) / CELL_HEIGHT);
	const endCol = Math.floor((x2 - region.x) / CELL_WIDTH);
	const endRow = Math.floor((y2 - region.y) / CELL_HEIGHT);

	console.log('REGION OBJECTS', startRow, startCol, endRow, endCol);

	for (let row = startRow; row < endRow; row++) {
		let index = row * REGION_WIDTH_CELLS;
		for (let col = startCol; col < endCol; col++) {
			result.push({
				x: region.x + col * CELL_WIDTH,
				y: region.y + row * CELL_HEIGHT,
				value: region.digs.charAt(index + col)
			});
		}
	}
	return result;
}

/**
 *
 */
const update = function (loc: Location, windowWidth: number, windowHeight: number) {
	// Define view frame and areas (regions covered)
	const viewBounds: Bounds = {
		x1: loc.x - UPDATE_DISTANCE,
		y1: loc.y - UPDATE_DISTANCE,
		x2: loc.x + windowWidth + UPDATE_DISTANCE,
		y2: loc.y + windowHeight + UPDATE_DISTANCE
	};

	let cells: Array<Dig> = [];
	const regions = RegionState.getAll();
	if (regions) {
		regions.forEach((region) => {
			cells = cells.concat(getCellsToDraw(region, viewBounds));
		});

		digsToDraw.update((currentCells) => {
			return cells;
		});
		console.log('DRAW', get(digsToDraw));
	}
};

export const DrawState = {
	update
};
