import { REGION_WIDTH, REGION_HEIGHT } from "../constants";
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

export const Conversion = {
  toRegionBounds,
  toRegionKey,
  toRegionLocation,
};
