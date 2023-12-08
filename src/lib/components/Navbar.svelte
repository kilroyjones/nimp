<script lang="ts">
	export let worldX: number;
	export let worldY: number;
	export let regionsInView: any = [];

	async function teleport(event: KeyboardEvent | MouseEvent) {
		// TODO: Move event
	}
</script>

<div class="navbar">
	<div class="location no-drag">
		<input bind:value={worldX} on:keydown={teleport} />,
		<input bind:value={worldY} on:keydown={teleport} />
		<button on:click={teleport}>Go</button>
		<div>{JSON.stringify(regionsInView)}</div>
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
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}

	.location {
		color: #121317;
		text-decoration: none;
		font-size: 15px;
		font-weight: 600;
		display: flex;
		align-items: center;
	}

	input {
		font-family: 'Roboto Mono', monospace;
		font-size: 15px;
		border-radius: 6px;
		width: 90px;
		text-align: center;
		border: solid 1px #afafaf;
		margin: 0 5px;
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
