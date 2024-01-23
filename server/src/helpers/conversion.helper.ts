import {
  REGION_WIDTH,
  REGION_HEIGHT,
  CELL_WIDTH,
  CELL_HEIGHT,
  REGION_WIDTH_CELLS,
} from "../constants";
import { Bounds, Location } from "$shared/models";

/**
 *
 */
const toRegionKey = (loc: Location): string => {
  return Math.floor(loc.x / REGION_WIDTH).toString() + Math.floor(loc.y / REGION_HEIGHT).toString();
};

/**
 *
 */
const toRegionLocation = (loc: Location): Location => {
  return {
    x: Math.floor(loc.x / REGION_WIDTH) * REGION_WIDTH,
    y: Math.floor(loc.y / REGION_HEIGHT) * REGION_HEIGHT,
  };
};

/**
 *
 */
const toRegionBounds = (loc: Location): Bounds => {
  return {
    x1: loc.x,
    y1: loc.y,
    x2: loc.x + REGION_WIDTH,
    y2: loc.y + REGION_HEIGHT,
  };
};

/**
 *
 */
const toCellIndex = (x: number, y: number): number => {
  return Math.floor(x / CELL_WIDTH) + Math.floor(y / CELL_HEIGHT) * REGION_WIDTH_CELLS;
};

export const Conversion = {
  toCellIndex,
  toRegionBounds,
  toRegionKey,
  toRegionLocation,
};
