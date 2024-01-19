// Modules and functions
import { difference } from '$lib/helpers/set';
import { get, writable, type Writable } from 'svelte/store';
import {
	REGION_WIDTH,
	REGION_HEIGHT,
	REGION_WIDTH_CELLS,
	REGION_HEIGHT_CELLS,
	CELL_HEIGHT,
	CELL_WIDTH
} from '../constants';
import { RegionHandler } from '$lib/handlers/region.handler';

// Types
import type { RegionClient } from '$shared/models';
import type { Regions } from '../../../../server/src/database/types/types';

// Stores
export const windowWidth = writable(0);
export const windowHeight = writable(0);
export const x = writable(0);
export const y = writable(0);

type Cell = {
	x: number;
	y: number;
	value: string;
};

// Variables
export const regionsJoined: Writable<Set<string>> = writable(new Set());
export const regionsData: Writable<Map<string, Regions>> = writable(new Map());
export let cellsToDraw: Writable<Array<Cell>> = writable(new Array());

/**
 *
 */
const addRegions = function (regions: Regions[]) {
	regions.forEach((region) => get(regionsData).set(region.key, region));
	console.log('DATA', get(regionsData));
};

/**
 *
 */
const removeRegions = function (regions: RegionClient[]) {};

// {key: '0-1', x1: 0, y1: -2048, x2: 3200, y2: 0}
//             {x1: -21, y1: -611, x2: -151, y2: 944}

function intersection(rect1: any, rect2: any) {
	console.log('RECTS', rect1, rect2);
	// Calculate the coordinates of the intersection rectangle
	let x1 = Math.max(rect1.x1, rect2.x1);
	let y1 = Math.max(rect1.y1, rect2.y1);
	let x2 = Math.min(rect1.x2, rect2.x2);
	let y2 = Math.min(rect1.y2, rect2.y2);

	// Check if the rectangles intersect
	if (x1 < x2 && y1 < y2) {
		// Return the coordinates of the intersecting rectangle
		return { key: rect1.key, x1, y1, x2, y2 };
	} else {
		// Rectangles do not intersect
		return null;
	}
}

// Region is the actual Region object from the DB
// Intersectin areas are the spaces intersecting with real world coordinates
// ViewFrame is the current view in real world coordinates
function extractRegionObjects(region: any, intersectingArea: any, viewFrame: any) {
	let result = [];

	console.log();
	// Region Covered
	// {key: '00', x1: 0, y1: 0, x2: 3200, y2: 2048}
	// or
	// {key: '-1-1', x1: -3200, y1: -2048, x2: 0, y2: 0}

	// Intersection
	// {key: '00', x1: 0, y1: 0, x2: 320, y2: 813}
	// {key: '-1-1', x1: -152, y1: -140, x2: 0, y2: 0}

	// Calculate row and column range in the intersecting area
	let regionXActual = region.x * REGION_WIDTH;
	let regionYActual = region.y * REGION_HEIGHT;

	let x1 = Math.max(regionXActual, viewFrame.x1);
	let y1 = Math.max(regionYActual, viewFrame.y1);
	let x2 = Math.min(regionXActual + REGION_WIDTH, viewFrame.x2);
	let y2 = Math.min(regionYActual + REGION_HEIGHT, viewFrame.y2);

	console.log(x1, y1, x2, y2);
	console.log(regionXActual, regionYActual);

	// Convert these coordinates to local (region-based) coordinates
	let startCol = Math.floor((x1 - regionXActual) / CELL_WIDTH);
	let startRow = Math.floor((y1 - regionYActual) / CELL_HEIGHT);
	let endCol = Math.floor((x2 - regionXActual) / CELL_WIDTH);
	let endRow = Math.floor((y2 - regionYActual) / CELL_HEIGHT);

	// let startRow = Math.max(0, Math.floor((intersectingArea.y1 - (regionYActual) / CELL_HEIGHT));
	// let endRow = Math.min(REGION_HEIGHT, Math.floor((intersectingArea.y2 - regionYActual) / CELL_HEIGHT));
	// let startCol = Math.max(0, Math.floor((intersectingArea.x1 - regionXActual) / CELL_WIDTH));
	// let endCol = Math.min(REGION_WIDTH, Math.floor((intersectingArea.x2 - regionXActual) / CELL_WIDTH));

	console.log('REGION OBJECTS', startRow, startCol, endRow, endCol);
	for (let row = startRow; row < endRow; row++) {
		for (let col = startCol; col < endCol; col++) {
			let index = row * REGION_WIDTH_CELLS + col;
			let value = region.digs.charAt(index);
			let x = regionXActual + col;
			let y = regionYActual + row;
			result.push({ x: x * CELL_WIDTH, y: y * CELL_HEIGHT, value });
		}
	}

	cellsToDraw.set(result);
	cellsToDraw = cellsToDraw;
	return result;
}

const updateDrawnCells = function () {
	// Define view frame and areas (regions covered)
	let viewFrame = {
		x1: get(x),
		y1: get(y),
		x2: get(x) + get(windowWidth),
		y2: get(y) + get(windowHeight)
	};

	let regionsCovered: any = [];
	get(regionsData).forEach((region: Regions) => {
		regionsCovered.push({
			key: region.key,
			x1: region.x * REGION_WIDTH,
			y1: region.y * REGION_HEIGHT,
			x2: region.x * REGION_WIDTH + REGION_WIDTH,
			y2: region.y * REGION_HEIGHT + REGION_HEIGHT
		});
	});

	console.log('REGIONS COVERED: ', regionsCovered);

	// Find instersectiong spaces for tiles
	let intersectingRegions = regionsCovered
		.map((region: any) => intersection(region, viewFrame))
		.filter((regionSubsection: any) => regionSubsection !== null);

	console.log('INTERSECTING:', intersectingRegions);

	let temp: any[] = [];
	// Assuming REGION_WIDTH and REGION_HEIGHT are defined
	intersectingRegions.forEach((intersectingArea: any) => {
		// Find the corresponding region data
		const region = get(regionsData).get(intersectingArea.key);

		if (region) {
			// Extract cell data from the region
			const cells = extractRegionObjects(region, intersectingArea, viewFrame);
			temp = temp.concat(cells);
		}
	});

	console.log('REGIONS', temp); // This will log the array of Cell objects
};
/**
 *
 */
export const updateRegionSet = (x: number, y: number) => {
	let xMin = Math.floor(x / REGION_WIDTH);
	let yMin = Math.floor(y / REGION_HEIGHT);
	let xMax = Math.floor((x + get(windowWidth)) / REGION_WIDTH);
	let yMax = Math.floor((y + get(windowHeight)) / REGION_HEIGHT);

	let regionsViewable: Set<string> = new Set<string>();

	// Determine what is currently viewable
	for (let xCoord = xMin; xCoord <= xMax; xCoord++) {
		for (let yCoord = yMin; yCoord <= yMax; yCoord++) {
			const key = xCoord.toString() + yCoord.toString();
			regionsViewable.add(key);
		}
	}

	// console.log(`Viewable: ${Array.from(regionsViewable)}`);

	let regionsLeave: Set<string> = difference(get(regionsJoined), regionsViewable);
	let regionsJoin: Set<string> = difference(regionsViewable, get(regionsJoined));
	regionsJoined.set(regionsViewable);

	// console.log(
	// 	`Join: ${Array.from(regionsJoin)} - Leave: ${Array.from(regionsLeave)} - Joined: ${Array.from(
	// 		regionsJoined
	// 	)}`
	// );
	console.log('SENDING UPDATE');
	RegionHandler.sendUpdateRegions(Array.from(regionsJoin), Array.from(regionsLeave));
	updateDrawnCells();
};

/**
 *
 */
export const WorldState = {
	// Variables

	// Functions
	addRegions,
	removeRegions,
	updateRegionSet,
	updateDrawnCells
};
