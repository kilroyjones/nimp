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
		'#121317',
		'#555555',
		'#e7e7e7',
		'#ffffff',
		'#4CAF50',
		'#009B72',
		'#CEF9F2',
		'#008CBA',
		'#D1D646',
		'#A68BA5',
		'#F97068',
		'#f44336',
		'#ddd',
		'#ddd',
		'#ddd',
		'#ddd',
		'#ddd',
		'#ddd',
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
	<div class="row">
		<div class="column">
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
		<div id="pallete" class="column">
			{#each colors as color, index}
				<button style="background-color: {color}" on:click={() => handleSelectColor(index)} />
			{/each}
		</div>
	</div>
</div>

<style>
	.container {
		position: relative;
		width: 358px;
		background-color: #fafafa;
	}

	.picker-container {
		position: absolute;
		top: 60px;
		left: 2px;
		z-index: 1;
	}

	button {
		width: 25.8px;
		height: 28px;
		border: solid 0px #888;
		vertical-align: top;
		border-radius: 0px;
		margin-bottom: 4px;
	}

	button:hover {
		border: solid 1px red;
	}

	.picker-button {
		border: solid 5px #fafafa inset;
		border-radius: 1px;
		width: 48px;
		height: 60px;
	}

	.column {
		float: left;
		height: 60px;
	}

	.row:after {
		content: '';
		display: table;
		clear: both;
	}

	#pallete {
		width: 310px;
	}
</style>
