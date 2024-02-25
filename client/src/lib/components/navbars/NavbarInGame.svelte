<script lang="ts">
	/**
	 * Navbar component
	 *
	 * We pass in the store values of x and y, allowing us to create "bound"
	 * copies on the input statements for teleporting. The reason being that if
	 * we were to bind directly to the store it would be updated with each
	 * keypress and we only want to do when the ENTER key or teleport button is
	 * pressed.
	 *
	 */

	// Components
	import Debug from '../Debug.svelte';

	// Stores
	import Toggle from '../Toggle.svelte';
	import { isDebugMode, isClaimMode } from '$lib/state/settings.state';
	import { PlayerState } from '$lib/state/player.state';
	import { x, y } from '$lib/state/world.state';

	// Variables passed in
	export let worldX: number | string; // Since bound to an input field
	export let worldY: number | string; // Since bound to an input field

	let xIsInt = true;
	let yIsInt = true;

	/**
	 * Checks if the coordinates are valid integers.
	 *
	 * We convert to a number using the unary(+) operator, then check if it's an
	 * integer. Given that the coordinates come from input fields, we also need
	 * to check if they're empty strings, since the unary operator will produce
	 * 0 for an empty string.
	 *
	 * Why didn't we use parseInt, you may ask? With parseInt, values such as
	 * '123abc' will be parse to 123.
	 *
	 */
	function checkCoordinate() {
		xIsInt = worldX !== '' && Number.isInteger(+worldX);
		yIsInt = worldY !== '' && Number.isInteger(+worldY);

		if (xIsInt && yIsInt) return true;

		return false;
	}

	/**
	 * Moves the user to the specified world coordinates if they are valid
	 * integers, and provides a warning if they are not. Updates '$x' and '$y'
	 * to these coordinate.
	 */
	function teleport() {
		if (checkCoordinate()) {
			$x = worldX as number;
			$y = worldY as number;
		}
	}

	/**
	 * Handles the check for pressing enter in either of the fields. We use
	 * "keyup" as Svelte binds after the changes are made, making using
	 * keydown/keypress not feasible.
	 */
	function handleKeyup(event: KeyboardEvent) {
		if (checkCoordinate()) {
			if (event.key === 'Enter') teleport();
		}
	}
</script>

<div
	class="navbar"
	on:mousedown|stopPropagation
	on:click|stopPropagation
	on:dblclick|stopPropagation
	on:keypress|stopPropagation
	tabindex="0"
	role="button"
	aria-label=""
>
	<div class="center-group">
		<div class="location no-drag">
			<input class={xIsInt ? '' : 'has-error'} bind:value={worldX} on:keyup={handleKeyup} />
			<input class={yIsInt ? '' : 'has-error'} bind:value={worldY} on:keyup={handleKeyup} />
			<button type="submit" on:click={teleport}>Teleport</button>
		</div>
		<Toggle isChecked={$isClaimMode} />
	</div>
	<div class="account">
		{#if PlayerState.isDefined()}
			<a href="/account">{PlayerState.getName()}</a>
		{/if}
	</div>
</div>

{#if { $isDebugMode }}<Debug />{/if}

<style>
	.account {
		padding: 0px 10px 0px 10px;
		margin-left: auto;
	}

	button {
		border-radius: 6px;
		min-height: 26px;
		border: solid 1px #afafaf;
		cursor: pointer;
		box-shadow: 0 1px #999;
		transition: all 0.05s ease-in-out;
		transform: translateY(-2px);
	}

	button:active {
		background-color: darkgray;
		box-shadow: 0 1px #666;
		transform: translateY(1px);
	}

	input {
		font-family: 'Roboto Mono', monospace;
		font-size: 15px;
		border-radius: 6px;
		min-height: 24px;
		width: 90px;
		text-align: center;
		border: solid 1px #afafaf;
	}

	.has-error {
		background-color: #ec6767;
	}

	input:focus {
		outline: 2px solid #7f7f7f;
	}

	.location {
		align-items: center;
		color: #121317;
		font-size: 15px;
		font-weight: 600;
		text-decoration: none;
	}

	.navbar {
		display: flex;
		position: absolute;
		height: 48px;
		width: 100vw;
		z-index: 1;

		align-items: center;
		justify-content: space-between;
		background-color: rgba(0, 0, 0, 0.2);
		color: #121317;
		overflow: hidden;
		opacity: 0.8;
	}

	.no-drag {
		user-select: unset;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;

		-webkit-user-drag: none;
		user-drag: none;
		-ms-user-drag: none;
		user-drag: none;
	}

	.center-group {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1; /* This makes sure it takes up the maximum width */
	}
</style>
