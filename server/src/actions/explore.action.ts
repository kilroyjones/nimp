import { Post } from "../types";
import { getRandomInt } from "../helpers/random.helper";
import { CELL_HEIGHT, CELL_HEIGHT_MAX, CELL_WIDTH, CELL_WIDTH_MAX } from "../constants";
import { Location } from "../types";

/**
 *
 */
const getMaxDim = (
  xStart: number,
  yStart: number,
  isFilled: boolean[][],
  maxSize: number
): { maxW: number; maxH: number } => {
  let x = xStart;
  let y = yStart;
  let rowCount = isFilled.length;
  let colCount = isFilled[0].length;

  let maxW = 0;
  while (x < colCount && maxW < maxSize) {
    if (isFilled[y][x]) {
      break;
    }
    maxW++;
    x++;
  }

  let maxH = 0;
  while (y < rowCount && maxH < maxSize) {
    if (isFilled[y][xStart]) {
      break;
    }
    maxH++;
    y++;
  }

  return { maxW, maxH };
};

/**
 *
 */
const fillSpace = (
  xStart: number,
  yStart: number,
  width: number,
  height: number,
  isFilled: boolean[][]
) => {
  for (let x = xStart; x < xStart + width; x++) {
    for (let y = yStart; y < yStart + height; y++) {
      isFilled[y][x] = true;
    }
  }
};

/**
 *
 * TODO
 * - Optimize this given the constants
 *
 */
const createRegion = (location: Location): Post[] => {
  const maxSize = 5;
  const isFilled: boolean[][] = Array.from({ length: CELL_HEIGHT_MAX }, () =>
    new Array(CELL_WIDTH_MAX).fill(false)
  );
  let posts: Post[] = [];

  for (let y = 0; y < CELL_HEIGHT_MAX; y++) {
    for (let x = 0; x < CELL_WIDTH_MAX; x++) {
      if (!isFilled[y][x]) {
        const { maxW, maxH } = getMaxDim(x, y, isFilled, maxSize);
        if (maxW > 0 && maxH > 0) {
          const width = getRandomInt(1, maxW);
          const height = getRandomInt(1, Math.min(width, maxH)); // Ensure width is greater or equal to height
          posts.push({
            x: x * CELL_WIDTH,
            y: y * CELL_HEIGHT,
            w: width * CELL_WIDTH,
            h: height * CELL_HEIGHT,
          });
          fillSpace(x, y, width, height, isFilled);
        }
      }
    }
  }
  return posts;
};

export const ExploreActions = {
  createRegion,
};
