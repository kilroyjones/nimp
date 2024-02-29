<script lang="ts">
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
</script>

<svelte:window bind:innerWidth={$windowWidth} bind:innerHeight={$windowHeight} />

{#if $isOnline}
	<Navbar worldX={$x} worldY={$y} />
	<World />
	<Actions />
{/if}
