import { client } from '$lib/db/client/client';
import { insertRegion, type InsertRegionReturns, getRegion } from '$lib/db/queries/queries';
import type { Post } from '../types/world';
import { REGION_WIDTH, REGION_HEIGHT, CELL_WIDTH, CELL_HEIGHT } from '$lib/constants.store';

/**
 *
 */
const getRandomInt = (a: number, b: number): number => {
	return Math.floor(Math.random() * (b - a + 1)) + a;
};

/**
 *
 */
const getPostMaxDimensions = (
	xStart: number,
	yStart: number,
	isFilled: boolean[][],
	maxSize: number
): { postMaxWidth: number; postMaxHeight: number } => {
	let x = xStart;
	let y = yStart;
	let rowCount = isFilled.length;
	let colCount = isFilled[0].length;
	let postMaxWidth = 0;
	let postMaxHeight = 0;

	while (x < colCount && postMaxWidth < maxSize) {
		if (isFilled[y][x]) {
			break;
		}
		postMaxWidth++;
		x++;
	}

	while (y < rowCount && postMaxHeight < maxSize) {
		if (isFilled[y][xStart]) {
			break;
		}
		postMaxHeight++;
		y++;
	}

	return { postMaxWidth, postMaxHeight };
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
 */
const generatePosts = (
	regionWidth: number,
	regionHeight: number,
	cellWidth: number,
	cellHeight: number,
	xOffset: number,
	yOffset: number
): Post[] => {
	const xMax = Math.floor(regionWidth / cellWidth);
	const yMax = Math.floor(regionHeight / cellHeight);
	const maxSize = 5;
	const isFilled: boolean[][] = Array.from({ length: yMax }, () => new Array(xMax).fill(false));

	let posts: Post[] = [];

	for (let y = 0; y < yMax; y++) {
		for (let x = 0; x < xMax; x++) {
			if (!isFilled[y][x]) {
				const { postMaxWidth, postMaxHeight } = getPostMaxDimensions(x, y, isFilled, maxSize);
				if (postMaxWidth > 0 && postMaxHeight > 0) {
					const postWidth = getRandomInt(1, postMaxWidth);
					const postHeight = getRandomInt(1, Math.min(postWidth, postMaxHeight));
					posts.push({
						x: xOffset * REGION_WIDTH + x * cellWidth,
						y: yOffset * REGION_HEIGHT + y * cellHeight,
						w: postWidth * cellWidth,
						h: postHeight * cellHeight
					});
					fillSpace(x, y, postWidth, postHeight, isFilled);
				}
			}
		}
	}

	return posts;
};

const region = async (x: number, y: number): Promise<InsertRegionReturns | null> => {
	const posts = generatePosts(REGION_WIDTH, REGION_HEIGHT, CELL_WIDTH, CELL_HEIGHT, x, y);
	if (posts) {
		return await insertRegion(client, { x, y, posts });
	}
	return null;
};

export const Establish = {
	region
};
