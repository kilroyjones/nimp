<script lang="ts">
	import { x, y } from '$lib/state';
	export let worldX: number;
	export let worldY: number;

	// TODO handle both mouse and keyboard events
	async function move(event: KeyboardEvent | MouseEvent) {
		console.log('MOVE EVENT');
		const response = await fetch('/api/test', {
			method: 'POST',
			body: JSON.stringify({
				x: 10,
				y: 11
			}),
			headers: {
				'content-type': 'application/json'
			}
		});

		// Can check confirmation for error and respond accordingly.
		let confirmation = await response.json();
		console.log(confirmation);

		// if (event.type == 'click' || event.key == 'Enter') {
		// 	console.log('Here', Number.isInteger(worldX));
		// 	if (Number.isInteger(parseInt(worldX)) && Number.isInteger(parseInt(worldY))) {
		// 		$x = worldX;
		// 		$y = worldY;
		// 		console.log($x, $y);
		// 	}
		// }
	}
</script>

<div class="navbar">
	<div class="location no-drag">
		<input bind:value={worldX} on:keydown={move} />,
		<input bind:value={worldY} on:keydown={move} />
		<button on:click={move}>Go</button>
	</div>
</div>

<style>
	.navbar {
		position: absolute;
		width: 100vw;
		height: 48px;
		z-index: 1;
		background-color: rgba(0, 0, 0, 0.2);
		color: #121317;
		opacity: 0.8;
		display: flex; /* Use flexbox */
		justify-content: center; /* Center horizontally */
		align-items: center; /* Center vertically */
		overflow: hidden;
	}

	.location {
		color: #121317;
		text-decoration: none;
		font-size: 15px;
		font-weight: 600;
		display: flex; /* Align items in the location div */
		align-items: center; /* Center vertically inside the location div */
	}

	input {
		font-family: 'Roboto Mono', monospace;
		font-size: 15px;
		border-radius: 6px;
		width: 90px;
		text-align: center;
		border: solid 1px #afafaf;
		margin: 0 5px; /* Add some space around inputs */
	}

	button {
		border-radius: 6px;
		border: solid 1px #afafaf;
	}

	.no-drag {
		user-select: unset;
		-webkit-user-select: none;
		-moz-user-select: none;
	}
</style>
