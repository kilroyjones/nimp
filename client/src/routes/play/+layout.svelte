<script lang="ts">
	/**
	 * TODO: Fix bug that happens upon doing the following:
	 * - Turn off all servers
	 * - Restart and load /play => hangs
	 * - Comment out this file
	 * - Restart frontend
	 * - Uncomment => works
	 */
	import { onMount } from 'svelte';
	// Stores
	import { x, y, windowWidth, windowHeight, WorldState } from '$lib/state/world.state';

	// Componenets
	import Navbar from '$lib/components/navbars/NavbarInGame.svelte';
	import World from '$lib/components/World.svelte';
	import Actions from '$lib/components/Actions.svelte';

	// Types and constants
	import { isOnline } from '$lib/sockets/play.socket';

	$: {
		if ($windowWidth && $windowHeight) {
			// WorldState.update();
		}
	}
	// Types and constants
	import { PlayerState } from '$lib/state/player.state';
	import { PlaySocket } from '$lib/sockets/play.socket';

	onMount(async () => {
		console.log('adsf', PlayerState.isDefined(), PlaySocket.isConnected());
		if (PlayerState.isDefined() == false) {
			try {
				const response = await fetch(`http://localhost:3000/account/create`, {
					method: 'GET'
				});
				const data = await response.json();
				PlayerState.set(data.msg);
			} catch (error) {
				// Existing player data not found
			}
		}

		if (PlaySocket.isConnected() == false) {
			const playerId = PlayerState.getId();
			console.log('PID', playerId);

			if (playerId) {
				PlaySocket.connect(playerId);
			}
		}
	});
</script>

{#if $isOnline}
	<Navbar worldX={$x} worldY={$y} />
{/if}
<slot />
