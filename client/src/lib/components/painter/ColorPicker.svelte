<script lang="ts">
	/**
	 * The colorpicker tool is using the dino-color-picker found here:
	 * https://www.npmjs.com/package/dino-color-picker
	 *
	 * The color picker component includes not only the dino-color-picker
	 * but the toolbar with fixed colors and ones the user has chosen for
	 * their own palette.
	 */

	// @ts-ignore
	import Icon from 'svelte-icons-pack/Icon.svelte';
	import VscPaintcan from 'svelte-icons-pack/vsc/VscPaintcan';
	import VscDiffAdded from 'svelte-icons-pack/vsc/VscDiffAdded';
	import { createEventDispatcher } from 'svelte';
	import { brushColor, showPicker } from '$lib/state/painter.state';
	import 'dino-color-picker';
	import type { Mouse } from '@playwright/test';

	const dispatch = createEventDispatcher();

	let colors = [
		'#fff',
		'#000',
		'#00ff00',
		'#ff0000',
		'#0000ff',
		'#4CAF50',
		'#009B72',
		'#CEF9F2',
		'#ddd',
		'#ddd',
		'#ddd',
		'#ddd',
		'#ddd',
		'#ddd'
	];

	function handleSelectPicker() {
		/**
		 * This will handle when the picker is selected.
		 * - If the picker is not open it will open it.
		 * - If the picker is open and the [+] icon is pressed, then
		 *   the color is added to the pallete.
		 */
		if ($showPicker) {
			$showPicker = false;
			addColorToPallete();
		} else {
			$showPicker = true;
		}
	}

	function addColorToPallete() {
		/**
		 * Adds the current brushColor to the palette.
		 */
		colors.splice(12, 0, $brushColor);
		colors.pop();
		colors = colors;
	}

	function handleSelectColor(index: number) {
		/**
		 * Choose color selected from the pallete or predefined
		 * colors.
		 */
		$brushColor = colors[index];
	}

	// TODO: Figure out if dino has types or use another picker?
	function handleColorChange(event: any) {
		/**
		 * This gets the current color value from the dino color picker
		 * and assigns it.
		 */
		if (event.target) {
			$brushColor = event.target.value;
		}
	}
</script>

<div class="container">
	<div class="picker-button-container">
		<button
			class="picker-button"
			style="background-color: {$brushColor}"
			on:click={handleSelectPicker}
		>
			{#if !$showPicker}
				<Icon src={VscPaintcan} color="#fff" size="32" />
			{:else}
				<Icon src={VscDiffAdded} color="#fff" size="32" />
			{/if}
		</button>
		{#if $showPicker}
			<div class="picker-container">
				<dino-color-picker value={$brushColor} on:change={handleColorChange} />
			</div>
		{/if}
	</div>
	<div class="palette">
		{#each colors as color, index}
			<button
				class="color-button"
				style="background-color: {color}"
				on:click={() => handleSelectColor(index)}
			/>
		{/each}
	</div>
</div>

<style>
	.container {
		display: grid;
		grid-template-columns: 60px auto;
		grid-template-rows: repeat(2, 30px);
		width: 256px;
		background-color: #fafafa;
	}

	.picker-button-container {
		position: relative; /* Add this line */
		grid-row: 1 / span 2; /* Span 2 rows */
		display: flex;
		padding-right: 1px;
		justify-content: center;
		align-items: center;
	}

	.picker-container {
		position: absolute;
		top: 100%;
		left: 1px;
		z-index: 1;
	}

	.picker-button,
	.color-button {
		width: 100%;
		height: 100%;
		border: none;
		margin: 0;
		padding: 0;
	}

	.picker-button {
		grid-column: 1;
		grid-row: 1 / span 2; /* Span 2 rows */
	}

	.palette {
		display: grid;
		grid-auto-flow: column;
		grid-template-rows: repeat(2, 30px); /* Define two rows */
		grid-column: 2;
		gap: 1px;
	}

	.color-button {
		border-radius: 0;
	}

	button:hover {
		border: solid 1px red;
	}
</style>
