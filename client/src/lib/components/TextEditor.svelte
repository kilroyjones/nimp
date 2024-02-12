<script lang="ts">
	// Modules
	import { ActionHandler } from '$lib/handlers/action.handler';
	import { showTextEditor } from '$lib/state/settings.state';

	// Types and constants
	import type { Post } from '$lib/types';

	export let post: Post;

	let inputValue = '';

	/**
	 * Submits a post using the ActionHandler's sendPost method.
	 */
	function submit() {
		ActionHandler.sendPost(post.regionKey, post.postKey, inputValue);
	}

	/**
	 * Handles the closing of a text editor UI element when a click event occurs.
	 *
	 * @param {MouseEvent} event - The click event that triggered the close function.
	 */
	function close(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			$showTextEditor = false;
		}
	}
</script>

<div role="button" tabindex="0" class="modal-overlay" on:mousedown={close} on:keypress={() => {}}>
	<div class="modal-wrapper">
		<div
			class="modal-content"
			role="button"
			tabindex="0"
			on:click|stopPropagation
			on:keydown|stopPropagation
		>
			<form class="modal-form" on:submit={submit}>
				<textarea
					style="width:{post.width - 16}px; height: {post.height - 16}px"
					bind:value={inputValue}
					placeholder="Enter text here"
				/>
				<button type="submit">Submit</button>
			</form>
		</div>
		<div class="sidebar">
			<button class="close-btn" on:click={close}>X</button>
		</div>
	</div>
</div>

<style>
	.close-btn {
		width: 24px;
		height: 24px;
		margin: 0 auto;
		cursor: pointer;
		border: 1px solid #ccc;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 16px;
		background-color: #fff;
	}

	.modal-content {
		padding: 16px 8px 16px 16px;
		background-color: white;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.25);
	}

	.modal-form {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

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

	.modal-wrapper {
		display: inline-flex;
		align-items: stretch;
	}

	.sidebar {
		width: 40px;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		padding-top: 16px;
	}

	textarea {
		font-size: 16px;
		font-family: monospace;
		color: #595959;
		border: 1px solid #ccc;
	}

	textarea:focus {
		outline: none;
		border: 1px solid rgba(128, 128, 128, 0.5);
	}
</style>
