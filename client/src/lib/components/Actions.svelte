<script lang="ts">
	import { ActionHandler } from '$lib/handlers/action.handler';
	import { showActions } from '$lib/state/settings.state';
	import { ClaimState, currentClaimRequest } from '$lib/state/claim.state';
	import { DrawState } from '$lib/state/draw.state';

	function claim() {
		ActionHandler.sendClaim($currentClaimRequest);
		ClaimState.resetSelection();
	}
</script>

{#if $showActions}
	<div class="actions">
		<button on:click|stopPropagation={claim}>Claim</button>
	</div>
{/if}

<style>
	.actions {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 32px;
		background-color: rgba(0, 0, 0, 0.2);
		color: #121317;
		text-align: center;
		padding: 20px 0;
		justify-content: center;
		opacity: 0.8;
		overflow: hidden;
	}
</style>
