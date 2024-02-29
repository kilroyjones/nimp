<script lang="ts">
	import { PlayerState } from '$lib/state/player.state';
</script>

<div class="navbar">
	<div class="play">
		<a href="/play">Play</a>
	</div>
	<div class="account">
		{#if PlayerState.isDefined()}
			<a href="/account">{PlayerState.getName()}</a>
		{/if}
	</div>
</div>

<style>
	.account {
		padding: 0px 10px 0px 10px;
		margin-left: auto;
	}

	.navbar {
		position: absolute;
		height: 48px;
		width: 100vw;
		z-index: 1;

		align-items: center;
		background-color: rgba(0, 0, 0, 0.2);
		color: #121317;
		display: flex;
		overflow: hidden;
		opacity: 0.8;
	}

	.play {
		padding-left: 20px;
	}
</style>
