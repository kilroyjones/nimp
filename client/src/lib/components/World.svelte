<script lang="ts">
	// Stores
	import { x, y, windowHeight, windowWidth, regionsInView } from '$lib/stores/world.store';
	import { REGION_WIDTH, REGION_HEIGHT, UPDATE_DISTANCE } from '$lib/stores/constants.store';

	// Libraries
	import { socketClient } from '$lib/socket/socket-client';

	let dragging = false;
	let dragStartX: number;
	let dragStartY: number;
	let previousX: number;
	let previousY: number;

	/**
	 * A function to calculate the distance between two points
	 */
	function distance(x1: number, y1: number, x2: number, y2: number): number {
		return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
	}

	/**
	 * This calculates the current regions in view.
	 */
	function updateRegionsInView() {
		let xMin = Math.floor($x / $REGION_WIDTH);
		let yMin = Math.floor($y / $REGION_HEIGHT);
		let xMax = Math.floor(($x + $windowWidth) / $REGION_WIDTH);
		let yMax = Math.floor(($y + $windowHeight) / $REGION_HEIGHT);

		let views = [];
		for (let xCoord = xMin; xCoord <= xMax; xCoord++) {
			for (let yCoord = yMin; yCoord <= yMax; yCoord++) {
				views.push({ x: xCoord, y: yCoord });
			}
		}

		// Update the store with the current regions in view and
		// then send this to the server.
		$regionsInView = views;
		socketClient.send('update', { data: $regionsInView });
	}

	/**
	 * Initiating a drag will set all these values to be used in conjunction
	 * with the handleMove function
	 */
	function handleStartDrag(event: MouseEvent) {
		dragStartX = event.clientX;
		dragStartY = event.clientY;
		previousX = event.clientX;
		previousY = event.clientY;
		dragging = true;
	}

	/**
	 * Called when releasing the mouse button or when leaving the screen.
	 */
	function handleStopDrag(event: MouseEvent) {
		dragging = false;
	}

	/**
	 * Only relevant if we've started dragging in the handleStartDrag function.
	 * We first update our global values (x, y) based on how far we've moved
	 * since the the last time the function was triggered.
	 *
	 * If we've moved further than UPDATE_DISTANCE we reset our dragStart values
	 * and then get the new viewable regions
	 */
	function handleMove(event: MouseEvent) {
		if (dragging) {
			$x = $x - event.clientX + previousX;
			$y = $y - event.clientY + previousY;
			previousX = event.clientX;
			previousY = event.clientY;

			if (distance(dragStartX, dragStartY, event.clientX, event.clientY) > $UPDATE_DISTANCE) {
				dragStartX = event.clientX;
				dragStartY = event.clientY;
				updateRegionsInView();
			}
		}
	}

	/**
	 *
	 */

	function handleDblClick(event: MouseEvent) {
		console.log('dbl click');
		socketClient.send('explore', { data: { x: $x + event.clientX, y: $y + event.clientY } });
	}

	$: backgroundPosition = `${-$x % $REGION_WIDTH}px ${-$y % $REGION_HEIGHT}px`;
</script>

<svelte:window
	on:mousedown={handleStartDrag}
	on:mouseup={handleStopDrag}
	on:mouseout={handleStopDrag}
	on:mousemove={handleMove}
	on:dblclick|preventDefault={handleDblClick}
/>

<div class="grid" style="background-position: {backgroundPosition};" />

<style>
	.grid {
		width: 100vw;
		height: 100vh;
		background-size: 64px 64px;
		background-image: linear-gradient(to left, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
			linear-gradient(to top, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
	}
</style>
