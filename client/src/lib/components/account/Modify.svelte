<script lang="ts">
	import Modify from '$lib/components/account/Modify.svelte';
	import { PlayerState } from '$lib/state/player.state';
	import { Data } from '$shared/data';

	let nameErrors: string = '';
	let passwordErrors: string = 'test';
	let name: string = PlayerState.getName() || '';

	const checkName = () => {
		const { err, msg } = Data.checkName(name);
		if (err) {
			nameErrors = msg;
		}
	};

	const updateName = async () => {
		const { err, msg } = Data.checkName(name);
		if (err == false) {
		}
	};
</script>

<div class="block">
	<div class="input-group">
		<input type="text" id="userInput" on:keyup={checkName} bind:value={name} maxlength="27" />
		<button>Update</button>
	</div>
</div>
<div class="name-errors">{nameErrors}</div>
<div class="block">
	<div class="input-group">
		<input type="text" id="userInput" value={PlayerState.getName()} />
		<button>Update</button>
	</div>
</div>
<div class="password-errors">{passwordErrors}</div>

<style>
	.block {
		margin-top: 18px;
		margin-bottom: 6px;
	}

	.input-group {
		display: flex;
		width: 100%;
	}

	.input-group input[type='text'] {
		flex-grow: 1;
		padding: 10px;
		margin-right: 8px;
		border: 1px solid #ccc;
		border-radius: 8px;
		font: inherit;
		box-sizing: border-box;
	}

	.input-group button {
		white-space: nowrap;
		border: 1px solid #ccc;
		border-radius: 9px;
		padding: 10px;
		font-size: 16px;
	}
</style>
