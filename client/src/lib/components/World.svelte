<script lang="ts">
	// Modules
	import { onMount } from 'svelte';
	import { Formula } from '$lib/helpers/formula.helper';
	import { WorldAction } from '$lib/action/world.action';
	import { ActionHandler } from '$lib/handlers/action.handler';
	import { Conversion } from '$shared/conversion';
	import { WorldState, x, y } from '$lib/state/world.state';
	import { claimToDraw, digsToDraw, postsToDraw } from '$lib/state/draw.state';

	// Types and constants
	import { UPDATE_DISTANCE } from '$shared/constants';

	import type { Location } from '$shared/types';
	import { RegionState } from '$lib/state/region.state';
	import { isClaimMode } from '$lib/state/settings.state';
	import { ClaimState } from '$lib/state/claim.state';

	// Variables
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
		// console.log('start drag');
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
				Formula.distance(dragStartX, dragStartY, event.clientX, event.clientY) > UPDATE_DISTANCE
			) {
				dragStartX = event.clientX;
				dragStartY = event.clientY;
				WorldState.update();
			}
		}
	}

	function handleClick(event: MouseEvent) {
		if ($isClaimMode) {
			const loc = { x: event.x + $x, y: event.y + $y };
			ClaimState.claim(loc);
		}
		// Conversion.locationToDigIndex({ x: event.x, y: event.y });
		// console.log('Click');
	}

	function handleDoubleClick(event: MouseEvent) {
		let loc: Location = { x: event.x + $x, y: event.y + $y };
		const key = Conversion.toRegionKey(loc);
		const region = RegionState.get(key);
		if (region) {
			if (RegionState.isDiggable(loc, region)) {
				const idx = Conversion.locationToDigIndex(loc, region);
				ActionHandler.sendDig(key, idx);
			}
		} else {
			WorldAction.createRegion(loc);
		}
	}

	onMount(async () => {
		WorldState.update();
	});
</script>

<svelte:window
	on:mousedown={handleStartDrag}
	on:mouseup={handleStopDrag}
	on:mouseleave={handleStopDrag}
	on:mousemove={handleMove}
	on:click={handleClick}
	on:dblclick|preventDefault={handleDoubleClick}
/>

<div>
	{#each $digsToDraw as dig}
		{#if dig.value == '1'}
			<button
				class="dig"
				style="top:{-$y + dig.y}px; left:{-$x + dig.x}px; background-color: rgba(255, 0, 0, 0.2);"
			/>
		{/if}
	{/each}

	{#each $postsToDraw as post}
		<div
			class="post"
			style="
		top:{-$y + post.y - 2}px; 
		left:{-$x + post.x - 2}px;
		width: {post.width}px;
		height: {post.height}px;
		background-color: rgba(100, 100, 255, 0.3);"
		/>
	{/each}

	{#if $claimToDraw}
		{#if $claimToDraw.valid}
			<div
				class="claim"
				style="
			top:{-$y + $claimToDraw.y - 2}px; 
			left:{-$x + $claimToDraw.x - 2}px;
			width: {$claimToDraw.w}px;
			height: {$claimToDraw.h}px;
			background-color: rgba(0, 150, 255, 0.2);"
			/>
		{:else}
			<div
				class="claim"
				style="
			top:{-$y + $claimToDraw.y - 2}px; 
			left:{-$x + $claimToDraw.x - 2}px;
			width: {$claimToDraw.w}px;
			height: {$claimToDraw.h}px;
			background-color: rgba(255, 150, 0, 0.2);
			"
			/>
		{/if}
	{/if}
</div>

<style>
	.dig {
		position: absolute;
		background: #00fff2;
		width: 60px;
		height: 60px;
		border-color: #00000000;
		border-radius: 4px;
		color: #316300;
	}

	.claim {
		position: absolute;
		background: #44008888;
		border-color: #00000000;
		border-radius: 8px;
	}

	.post {
		position: absolute;
		border-radius: 4px;
		box-shadow: inset 0px 0px 0px 2px rgba(255, 255, 255, 1);
		box-sizing: border-box;
	}
</style>
