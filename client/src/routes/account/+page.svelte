<script lang="ts">
	import Create from '$lib/components/account/Create.svelte';
	import Modify from '$lib/components/account/Modify.svelte';
	import NavbarAccount from '$lib/components/navbars/NavbarAccount.svelte';
	import { PlayerState } from '$lib/state/player.state';
</script>

<NavbarAccount></NavbarAccount>
<div class="container">
	<div class="content">
		<div class="title">Account settings</div>
		{#if PlayerState.isAccountRegistered()}
			<div class="directions">
				Changing your username does not change the name on previous posts, though they are still
				linked to your account.
			</div>
			<Modify />
		{:else}
			<div class="directions">
				You are currently anonymous. Anonymous accounts are lost when changing computers, browsers,
				or clearing cache. Create an account below:
			</div>
			<Create />
		{/if}
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		padding: 20px;
		padding-top: 15%;
		font-family: monospace;
		font-size: 16px;
	}

	.content {
		width: 400px;
		background-color: #e2e2e2;
		padding: 20px;
		min-height: 400px;
		border-radius: 10px;
		font-size: 18px;
	}

	.directions {
		margin-bottom: 32px;
		font-size: 16px;
	}

	.title {
		text-align: center;
		font-size: 22px;
		font-weight: 700;
		margin-bottom: 30px;
	}
</style>
