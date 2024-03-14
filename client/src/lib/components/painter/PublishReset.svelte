<script lang="ts">
	import { ActionHandler } from '$lib/handlers/action.handler';
	/**
	 * This component combines three functions:
	 *    - Publish - submit the current image.
	 *    - Reset - clears the canvas.
	 *    - Back - returns to the exploration window.
	 */
	import { selectedClaimId, publishedContent } from '$lib/state/painter.state';
	import type { Post } from '$shared/types';

	export let post: Post;

	function reset() {
		/**
		 * Resets the canvas to the background color.
		 */

		if (document) {
			const elem = document.getElementById('canvas') as HTMLCanvasElement;
			if (elem) {
				const ctx = elem.getContext('2d');
				if (ctx) {
					ctx.fillStyle = '#fff';
					ctx.fillRect(0, 0, elem.width, elem.height);
				}
			}
		}
	}

	async function publish() {
		/**
		 * Publish converts the canvas to png and posts it to the server.
		 *
		 * Fix:
		 *  - Need proper error responses for the user. Just goes to temp
		 *    variable at the moment.
		 *  - The $publishContent gets toggled in order to force an update, but
		 *    this is somewhat hacky, and needs to be fixed.
		 */
		// TODO: Add the canvas element to the store or have a route to publish in "Painter"
		let ctx: any = document.getElementById('canvas');
		if (ctx) {
			var imgData = ctx.toDataURL('image/png');
			ActionHandler.sendPost(post.regionKey, post.key, imgData);
		}
	}
</script>

<button id="publish-button" on:click={publish}>Publish</button>
<button id="reset-button" on:click={reset}>Reset</button>

<style>
	button {
		border: none;
		color: white;
		padding: 16px 0px 16px 0px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 20px;
		cursor: pointer;
	}

	button:hover {
		box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.1);
	}

	#publish-button {
		background-color: #008cba;
		flex-basis: 70%;
		margin-right: 2px;
	}

	#reset-button {
		background-color: #f97068;
		flex-basis: 30%;
	}
</style>
