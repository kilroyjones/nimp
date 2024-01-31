// Constants
import { DigStatus, DigStatusMap } from "./constants";
import {
  REGION_WIDTH,
  REGION_HEIGHT,
  CELL_WIDTH,
  CELL_HEIGHT,
  REGION_WIDTH_CELLS,
} from "./constants";

// Types
import type { Location } from "./models";
import type { Region } from "./models";

/**
 * Calculates the dig index in a region for a given location.
 *
 * @param {Location} loc - The location within the region.
 * @param {Region} region - The region in which the digs resides.
 * @returns {number} The index of the cell within the region that corresponds to the location.
 *
 * Since digs in a string it converts a given (x, y) location to the correcct
 * index based on the region information and the CELL_WIDTH and CELL HEIGHT.
 */
const toDigIndex = (loc: Location, region: Region): number => {
  return (
    Math.floor((loc.x - region.x) / CELL_WIDTH) +
    Math.floor((loc.y - region.y) / CELL_HEIGHT) * REGION_WIDTH_CELLS
  );
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
  toDigIndex,
  toDigStatus,
  toLocation,
  toRegionKey,
  toRegionLocation,
};
