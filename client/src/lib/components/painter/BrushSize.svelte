<script lang="ts">
	import { brushSize } from '$lib/state/painter.state';
	import { onMount } from 'svelte';

	let slider: HTMLInputElement;
	let sliderValue = 0; // To store and display the slider's value

	// Function to update the position of the value display based on the slider's value
	function updateValuePosition() {
		const valueDisplay: HTMLElement | null = document.querySelector('.slider-value-display');
		if (slider && valueDisplay) {
			const percentage =
				(($brushSize - parseFloat(slider.min)) /
					(parseFloat(slider.max) - parseFloat(slider.min))) *
				100;
			// Adjust positioning to appear inside the thumb
			valueDisplay.style.left = `calc(${percentage}% - 14px)`; // 14px is half the width of the thumb
			valueDisplay.textContent = `${$brushSize}`;
		}
	}

	$: sliderValue = $brushSize;
	$: $brushSize, updateValuePosition();

	onMount(() => {
		updateValuePosition(); // Initial position update
	});
</script>

<div class="slider-container">
	<input
		on:mousedown|stopPropagation
		on:click|stopPropagation
		on:dblclick|stopPropagation
		on:mousemove|stopPropagation
		class="brush-size-slider"
		type="range"
		min="8"
		max="64"
		step="8"
		bind:this={slider}
		bind:value={$brushSize}
	/>
	<div class="slider-value-display"></div>
</div>

<style>
	.slider-container {
		display: flex;
		position: relative;
		height: 100%;
	}

	.brush-size-slider {
		flex-grow: 1;
		-webkit-appearance: none;
		height: 50px;
		background-color: #e1e1e1;
		cursor: pointer;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		border: none;
		height: 50px;
		min-width: inherit;
		width: 28px;
		background: #d1d646;
	}

	.slider-value-display {
		position: absolute;
		top: 0;
		background-color: transparent;
		color: #121317;
		padding: 10px 0;
		user-select: none;
		transform: translateX(-50%);
		text-align: center;
		width: 28px;
	}

	input[type='range']:focus {
		outline: none;
	}
</style>
