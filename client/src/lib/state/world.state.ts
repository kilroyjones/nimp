// Modules and functions
import { ArrayOps } from '$lib/helpers/array.helpers';
import { get, writable, type Writable } from 'svelte/store';
import {
	REGION_WIDTH,
	REGION_HEIGHT,
	REGION_WIDTH_CELLS,
	REGION_HEIGHT_CELLS,
	CELL_HEIGHT,
	CELL_WIDTH,
	UPDATE_DISTANCE
} from '../constants';
import { RegionHandler } from '$lib/handlers/region.handler';

// Types
import type { Bounds, RegionClient } from '$shared/models';
import type { Regions } from '../../../../server/src/database/types/types';
import { Conversion } from '$lib/helpers/conversions';
import { setCharAt } from '$lib/helpers/string.helper';
import { socketClient } from '$lib/socket/client';
import { PlayerHandler } from '$lib/handlers/player.handler';

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

type BoundsWithKey = {
	key: string;
	bounds: Bounds;
};

// Variables
export const regionKeysJoined: Writable<Array<string>> = writable(new Array());
export let regions: Writable<Map<string, Regions>> = writable(new Map());
export let cellsToDraw: Writable<Array<Cell>> = writable(new Array());

/**
 *
 */
const addRegions = function (regionsToAdd: Regions[]) {
	regionsToAdd.forEach((region) => get(regions).set(region.key, region));
};

/**
 *
 */
const removeRegions = function (regions: Regions[]) {};

/**
 *
 */
function getCellsToDraw(region: any, viewFrame: any) {
	let result = [];

	console.log('VIEW', viewFrame.x1, viewFrame.y1, viewFrame.x2, viewFrame.y2);
	let x1 = Math.max(region.x, viewFrame.x1);
	let y1 = Math.max(region.y, viewFrame.y1);
	let x2 = Math.min(region.x + REGION_WIDTH, viewFrame.x2);
	let y2 = Math.min(region.y + REGION_HEIGHT, viewFrame.y2);

	let startCol = Math.floor((x1 - region.x) / CELL_WIDTH);
	let startRow = Math.floor((y1 - region.y) / CELL_HEIGHT);
	let endCol = Math.floor((x2 - region.x) / CELL_WIDTH);
	let endRow = Math.floor((y2 - region.y) / CELL_HEIGHT);

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

const updateDraw = function () {
	// Define view frame and areas (regions covered)
	const viewBounds: Bounds = {
		x1: get(x) - UPDATE_DISTANCE,
		y1: get(y) - UPDATE_DISTANCE,
		x2: get(x) + get(windowWidth) + UPDATE_DISTANCE,
		y2: get(y) + get(windowHeight) + UPDATE_DISTANCE
	};

	let cells: Array<Cell> = [];
	get(regions).forEach((region) => {
		cells = cells.concat(getCellsToDraw(region, viewBounds));
	});

	cellsToDraw.set(cells);
	cellsToDraw = cellsToDraw;
	console.log('CELLS', get(cellsToDraw).length);
};

/**
 *
 */
const getRegionsViewable = (x: number, y: number): Array<string> => {
	let xMin = Math.floor(x / REGION_WIDTH);
	let yMin = Math.floor(y / REGION_HEIGHT);
	let xMax = Math.floor((x + get(windowWidth)) / REGION_WIDTH);
	let yMax = Math.floor((y + get(windowHeight)) / REGION_HEIGHT);

	let regionKeysView: Array<string> = Array<string>();

	for (let xCoord = xMin; xCoord <= xMax; xCoord++) {
		for (let yCoord = yMin; yCoord <= yMax; yCoord++) {
			regionKeysView.push(xCoord.toString() + yCoord.toString());
		}
	}

	return regionKeysView;
};

/**
 *
 */
export const updateRegionSet = (x: number, y: number) => {
	let regionKeysView = getRegionsViewable(x, y);
	let regionKeysLeave = ArrayOps.difference(get(regionKeysJoined), regionKeysView);
	let regionKeysJoin = ArrayOps.difference(regionKeysView, get(regionKeysJoined));

	console.log(regionKeysJoin, regionKeysLeave);
	regionKeysJoined.set(regionKeysView);
	RegionHandler.sendUpdateRegions(regionKeysJoin, regionKeysLeave);
};

/**
 *
 */
export const updateDigSite = (x: number, y: number) => {
	const key = Conversion.toRegionKey(x, y);
	const region = get(regions).get(key);
	if (region) {
		console.log(key, region.key);
		const index = Conversion.toCellIndex(x, y);
		console.log('index', index);
		if (region.digs[index] == '0') {
			console.log('Update');
			region.digs = setCharAt(region.digs, index, '1');
			console.log(region.digs);
			regions = regions;
			socketClient.send('dig', { x: x, y: y });
			// console.log(socketClient.)
		}
	}
};

/**
 *
 */
export const temp = (regionKey: string, digs: string) => {
	const region = get(regions).get(regionKey);
	if (region) {
		console.log('updatings');
		region.digs = digs;
		updateDraw();
	}
};

/**
 *
 */
export const WorldState = {
	// Variables

	// Functions
	addRegions,
	removeRegions,
	updateDigSite,
	updateRegionSet,
	updateDraw,
	temp
};
