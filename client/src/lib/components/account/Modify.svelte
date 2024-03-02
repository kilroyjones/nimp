<script lang="ts">
	import { PlayerState } from '$lib/state/player.state';
	import { Data } from '$shared/data';

	let passwordError: string = 'Password must be at least 9 characters';
	let option: string = 'password';
	let currentPassword: string = '';
	let password1: string = '';
	let password2: string = '';

	const checkPassword = () => {
		const check1 = Data.checkPassword(password1);
		const check2 = Data.checkPassword(password2);

		if (check1.err == true) {
			passwordError = check1.msg;
		} else if (check2.err == true) {
			passwordError = check2.msg;
		} else if (password1 != password2) {
			passwordError = "Passwords don't match";
		} else {
			passwordError = '';
		}
	};

	const changePassword = async () => {
		try {
			const data = {
				token: PlayerState.getToken(),
				currentPassword: currentPassword,
				newPassword: password1
			};

			const response = await fetch('http://localhost:3000/account/change-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});

			// TODO: Better way of converting this and verifying data?
			if (response.status == 200) {
				currentPassword = '';
				password1 = '';
				password2 = '';
				option = 'password-updated';
				// const res = await response.json();
				// TODO: Handle error for the update
			}
		} catch (error: any) {
			console.log('error creating account: ', error);
		}
	};
</script>

<div class="input-group">
	<div class="options">
		<button on:click={() => (option = 'password')}>Change password</button>
		<button on:click={() => (option = 'delete')}>Delete account</button>
	</div>
</div>

{#if option == 'password'}
	<div class="block">
		<div class="input-group">
			<input
				type="password"
				placeholder="Current password"
				bind:value={currentPassword}
				maxlength="27"
			/>
		</div>
	</div>
	<div class="block">
		<div class="input-group">
			<input
				type="password"
				on:keyup={checkPassword}
				placeholder="Password"
				bind:value={password1}
				maxlength="27"
			/>
		</div>
		<div class="input-group">
			<input
				type="password"
				on:keyup={checkPassword}
				placeholder="Password confirm"
				bind:value={password2}
				maxlength="27"
			/>
		</div>
	</div>
	<div class="error">{passwordError}</div>
	<div class="input-group at-end">
		<button on:click={changePassword}>Submit</button>
	</div>
{:else if option == 'password-updated'}
	<div>Password changed!</div>
{:else}
	<div class="block">
		<div class="directions">
			Deleting your account will remove your name from all owned posts. Your claims will remain
			until your current upkeep expires. Enter your password and press <strong>Delete</strong> to complete
			the process.
		</div>
	</div>
	<div class="input-group">
		<input type="password" placeholder="Password" bind:value={password1} maxlength="27" />
	</div>
	<div class="input-group at-end">
		<button>Submit</button>
	</div>
{/if}

<style>
	.at-end {
		justify-content: end;
	}

	.block {
		margin-top: 18px;
		margin-bottom: 6px;
	}

	.directions {
		font-size: 16px;
		margin-bottom: 32px;
		margin-left: 4px;
	}

	.error {
		min-height: 18px;
		font-size: 14px;
		color: #880000;
		margin-left: 4px;
		margin-bottom: 8px;
	}

	.input-group {
		display: flex;
		width: 100%;
	}

	.input-group input[type='password'] {
		flex-grow: 1;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 8px;
		font: inherit;
		box-sizing: border-box;
		margin-bottom: 8px;
	}

	.input-group button {
		white-space: nowrap;
		border: 1px solid #ccc;
		border-radius: 9px;
		padding: 10px;
		font-size: 16px;
	}

	.options {
		display: flex;
		width: 100%;
		justify-content: space-between;
	}
</style>
