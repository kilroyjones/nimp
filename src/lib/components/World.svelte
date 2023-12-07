<script lang="ts">
	import {
		x,
		y,
		windowWidth,
		windowHeight,
		cellWidth,
		cellHeight,
		regionWidth,
		regionHeight
	} from '$lib/state';
	import { onMount } from 'svelte';

	let previousX: number;
	let previousY: number;
	let dragging = false;
	let previousDblClickX: number = 0;
	let previousDblClickY: number = 0;
	let isMining = false;
	let distanceMoved = 0;
	let region: any;
	let posts: any = null;

	function handleStartDrag(event: MouseEvent) {
		/**
		 * Detects mouse down (not click) and sets the values needed
		 * for dragging the world.
		 */
		previousX = event.clientX;
		previousY = event.clientY;
		dragging = true;
	}

	function handleMove(event: MouseEvent) {
		/**
		 * Detect mouse move and updates the world coordinates (x, y).
		 * It also uses distanceMoved to determine if there needs to be
		 * an update in the Claims component of the Claims (images).
		 */
		// $update = false;
		if (dragging) {
			$x = $x - event.clientX + previousX;
			$y = $y - event.clientY + previousY;
			previousX = event.clientX;
			previousY = event.clientY;
		}
	}

	function handleStopDrag(event: MouseEvent) {
		/**
		 * Stops dragging when the mouse button is no longer pressed down
		 * or when the mouse leaves the screen.
		 */
		console.log('Stop');
		dragging = false;
	}

	async function handleDoubleClick(event: MouseEvent) {
		const clickX = Math.floor(event.clientX + $x);
		const clickY = Math.floor(event.clientY + $y);
		const regionX = Math.floor(clickX / $regionWidth);
		const regionY = Math.floor(clickX / $regionHeight);
		const cellX = Math.floor(clickX / $cellWidth) % Math.floor($regionWidth / $cellWidth);
		const cellY = Math.floor(clickY / $cellHeight) % Math.floor($regionHeight / $cellHeight);

		// if (clickX == previousDblClickX && clickY == previousDblClickY) {
		// 	isMining = true;
		// 	console.log('Mining: ', isMining);
		// 	console.log(region.msg.posts);
		// 	posts = region.msg.posts;
		// }

		previousDblClickX = clickX;
		previousDblClickY = clickY;

		// console.log(
		// 	`Location ${clickX}, ${clickY} gives ==> Region: ${regionX}, ${regionY} at cell ${cellX}, ${cellY}`
		// );
	}

	onMount(async () => {
		const response = await fetch('/api/mine', {
			method: 'POST',
			body: JSON.stringify({
				rx: 0,
				ry: 0,
				cx: 0,
				cy: 0
			}),
			headers: {
				'content-type': 'application/json'
			}
		});
		region = await response.json();
		posts = region.msg.posts;
		console.log(posts);
	});
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
			<div>{post.x}, {post.y}, {post.w} {post.h}</div>
			<div
				style="
					background-color: #ff00f0;
					position: absolute;
				    top: {post.y * 64 - $y}px;
				    left: {post.x * 64 - $x}px;
					border: 2px;
					border-radius: 4px;
					box-shadow: inset 0 0 0 4px #ffffff; 
					border-color: #fff;
				    width: {post.w * 64}px;
				    height: {post.h * 64}px;
					"
			/>
		{/each}
	{/if}
	<!-- <Messages /> -->
{/if}

<style>
	.grid {
		width: 100vw; /* Adjust as needed */
		height: 100vh; /* Adjust as needed */
		background-size: 64px 64px; /* Size of your grid cells */
		background-image: linear-gradient(to left, rgba(0, 0, 0, 0.1) 2px, transparent 2px),
			linear-gradient(to top, rgba(0, 0, 0, 0.1) 2px, transparent 2px);
	}
</style>
