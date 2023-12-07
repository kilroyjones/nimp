<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import World from '$lib/components/World.svelte';
	import { x, y, windowWidth, windowHeight } from '$lib/state';
</script>

<svelte:window bind:innerWidth={$windowWidth} bind:innerHeight={$windowHeight} />

<Navbar worldX={$x} worldY={$y} />
<World />
