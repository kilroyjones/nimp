<script>
	// Stores
	import { x, y, windowWidth, windowHeight } from '$lib/stores/world.store';

	// Componenets
	import Navbar from '$lib/components/Navbar.svelte';
	import World from '$lib/components/World.svelte';
</script>

<svelte:window bind:innerWidth={$windowWidth} bind:innerHeight={$windowHeight} />

<Navbar worldX={$x} worldY={$y} />
<World />
