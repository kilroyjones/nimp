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

	// Types and constants
	import { PlayerState } from '$lib/state/player.state';
	import { PlaySocket } from '$lib/sockets/play.socket';

	onMount(async () => {
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

		const playerId = PlayerState.getId();
		console.log('PID', playerId);

		if (playerId) {
			PlaySocket.connect(playerId);
		}
	});
</script>

<slot />
