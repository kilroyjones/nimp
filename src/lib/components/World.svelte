<script lang="ts">
	import { onMount } from 'svelte';
	import { x, y, windowHeight, windowWidth, regionsInView } from '$lib/world.store';
	import { REGION_WIDTH, REGION_HEIGHT, CELL_WIDTH, CELL_HEIGHT } from '$lib/constants.store';

	let previousX: number;
	let previousY: number;
	let dragging = false;
	let previousDblClickX: number = 0;
	let previousDblClickY: number = 0;
	let region: any;
	let posts: any = null;

	async function determineRegionsInView() {
		let xMin = Math.floor($x / REGION_WIDTH);
		let yMin = Math.floor($y / REGION_HEIGHT);
		let xMax = Math.floor(($x + $windowWidth) / REGION_WIDTH);
		let yMax = Math.floor(($y + $windowHeight) / REGION_HEIGHT);

		console.log(xMin, yMin, xMax, yMax);
		let views = [];
		for (let xCoord = xMin; xCoord <= xMax; xCoord++) {
			for (let yCoord = yMin; yCoord <= yMax; yCoord++) {
				// console.log('(', xCoord, ', ', yCoord, ')');
				views.push({ x: xCoord, y: yCoord });
			}
		}
		const coordinates: [number, number][] = views.map((coord: any) => [coord.x, coord.y]);
		$regionsInView = coordinates;

		const response = await fetch('/api/world/update', {
			method: 'POST',
			body: JSON.stringify({
				c: views
			}),
			headers: {
				'content-type': 'application/json'
			}
		});
		let msg = await response.json();
		posts = [];
		if (!msg.err) {
			let regions = msg.msg;
			for (const region of regions) {
				posts = posts.concat(region.posts);
			}
		}
	}

	function handleStartDrag(event: MouseEvent) {
		previousX = event.clientX;
		previousY = event.clientY;
		dragging = true;
	}

	async function handleMove(event: MouseEvent) {
		if (dragging) {
			await determineRegionsInView();
			$x = $x - event.clientX + previousX;
			$y = $y - event.clientY + previousY;
			previousX = event.clientX;
			previousY = event.clientY;
		}
	}

	function handleStopDrag(event: MouseEvent) {
		console.log('Stop');
		dragging = false;
	}

	async function handleDoubleClick(event: MouseEvent) {
		const clickX = Math.floor(event.clientX + $x);
		const clickY = Math.floor(event.clientY + $y);
		const regionX = Math.floor(clickX / REGION_WIDTH);
		const regionY = Math.floor(clickX / REGION_HEIGHT);
		const cellX = Math.floor(clickX / CELL_WIDTH) % Math.floor(REGION_WIDTH / CELL_WIDTH);
		const cellY = Math.floor(clickY / CELL_HEIGHT) % Math.floor(REGION_HEIGHT / CELL_HEIGHT);

		previousDblClickX = clickX;
		previousDblClickY = clickY;

		console.log('LOC:', clickX, clickY, Math.floor(clickX / REGION_WIDTH));
		const response = await fetch('/api/world/mine', {
			method: 'POST',
			body: JSON.stringify({
				rx: Math.floor(clickX / REGION_WIDTH),
				ry: Math.floor(clickY / REGION_HEIGHT),
				cx: 0,
				cy: 0
			}),
			headers: {
				'content-type': 'application/json'
			}
		});
		region = await response.json();
	}

	// TODO: Testing only
	onMount(async () => {});

	$: backgroundPosition = `${-$x}px ${-$y}px`;
</script>

<svelte:window
	on:mousedown={handleStartDrag}
	on:mousemove={handleMove}
	on:mouseup={handleStopDrag}
	on:mouseleave={handleStopDrag}
	on:click|preventDefault
	on:dblclick={handleDoubleClick}
/>

{#if $windowHeight}
	<div class="grid" style="background-position: {backgroundPosition};" />
	{#if posts != null}
		{#each posts as post}
			<div
				style="
					background-color: #ff00f0;
					position: absolute;
				    top: {post.y - $y}px;
				    left: {post.x - $x}px;
					border: 1px;
					border-radius: 4px;
					box-shadow: inset 0 0 0 4px #ffffff; 
					border-color: #fff;
				    width: {post.w}px;
				    height: {post.h}px;
					"
			/>
		{/each}
	{/if}
{/if}

<style>
	.grid {
		width: 100vw;
		height: 100vh;
		background-size: 64px 64px;
		background-image: linear-gradient(to left, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
			linear-gradient(to top, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
	}
</style>
