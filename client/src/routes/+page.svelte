<script>
	// Stores
	import { x, y, windowWidth, windowHeight, WorldState } from '$lib/state/world.state';

	// Componenets
	import Navbar from '$lib/components/Navbar.svelte';
	import World from '$lib/components/World.svelte';
	import Actions from '$lib/components/Actions.svelte';

	$: {
		if ($windowWidth && $windowHeight) {
			WorldState.update();
		}
	}
</script>

<svelte:window bind:innerWidth={$windowWidth} bind:innerHeight={$windowHeight} />

<Navbar worldX={$x} worldY={$y} />
<World />
<Actions />
