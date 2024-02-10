<script lang="ts">
	import { showTextEditor } from '$lib/state/settings.state';
	import type { Post } from '$lib/types';

	export let post: Post;
	console.log(post);

	let inputValue = ''; // Binds to the text input

	function submit() {
		console.log('submit');
	}

	function close(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			$showTextEditor = false;
			console.log('close');
			console.log('Closing modal');
		}
	}
</script>

<div role="button" tabindex="0" class="modal-overlay" on:mousedown={close} on:keypress={() => {}}>
	<div
		class="modal-content"
		role="button"
		tabindex="0"
		on:click|stopPropagation
		on:keydown|stopPropagation
	>
		<form class="modal-form" on:submit={submit}>
			<textarea
				style="width:{post.width}px; height: {post.height}px"
				bind:value={inputValue}
				placeholder="Enter text here"
			/>
			<button type="submit">Submit</button>
		</form>
	</div>
</div>

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 10;
	}

	.modal-content {
		padding: 20px;
		background-color: white;
		border-radius: 5px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0);
	}

	.modal-form {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	textarea {
		width: 300px; /* Adjust width as needed */
		height: 100px; /* Adjust height as needed */
		font-size: 16px; /* Sets the font size */
		font-family: monospace; /* Sets the font to monospace */
		color: #595959; /* Sets the text color to a slightly gray shade */
		border: 1px solid #ccc; /* Initial border color */
		transition: border 0.3s ease; /* Smooth transition for border color change */
	}

	/* Textarea styling on focus */
	textarea:focus {
		outline: none; /* Removes the default focus outline */
		border: 1px solid rgba(128, 128, 128, 0.5); /* Sets the border color to partially transparent gray */
	}
</style>
