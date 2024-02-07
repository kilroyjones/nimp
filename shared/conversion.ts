// Constants
import { DigStatus, DigStatusMap } from "./constants";
import { REGION_WIDTH, REGION_HEIGHT, DIG_WIDTH, DIG_HEIGHT, REGION_WIDTH_DIGS } from "./constants";

// Types
import type { Location } from "./types";
import type { Region } from "./models";

/**
 * Given an index of a dig site, it'll change it to a Location
 *
 * @param {number} idx - The index of a dig site
 * @returns {Location} -
 *
 */
const digIndexToLocation = (idx: number, region: Region): Location => {
  return {
    x: (idx % DIG_WIDTH) * DIG_WIDTH + region.x,
    y: Math.floor(idx / DIG_HEIGHT) * DIG_HEIGHT + region.y,
  };
};

/**
 * Calculates the dig index in a region for a given location.
 *
 * @param {Location} loc - The location within the region.
 * @param {Region} region - The region in which the digs resides.
 * @returns {number} The index of the cell within the region that corresponds to the location.
 *
 * Since digs in a string it converts a given (x, y) location to the correcct
 * index based on the region information and the DIG_WIDTH and CELL HEIGHT.
 */
const locationToDigIndex = (loc: Location, region: Region): number => {
  return (
    Math.floor((loc.x - region.x) / DIG_WIDTH) +
    Math.floor((loc.y - region.y) / DIG_HEIGHT) * REGION_WIDTH_DIGS
  );
};

/**
 * Calculates the dig location as per the world.
 *
 * @param {Location} loc - The location of the click within the region.
 * @returns {Location} The location of the cell within
 *
 * Since digs in a string it converts a given (x, y) location to the correcct
 * index based on the region information and the DIG_WIDTH and CELL HEIGHT.
 */
const toDigLocationGlobal = (loc: Location): Location => {
  return {
    x: Math.floor(loc.x / DIG_WIDTH),
    y: Math.floor(loc.y / DIG_HEIGHT),
  };
};

/**
 * Calculates the dig location (x, y) relative to the region
 *
 * @param {Location} loc - The location of the click within the region.
 * @param {Region} region - The region in which the digs resides.
 * @returns {Location} The location of the cell within
 *
 * Since digs in a string it converts a given (x, y) location to the correcct
 * index based on the region information and the DIG_WIDTH and CELL HEIGHT.
 */
const toDigLocationLocal = (loc: Location, region: Region): Location => {
  return {
    x: Math.floor((loc.x - region.x) / DIG_WIDTH),
    y: Math.floor((loc.y - region.y) / DIG_HEIGHT),
  };
};

/**
 * Converts a string value to its corresponding DigStatus enum.
 * If the string value is not in the DigStatusMap, returns DigStatus.UNKNOWN.
 *
 * @param {string} value - The string value to convert.
 * @returns {DigStatus} The corresponding DigStatus enum for the given string value.
 */
const toDigStatus = (value: string): DigStatus => {
  return DigStatusMap[value] || DigStatus.UNKNOWN;
};

/**
 * Calculates the location of the top right Dig location on the grid
 * in real world coordinates.
 *
 * @param {Location} loc - The location of the click within the region.
 * @returns {Location} The location of the cell within
 *
 * Since digs in a string it converts a given (x, y) location to the correcct
 * index based on the region information and the DIG_WIDTH and CELL HEIGHT.
 */
const toGridLocation = (loc: Location): Location => {
  return {
    x: Math.floor(loc.x / DIG_WIDTH) * DIG_WIDTH,
    y: Math.floor(loc.y / DIG_HEIGHT) * DIG_HEIGHT,
  };
};

/**
 * Creates a Location object from x and y coordinates.
 *
 * @param {number} x - The x-coordinate of the location.
 * @param {number} y - The y-coordinate of the location.
 * @returns {Location} A Location object with the specified x and y coordinates.
 */
const toLocation = (x: number, y: number): Location => {
  return { x: x, y: y };
};

/**
 * Converts a location, which is real world coordinates, to a region key which is
 * based on units per REGION_WIDTH and REGION_HEIGHT.
 *
 * @param {Location} loc - The location to convert into a region key.
 * @returns {string} A string representing the region key for the given location.
 */
const toRegionKey = (loc: Location): string => {
  return Math.floor(loc.x / REGION_WIDTH).toString() + Math.floor(loc.y / REGION_HEIGHT).toString();
};

/**
 * Converts A Location object (shared) to a region Location
 *
 * @param Location The location object (x, y)
 * @returns {string} Returns the region location
 *
 * This should take in the adjust region location. For example, converting
 * (1, 1) to (REGION_WIDTH, REGION_HEIGHT), which are real world coordinates.
 */
const toRegionLocation = (loc: Location): Location => {
  return {
    x: Math.floor(loc.x / REGION_WIDTH) * REGION_WIDTH,
    y: Math.floor(loc.y / REGION_HEIGHT) * REGION_HEIGHT,
  };
};

export const Conversion = {
  digIndexToLocation,
  locationToDigIndex,
  toDigLocationGlobal,
  toDigLocationLocal,
  toDigStatus,
  toGridLocation,
  toLocation,
  toRegionKey,
  toRegionLocation,
};
