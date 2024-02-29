<script lang="ts">
	// Modules
	import { ActionHandler } from '$lib/handlers/action.handler';
	import { claimToDraw, digsToDraw, postsToDraw } from '$lib/state/draw.state';
	import { ClaimState } from '$lib/state/claim.state';
	import { Conversion } from '$shared/conversion';
	import { Formula } from '$lib/helpers/formula.helper';
	import { isClaimMode, showTextEditor } from '$lib/state/settings.state';
	import { RegionHandler } from '$lib/handlers/region.handler';
	import { RegionState } from '$lib/state/region.state';
	import { WorldState, x, y } from '$lib/state/world.state';

	// Components
	import TextEditor from './TextEditor.svelte';

	// Types and constants
	import type { Location } from '$shared/types';
	import type { Post } from '$shared/types';
	import { UPDATE_DISTANCE } from '$shared/constants';

	// Variables
	let dragging = false;
	let dragStartX: number;
	let dragStartY: number;
	let previousX: number;
	let previousY: number;
	let selectedPost: Post;

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

	/**
	 *
	 */
	function handleClick(event: MouseEvent) {
		if ($isClaimMode) {
			const loc = { x: event.x + $x, y: event.y + $y };
			ClaimState.claim(loc);
		}
	}

	/**
	 *
	 */
	function handleDoubleClick(event: MouseEvent) {
		let loc: Location = { x: event.x + $x, y: event.y + $y };
		const key = Conversion.toRegionKey(loc);
		const region = RegionState.get(key);
		if (region) {
			if (RegionState.isDiggable(loc, region)) {
				ActionHandler.sendDig(loc);
			}
		} else {
			RegionHandler.sendCreateRegion(loc);
		}
	}

	/**
	 *
	 */
	function handleDoubleClickPost(post: Post) {
		selectedPost = post;
		$showTextEditor = true;
	}
</script>

<svelte:window
	on:mousedown={handleStartDrag}
	on:mouseup={handleStopDrag}
	on:mouseleave={handleStopDrag}
	on:mousemove={handleMove}
	on:click={handleClick}
	on:dblclick|preventDefault={handleDoubleClick}
/>
{#if $showTextEditor}
	<TextEditor post={selectedPost} />
{/if}

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
			role="button"
			tabindex="0"
			class="post"
			style="
			 	top:{-$y + post.y - 2}px; 
				left:{-$x + post.x - 2}px;
				width: {post.w}px;
				height: {post.h}px;
				background-color: rgba(100, 100, 255, 0.3);"
			on:dblclick={() => handleDoubleClickPost(post)}
			on:focus={() => {}}
			on:mouseover={() => {}}
		>
			{post.content}
		</div>
	{/each}

	{#if $claimToDraw}
		<div
			class="claim {$claimToDraw.valid ? 'claim-valid' : 'claim-invalid'}"
			style="
			top:{-$y + $claimToDraw.y - 2}px; 
			left:{-$x + $claimToDraw.x - 2}px;
			width: {$claimToDraw.w}px;
			height: {$claimToDraw.h}px;"
		/>
	{/if}
</div>

<style>
	.claim {
		position: absolute;
		background: #44008888;
		border-color: #00000000;
		border-radius: 8px;
	}

	.claim-valid {
		background-color: rgba(0, 150, 255, 0.2);
	}

	.claim-invalid {
		background-color: rgba(255, 150, 0, 0.2);
	}

	.dig {
		position: absolute;
		background: #00fff2;
		width: 60px;
		height: 60px;
		border-color: #00000000;
		border-radius: 4px;
		color: #316300;
	}

	.post {
		position: absolute;
		border-radius: 8px;
		text-align: center;
		box-shadow: inset 0px 0px 0px 2px rgba(255, 255, 255, 1);
		box-sizing: border-box;
		padding: 8px;
		word-wrap: break-word;
		font-size: 16px;
		font-family: monospace;
	}
</style>
