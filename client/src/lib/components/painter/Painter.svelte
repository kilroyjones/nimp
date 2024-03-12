<script lang="ts">
	/**
	 * The Painter conponent is where the user will upload or draw their image.
	 *
	 * This forms the base for all the painting tools and corresponding
	 * components, such as the LowerToolBar and ColorPicker. It's primary
	 * concern is with the coloring of the image itself, maintaining an HTML
	 * canvas on which is drawn the pixels.
	 */

	import ColorPicker from './ColorPicker.svelte';
	import LowerToolbar from './LowerToolbar.svelte';
	import { onMount } from 'svelte';
	import { brushSize, brushColor, canvasSize, showPicker } from '$lib/state/painter.state';
	import type { Post } from '$shared/types';
	import { showPainter } from '$lib/state/settings.state';

	export let post: Post;

	let canvas: HTMLCanvasElement;
	let isDrawing = false;

	function colorCell(event: MouseEvent) {
		/**
		 * Even contains current location of a mouse press. It takes this location and
		 * then determines the closest location based on brush size ($brushSize - global).
		 */
		let x = event.offsetX - (event.offsetX % $brushSize);
		let y = event.offsetY - (event.offsetY % $brushSize);
		if (document) {
			const elem = document.getElementById('canvas') as HTMLCanvasElement;
			if (elem) {
				const ctx = elem.getContext('2d');
				if (ctx) {
					ctx.beginPath();
					ctx.fillStyle = $brushColor;
					ctx.fillRect(x, y, $brushSize, $brushSize);
				}
			}
		}
	}

	function handleStartPaint(event: MouseEvent) {
		/**
		 * Necessary in order to "turn off" the brush if the brush leaves the canvas as well
		 * as deal with selecting a color from the picker and then drawing on the canvas.
		 */
		isDrawing = true;
		if ($showPicker) {
			$showPicker = false;
		} else {
			colorCell(event);
		}
	}

	function handlePaint(event: MouseEvent) {
		/**
		 * If painting, then paint.
		 */
		if (isDrawing) {
			colorCell(event);
		}
	}

	function handleStopPaint(event: MouseEvent) {
		/**
		 * Triggers both when the mouse leaves the canvas and when the mouse
		 * button is released.
		 */
		isDrawing = false;
	}

	function handleClosePicker() {
		/**
		 * Used for when clicking outside the picker but not on the canvas.
		 */
		$showPicker = false;
	}

	onMount(() => {
		/**
		 * Only needed to set up the initial canvas. Color is same as the background
		 * found in global.css
		 */
		// TODO: clean this up and don't duplicate above
		// TODO: use post to change brush size
		if (document) {
			const elem = document.getElementById('canvas') as HTMLCanvasElement;
			if (elem) {
				const ctx = elem.getContext('2d');
				if (ctx) {
					ctx.beginPath();
					ctx.fillStyle = $brushColor;
					ctx.fillRect(0, 0, $brushSize, $brushSize);
				}
			}
		}
	});

	function close(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			$showPainter = false;
		}
	}
</script>

<div role="button" tabindex="0" class="modal-overlay" on:mousedown={close} on:keypress={() => {}}>
	<div class="modal-wrapper">
		<div class="modal-content" role="button" tabindex="0">
			<div>
				<ColorPicker />
			</div>
			<div
				class="drawing-container"
				style="height:{$canvasSize + 40}px"
				on:mousedown|stopPropagation={handleClosePicker}
				role="button"
				tabindex="0"
			>
				<canvas
					id="canvas"
					on:mousedown|stopPropagation={handleStartPaint}
					on:mousemove|stopPropagation={handlePaint}
					on:mouseup|stopPropagation={handleStopPaint}
					on:mouseleave|stopPropagation={handleStopPaint}
					bind:this={canvas}
					width={$canvasSize}
					height={$canvasSize}
				/>
			</div>
			<LowerToolbar />
		</div>
	</div>
</div>

<style>
	.drawing-container {
		position: relative;
		background-color: #fff;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	canvas {
		border: 1px solid #aaa;
	}

	.close-btn {
		width: 24px;
		height: 24px;
		margin: 0 auto;
		cursor: pointer;
		border: 1px solid #ccc;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 16px;
		background-color: #fff;
	}

	.modal-content {
		padding: 8px 8px 8px 8px;
		background-color: white;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.25);
	}

	.modal-form {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 10;
	}

	.modal-wrapper {
		display: inline-flex;
		align-items: stretch;
	}

	.sidebar {
		width: 40px;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		padding-top: 16px;
	}
</style>
