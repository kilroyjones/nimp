<script lang="ts">
	/**
	 * This component combines three functions:
	 *    - Publish - submit the current image.
	 *    - Reset - clears the canvas.
	 *    - Back - returns to the exploration window.
	 */
	import { selectedClaimId, publishedContent } from '$lib/state/painter.state';

	function reset() {
		/**
		 * Resets the canvas to the background color.
		 */

		if (document) {
			const elem = document.getElementById('canvas') as HTMLCanvasElement;
			if (elem) {
				const ctx = elem.getContext('2d');
				if (ctx) {
					ctx.fillStyle = '#121317';
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
		// var c = document.getElementById('canvas');
		// var imgData = c.toDataURL('image/png');
		// const response = await fetch('http://127.0.0.1:5000/publish_claim', {
		// 	method: 'POST',
		// 	body: JSON.stringify({
		// 		id: $selectedClaimId,
		// 		content: imgData
		// 	})
		// });
		// if (response.status === 200) {
		// 	var temp = await response.json();
		// } else {
		// 	throw new Error(response.statusText);
		// }
		// $publishedContent = -$publishedContent; // Needed to force update.
	}
</script>

<button id="publish-button" on:click={publish}>Publish</button>
<button id="reset-button" on:click={reset}>Reset</button>
<button id="back-button">Back</button>

<style>
	button {
		width: 32.7%;
		border: none;
		color: white;
		padding: 15px 20px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 20px;
	}

	button:hover {
		box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.1);
	}

	#publish-button {
		width: 49%;
		background-color: #008cba;
	}

	#reset-button {
		width: 24%;
		background-color: #f97068;
	}

	#back-button {
		width: 24%;
		background-color: #4caf50;
	}
</style>
