import { client } from '$lib/db/client/client';
import e from '$root/lib/db/builder/';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import type { Region } from '$root/lib/db/types/types';
import { rshift } from 'edgedb/dist/primitives/bigint';

const MiningSchema = z.object({
	rx: z.number(),
	ry: z.number(),
	cx: z.number(),
	cy: z.number()
});

type MiningReqest = z.infer<typeof MiningSchema>;

// function getRandomInt(a: number, b: number): number {
// 	if (a < b) {
// 		return Math.floor(Math.random() * (b - a + 1)) + a;
// 	} else if (a == b) {
// 		return a;
// 	}
// 	throw new Error('First value must be less than the second');
// }

// const getMaxDim = (
// 	rStart: number,
// 	cStart: number,
// 	rMax: number,
// 	cMax: number,
// 	isFilled: boolean[][],
// 	maxSize: number
// ): { maxW: number; maxH: number } => {
// 	let r = rStart;
// 	let c = cStart;
// 	let maxW = 0;
// 	let maxH = 0;
// 	while (c < cMax && c < c + maxSize) {
// 		if (isFilled[r][c]) break;
// 		c = c + 1;
// 	}

// 	maxW = c - cStart - 1;
// 	maxH = maxW;

// 	if (r + maxH > rMax) {
// 		// console.log('Here', maxH, rMax, maxW);
// 		maxH = rMax - r;
// 	}
// 	return { maxW, maxH };
// };

// const fillSpace = (
// 	rStart: number,
// 	cStart: number,
// 	width: number,
// 	height: number,
// 	isFilled: boolean[][]
// ) => {
// 	for (let r = rStart; r < rStart + height; r++) {
// 		for (let c = cStart; c < cStart + width; c++) {
// 			if (r < isFilled.length && c < isFilled[0].length) {
// 				isFilled[r][c] = true;
// 			}
// 		}
// 	}
// };

// const generatePosts = (width: number, height: number, dim: number) => {
// 	let rMax = Math.floor(height / dim);
// 	let cMax = Math.floor(width / dim);
// 	const maxSize = 5;
// 	const isFilled: boolean[][] = new Array(rMax).fill(null).map(() => new Array(cMax).fill(false));
// 	let posts: Array<any> = [];
// 	for (let r = 0; r < rMax; r++) {
// 		for (let c = 0; c < cMax; c++) {
// 			const { maxW, maxH } = getMaxDim(r, c, rMax, cMax, isFilled, maxSize);
// 			console.log('DIM:', maxW, maxH);
// 			if (maxW > 0) {
// 				try {
// 					const width = getRandomInt(1, maxW);
// 					const height = getRandomInt(1, maxH);
// 					posts.push({ x: c, y: r, w: width, h: height });
// 					fillSpace(r, c, width, height, isFilled);
// 				} catch (error: any) {
// 					console.log('Error', error);
// 					break;
// 				}
// 			}
// 		}
// 	}
// 	console.log(posts);
// 	console.log(isFilled);
// 	// console.log(isFilled);
// 	return posts;
// };
type Post = { x: number; y: number; w: number; h: number };

const getRandomInt = (a: number, b: number): number => {
	return Math.floor(Math.random() * (b - a + 1)) + a;
};

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

const generatePosts = (width: number, height: number, dim: number): Post[] => {
	let xMax = Math.floor(width / dim);
	let yMax = Math.floor(height / dim);
	const maxSize = 5;
	const isFilled: boolean[][] = Array.from({ length: yMax }, () => new Array(xMax).fill(false));
	let posts: Post[] = [];

	for (let y = 0; y < yMax; y++) {
		for (let x = 0; x < xMax; x++) {
			if (!isFilled[y][x]) {
				const { maxW, maxH } = getMaxDim(x, y, isFilled, maxSize);
				if (maxW > 0 && maxH > 0) {
					const width = getRandomInt(1, maxW);
					const height = getRandomInt(1, Math.min(width, maxH)); // Ensure width is greater or equal to height
					posts.push({
						x: (x * dim) / 64,
						y: (y * dim) / 64,
						w: (width * dim) / 64,
						h: (height * dim) / 64
					});
					fillSpace(x, y, width, height, isFilled);
				}
			}
		}
	}

	console.log(isFilled);
	console.log(posts);
	return posts;
};

const createRegion = async (x: number, y: number): Promise<null> => {
	let posts = generatePosts(384, 192, 64);
	const insertQuery = e
		.select(
			e.insert(e.Region, {
				x: x,
				y: y,
				posts: JSON.parse(JSON.stringify(posts))
			}),
			(region) => ({
				x: true,
				y: true,
				posts: true
			})
		)
		.toEdgeQL();
	let res = await client.execute(insertQuery);
	console.log(res);
	return null;
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data: MiningReqest | null = await request.json();
		if (data) {
			const query = e
				.select(e.Region, (region) => ({
					x: true,
					y: true,
					posts: true,
					filter: e.op(e.op(region.x, '=', data.rx), 'and', e.op(region.y, '=', data.ry)),
					limit: 1
				}))
				.toEdgeQL();
			let region: Region | null = await client.querySingle(query);

			console.log(region);
			if (!region) {
				region = await createRegion(data.rx, data.ry);
				console.log(region);
			} else {
				console.log('REGION: ', region.x, '-', region.y);
				console.log(region);
				return new Response(JSON.stringify({ err: false, msg: region }));
			}
		}
	} catch (error: any) {
		console.log('ERROR: ', error);
		return new Response(JSON.stringify({ err: true, msg: 'Invalid format' }));
	}

	return new Response(JSON.stringify({ err: true, msg: 'Invalid format' }));
};
