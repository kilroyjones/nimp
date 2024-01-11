import { REGION_WIDTH, REGION_HEIGHT } from "../constants";

const toRegionKey = (x: number, y: number): string => {
  return Math.floor(x / REGION_WIDTH).toString() + Math.floor(y / REGION_HEIGHT).toString();
};

export const Conversion = {
  toRegionKey,
};
