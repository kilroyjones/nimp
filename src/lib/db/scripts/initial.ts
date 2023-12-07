import e from '../builder'; // Adjust the path to your edgeql-js generated file
import { client } from '../client/client';

function generateRandomRegions(count: number): Array<{ x: number; y: number }> {
	const regions = [];
	const dim = 3;
	const w = 3200;
	const h = 2048;

	for (let x = -dim; x < dim; x++) {
		for (let y = -dim; y < dim; y++) {
			regions.push({
				x: x,
				y: y
			});
		}
	}
	return regions;
}

async function insertRegions() {
	const regions = generateRandomRegions(10);

	const deleteQuery = e.delete(e.Region).toEdgeQL();
	await client.execute(deleteQuery);

	// for (const region of regions) {
	// 	const insertQuery = e
	// 		.insert(e.Region, {
	// 			x: region.x,
	// 			y: region.y
	// 		})
	// 		.toEdgeQL();

	// 	await client.execute(insertQuery);
	// }
}

insertRegions().catch((err) => console.error('Failed to insert regions:', err));

// interface Block {
// 	x: number;
// 	y: number;
// 	w: number;
// 	h: number;
// }

// function generateBlocks(fullWidth: number, fullHeight: number, blockSize: number): Block[] {
// 	const numBlocksX: number = Math.floor(fullWidth / blockSize);
// 	const numBlocksY: number = Math.floor(fullHeight / blockSize);
// 	const occupied: boolean[][] = Array.from({ length: numBlocksX }, () =>
// 		Array(numBlocksY).fill(false)
// 	);
// 	const blocks: Block[] = [];

// 	function isFree(x: number, y: number, w: number, h: number): boolean {
// 		for (let i = x; i < Math.min(x + w, numBlocksX); i++) {
// 			for (let j = y; j < Math.min(y + h, numBlocksY); j++) {
// 				if (occupied[i][j]) {
// 					return false;
// 				}
// 			}
// 		}
// 		return true;
// 	}

// 	function fill(x: number, y: number, w: number, h: number): void {
// 		for (let i = x; i < x + w; i++) {
// 			for (let j = y; j < y + h; j++) {
// 				if (i < numBlocksX && j < numBlocksY) {
// 					occupied[i][j] = true;
// 				}
// 			}
// 		}
// 	}

// 	for (let x = 0; x < numBlocksX; x++) {
// 		for (let y = 0; y < numBlocksY; y++) {
// 			if (!occupied[x][y]) {
// 				const maxBlockSize: number = 5;
// 				const w: number = Math.floor(Math.random() * (maxBlockSize - 1)) + 1;
// 				const h: number = Math.floor(Math.random() * (maxBlockSize - 1)) + 1;
// 				if (isFree(x, y, w, h)) {
// 					fill(x, y, w, h);
// 					blocks.push({
// 						x: x * blockSize,
// 						y: y * blockSize,
// 						w: w * blockSize,
// 						h: h * blockSize
// 					});
// 				}
// 			}
// 		}
// 	}
// 	return blocks;
// }
// interface Block {
// 	x: number;
// 	y: number;
// 	w: number;
// 	h: number;
// }

// function generateBlocks(fullWidth: number, fullHeight: number, blockSize: number): Block[] {
// 	const numBlocksX: number = Math.floor(fullWidth / blockSize);
// 	const numBlocksY: number = Math.floor(fullHeight / blockSize);
// 	const occupied: boolean[][] = Array.from({ length: numBlocksX }, () =>
// 		Array(numBlocksY).fill(false)
// 	);
// 	const blocks: Block[] = [];

// 	function isFree(x: number, y: number, w: number, h: number): boolean {
// 		for (let i = x; i < Math.min(x + w, numBlocksX); i++) {
// 			for (let j = y; j < Math.min(y + h, numBlocksY); j++) {
// 				if (occupied[i][j]) {
// 					return false;
// 				}
// 			}
// 		}
// 		return true;
// 	}

// 	function fill(x: number, y: number, w: number, h: number): void {
// 		for (let i = x; i < x + w; i++) {
// 			for (let j = y; j < y + h; j++) {
// 				if (i < numBlocksX && j < numBlocksY) {
// 					occupied[i][j] = true;
// 				}
// 			}
// 		}
// 	}

// 	for (let x = 0; x < numBlocksX; x++) {
// 		for (let y = 0; y < numBlocksY; y++) {
// 			if (!occupied[x][y]) {
// 				const maxBlockSize: number = 5;
// 				let w: number = Math.floor(Math.random() * (maxBlockSize - 1)) + 1;
// 				let h: number = Math.floor(Math.random() * (maxBlockSize - 1)) + 1;

// 				if (w < h) {
// 					// Swap w and h to ensure w is never less than h
// 					[w, h] = [h, w];
// 				}

// 				if (isFree(x, y, w, h)) {
// 					fill(x, y, w, h);
// 					blocks.push({
// 						x: x * blockSize,
// 						y: y * blockSize,
// 						w: w * blockSize,
// 						h: h * blockSize
// 					});
// 				}
// 			}
// 		}
// 	}
// 	return blocks;
// }

// const blocks: Block[] = generateBlocks(3200, 2048, 64);
// console.log(blocks);
