import { client } from '$lib/db/client/client';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { Establish } from '$root/lib/world/establish';
import { getRegion } from '$root/lib/db/queries/queries';
import type { GetRegionReturns } from '$root/lib/db/queries/queries';

const MiningSchema = z.object({
	rx: z.number(),
	ry: z.number(),
	cx: z.number(),
	cy: z.number()
});

type MiningReqest = z.infer<typeof MiningSchema>;

export const POST: RequestHandler = async ({ request }) => {
	let data: MiningReqest | null;

	try {
		data = await request.json();
		console.log(data);
	} catch (error: any) {
		return new Response(JSON.stringify({ err: true, msg: 'Invalid JSON' }));
	}

	if (!data) {
		return new Response(JSON.stringify({ err: true, msg: 'Invalid format' }));
	}

	const region: GetRegionReturns | null = await getRegion(client, { x: data.rx, y: data.ry });
	if (region) {
		return new Response(JSON.stringify({ err: false, msg: region }));
	}

	const newRegion = await Establish.region(data.rx, data.ry);
	if (newRegion) {
		return new Response(JSON.stringify({ err: false, msg: newRegion }));
	}

	return new Response(JSON.stringify({ err: true, msg: 'Error establish or retrieving region' }));
};
