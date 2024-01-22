<script lang="ts">
	// Stores
	import { WorldState, x, y, cellsToDraw } from '$lib/state/world.state';
	import { REGION_WIDTH, REGION_HEIGHT, UPDATE_DISTANCE } from '$lib/constants';

	// Libraries
	import { onMount } from 'svelte';
	import { Formulas } from '$lib/helpers/formula.helper';
	import { RegionHandler } from '$lib/handlers/region.handler';

	let dragging = false;
	let dragStartX: number;
	let dragStartY: number;
	let previousX: number;
	let previousY: number;

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

			if (
				Formulas.distance(dragStartX, dragStartY, event.clientX, event.clientY) > UPDATE_DISTANCE
			) {
				dragStartX = event.clientX;
				dragStartY = event.clientY;
				WorldState.updateRegionSet($x, $y);
				WorldState.updateDraw();
			}
		}
	}

	/**
	 *
	 */

	function handleDblClick(event: MouseEvent) {
		console.log('dbl click');
		/**
		 * Based on context
		 * if region !exists
		 * 	 create-region
		 * else
		 *    if cell
		 * */

		RegionHandler.sendCreateRegion($x + event.clientX, $y + event.clientY);
	}

	onMount(() => {
		WorldState.updateRegionSet($x, $y);
		WorldState.updateDraw();
	});

	function test() {
		console.log('asdfas');
	}
	$: backgroundPosition = `${-$x % REGION_WIDTH}px ${-$y % REGION_HEIGHT}px`;
</script>

<svelte:window
	on:mousedown={handleStartDrag}
	on:mouseup={handleStopDrag}
	on:mouseout={handleStopDrag}
	on:mousemove={handleMove}
/>

<button on:click={test}>Test</button>
{#each $cellsToDraw as cell}
	<button class="cell" style="top:{-$y + cell.y}px; left:{-$x + cell.x}px" on:click={() => test()}
		>Test</button
	>
{/each}
{#if $cellsToDraw.length > 0}
	{$cellsToDraw.length} / {$cellsToDraw[0].y} / {-$y}
{/if}

<style>
	.cell {
		/* pointer-events: none; */
		position: absolute;
		background: #00fff2;
		width: 60px;
		height: 60px;
		border: 1px solid #f2f000;
		color: #e1f1d1;
	}

	.grid {
		width: 100vw;
		height: 100vh;
		background-size: 64px 64px;
		background-image: linear-gradient(to left, rgba(0, 0, 0, 0.5) 1px, transparent 1px),
			linear-gradient(to top, rgba(0, 0, 0, 0.5) 1px, transparent 1px);
	}
</style>
