<script lang="ts">
	/**
	 * The BrushSize component is part of the LowerToolbar component.
	 * It is a slider with fixed sizes that line up with the overal size
	 * of the canvas.
	 */
	import { brushSize } from '$lib/state/painter.state';
</script>

<input
	on:mousedown|stopPropagation
	on:click|stopPropagation
	on:dblclick|stopPropagation
	on:mousemove|stopPropagation
	type="range"
	min="8"
	max="64"
	step="8"
	bind:value={$brushSize}
/>

<style>
	input[type='range'] {
		-webkit-appearance: none;
		background-color: #121317;
		width: 56%;
	}

	input[type='range']::-webkit-slider-runnable-track {
		height: 10px;
		background: #ddd;
		border: none;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		border: none;
		height: 30px;
		width: 16px;
		background: #d1d646;
		margin-top: -10px;
	}

	input[type='range']:focus {
		outline: none;
	}
</style>
