import { client } from '$lib/db/client/client';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { Establish } from '$root/lib/world/establish';
import { getRegions } from '$root/lib/db/queries/queries';
import type { GetRegionsReturns } from '$root/lib/db/queries/queries';

const regionCoordinates = z.object({
	x: z.number(),
	y: z.number()
});

const RegionsSchema = z.object({
	c: z.array(regionCoordinates)
});

type RegionsRequest = z.infer<typeof RegionsSchema>;

export const POST: RequestHandler = async ({ request }) => {
	let data: RegionsRequest | null;

	try {
		data = await request.json();
	} catch (error: any) {
		return new Response(JSON.stringify({ err: true, msg: 'Invalid JSON' }));
	}

	if (!data) {
		return new Response(JSON.stringify({ err: true, msg: 'Invalid format' }));
	}

	const coordinates: [number, number][] = data.c.map((coord) => [coord.x, coord.y]);
	let regions = await getRegions(client, { coordinates });

	if (regions) {
		return new Response(JSON.stringify({ err: false, msg: regions }));
	}

	return new Response(JSON.stringify({ err: true, msg: 'Error retrieving regions' }));
};
