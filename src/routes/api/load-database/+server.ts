import { client } from '$lib/db/client/client';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	console.log('Loading dummy data...');

	await client.query(`
    DELETE Region;
  `);

	for (let x = -2; x < 2; x += 1) {
		for (let y = -2; y < 2; y += 1) {
			await client.querySingle(`
        INSERT Region {
          x := ${x * 3200},
          y := ${y * 2048},
          w := 3200,
          h := 2048
        };`);
		}
	}
	return new Response(JSON.stringify({ status: 'error' }));
};
