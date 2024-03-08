<script lang="ts">
	import { resources } from '$lib/state/inventory.state';
</script>

<div class="inventory">
	<div class="page resources">
		{#if $resources}
			{#each Object.entries($resources) as [resource, amount]}
				{resource} {amount}
			{/each}
		{/if}
	</div>
	<div class="page items">Right Page Content</div>
</div>

<style>
	.inventory {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: flex-start;
		height: calc(100% - 70px);
		padding-top: 70px;
	}

	.page {
		width: 80%;
		max-width: 500px;
		height: 400px;
		margin: 10px;
		background-color: #f4f4f4;
		display: flex;
		padding: 24px;
		border-radius: 8px;
	}
</style>
