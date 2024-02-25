<script lang="ts">
	// Stores
	import { x, y, windowWidth, windowHeight, WorldState } from '$lib/state/world.state';
	import { onMount } from 'svelte';

	// Componenets
	import Navbar from '$lib/components/navbars/NavbarInGame.svelte';
	import World from '$lib/components/World.svelte';
	import Actions from '$lib/components/Actions.svelte';

	// Types and constants
	import { PlayerState } from '$lib/state/player.state';
	import { isOnline, PlaySocket } from '$lib/sockets/play.socket';

	onMount(async () => {
		console.log(PlayerState.getId());
		if (PlayerState.isDefined() == false) {
			console.log('Here');
			try {
				const response = await fetch(`http://localhost:3000/account/create`, {
					method: 'GET'
				});
				const data = await response.json();
				PlayerState.set(data.msg);
			} catch (error) {
				console.error('Failed to fetch player data:', error);
				// Handle the error appropriately
			}
		}

		const playerId = PlayerState.getId();

		if (playerId) {
			PlaySocket.connect(playerId);
		}
		// Additional synchronous or asynchronous code can go here
		// TODO: Need to check if player contains correct values
	});

	$: {
		if ($windowWidth && $windowHeight) {
			WorldState.update();
		}
	}
</script>

<svelte:window bind:innerWidth={$windowWidth} bind:innerHeight={$windowHeight} />

{#if $isOnline}
	<Navbar worldX={$x} worldY={$y} />
	<World />
	<Actions />
{/if}
