<script lang="ts">
	import type { Post } from '$shared/types';
	/**
	 * Just a container for the Painter window.
	 */
	import Painter from './Painter.svelte';

	export let post: Post;
</script>

<div class="container">
	<div><center><Painter {post} /></center></div>
</div>

<style>
	.container {
		justify-content: center;
		text-align: center;
		height: 100vh;
	}
</style>
