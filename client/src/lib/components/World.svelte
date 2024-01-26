<script lang="ts">
	// Stores
	import { WorldState, x, y, cellsToDraw } from '$lib/state/world.state';
	import { REGION_WIDTH, REGION_HEIGHT, UPDATE_DISTANCE } from '$lib/constants';

	// Libraries
	import { onMount } from 'svelte';
	import { Formulas } from '$lib/helpers/formula.helper';
	import { RegionHandler } from '$lib/handlers/region.handler';
	import type { Location } from '$shared/models';

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
		console.log('start drag');
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
		console.log('stop drag');
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
		console.log('move', dragging);
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

	function handleClick(event: MouseEvent) {
		console.log('Click');
	}

	function handleDoubleClick(event: MouseEvent) {
		console.log('Double click');
		let loc: Location = { x: event.x + $x, y: event.y + $y };
		if (WorldState.hasRegion(loc)) {
			if (WorldState.isDiggable(loc)) {
				WorldState.updateDigSite(loc.x, loc.y);
			}
		} else {
			RegionHandler.sendCreateRegion($x + event.clientX, $y + event.clientY);
		}
	}

	onMount(() => {
		WorldState.updateRegionSet($x, $y);
		WorldState.updateDraw();
	});

	// https://stackoverflow.com/questions/61461518/javascript-how-prevent-dblclick-double-click-to-also-fire-a-single-click-even

	// $: backgroundPosition = `${-$x % REGION_WIDTH}px ${-$y % REGION_HEIGHT}px`;
</script>

<svelte:window
	on:mousedown={handleStartDrag}
	on:mouseup={handleStopDrag}
	on:mouseleave={handleStopDrag}
	on:mousemove={handleMove}
	on:click={handleClick}
	on:dblclick={handleDoubleClick}
/>

{#each $cellsToDraw as cell}
	{#if cell.value == '1'}
		<button
			class="cell"
			style="top:{-$y + cell.y}px; left:{-$x + cell.x}px; background-color: rgba(255, 0, 0, 0.2);"
		/>
	{/if}
{/each}

<style>
	.cell {
		/* pointer-events: none; */
		position: absolute;
		background: #00fff2;
		width: 60px;
		height: 60px;
		border-color: #00000000;
		border-radius: 4px;
		color: #316300;
	}

	/* .grid {
		width: 100vw;
		height: 100vh;
		background-size: 64px 64px;
		background-image: linear-gradient(to left, rgba(0, 0, 0, 0.5) 1px, transparent 1px),
			linear-gradient(to top, rgba(0, 0, 0, 0.5) 1px, transparent 1px);
	} */
</style>
