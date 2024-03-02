<script lang="ts">
	import { goto } from '$app/navigation';
	import { PlayerState } from '$lib/state/player.state';
	import { update } from '$lib/state/world.state';
	import { Data } from '$shared/data';
	import type { Player } from '$shared/types';
	// let name: string;
	// let password: string;
	// let email: string;
	let name: string = 'fred';
	let password: string = 'asdfj23lfkjasdf';
	let email: string = 'fda@asfd.com';
	let nameError: string = '';
	let passwordError: string = '';

	const checkName = () => {
		const { err, msg } = Data.checkName(name);
		if (err) {
			nameError = msg;
		} else {
			nameError = '';
		}
	};

	const checkPassword = () => {
		const { err, msg } = Data.checkPassword(password);
		console.log(err, msg);
		if (err) {
			passwordError = msg;
		} else {
			passwordError = '';
		}
	};

	const createAccount = async () => {
		try {
			const data = {
				name: name,
				password: password,
				token: PlayerState.getToken(),
				email: email
			};

			const response = await fetch('http://localhost:3000/account/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});

			// TODO: Better way of converting this and verifying data?
			if (response.status == 200) {
				const updatedPlayer = await response.json();
				if (updatedPlayer) {
					PlayerState.set(updatedPlayer.msg as unknown as Player);
					goto('/account/success', { replaceState: true });
				}
				goto('/account/failure', { replaceState: true });
			}
		} catch (error: any) {
			console.log('error creating account: ', error);
		}
	};
</script>

<div class="input-group">
	<input type="text" placeholder="Name" on:keyup={checkName} bind:value={name} />
	<div class="error">{nameError}</div>
	<input type="password" placeholder="Password" on:keyup={checkPassword} bind:value={password} />
	<div class="error">{passwordError}</div>
	<input type="text" placeholder="Email (optional)" bind:value={email} />
	<button on:click={createAccount}>Create account</button>
</div>
<div class="back-to-game"><a href="/play">Back to game</a></div>

<style>
	.back-to-game {
		text-align: center;
	}

	.error {
		min-height: 18px;
		font-size: 14px;
		color: #880000;
		margin-left: 4px;
	}

	input {
		border-radius: 8px;
		font: inherit;
	}

	.input-group input {
		display: block;
		width: 100%;
		margin-bottom: 16px;
		box-sizing: border-box;
	}

	.input-group button {
		display: block;
		margin: 0 auto;
		margin-top: 26px;
		margin-bottom: 26px;
		padding: 10px 20px;
		font: inherit;
	}

	.input-group input,
	.input-group button {
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 10px;
	}

	.input-group input:focus,
	.input-group button:focus {
		outline: none;
		border-color: #007bff;
	}
</style>
