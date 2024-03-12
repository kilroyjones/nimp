<script lang="ts">
	// Stores
	import { x, y, windowWidth, windowHeight } from '$lib/state/world.state';

	// Componenets
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
	<World />
	<Actions />
{/if}
