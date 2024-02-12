<script lang="ts">
	import { x, y, windowWidth, windowHeight } from '$lib/state/world.state';
	import { regions } from '$lib/state/region.state';
	import { postsToDraw } from '$lib/state/draw.state';
</script>

<div class="debug">
	<div><strong>Loc: </strong> ({$x}, {$y})</div>
	<div><strong>Dim: </strong> ({$windowWidth}, {$windowHeight})</div>
	<div><strong>Regions:</strong></div>
	<table>
		{#each $regions as [key, region]}
			<tr>
				<td>
					{key}
				</td>
				<td>
					({region.x}, {region.y})
				</td>
			</tr>
		{/each}
	</table>
	<div>Posts: {$postsToDraw.length}</div>
</div>

<style>
	.debug {
		pointer-events: none;
		font-size: 13px;
		padding: 8px;
		position: fixed;
		top: 48px;
		left: 0;
		width: 120px;
		height: 120px;
		background-color: rgba(255, 255, 255, 0.5);
		pointer-events: none;
		z-index: 999;
	}
</style>
