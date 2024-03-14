<script lang="ts">
	/**
	 * The ImageUpload component loads the image from a file
	 * and then pixelates it.
	 *
	 * getColor - used to create a 1D array of rgb colors.
	 * draw - draws the pixel array from getColor to the canvas.
	 */

	// TODO: Fix this Icon error
	// @ts-ignore
	import Icon from 'svelte-icons-pack/Icon.svelte';
	import VscFileMedia from 'svelte-icons-pack/vsc/VscFileMedia';
	import { uploadedImage } from '$lib/state/painter.state';

	// export let post: Post;
	let loadImage: any;

	function getColor(imgArray: Array<any>, w: number, h: number) {
		/**
		 * This will take an uploaded image and pixelate it by creating
		 * a 1D array of rgb values.
		 */

		let r = 0;
		let g = 0;
		let b = 0;
		let dim = w * h;

		for (let i = 0; i < imgArray.length; i = i + 4) {
			r += imgArray[i];
			b += imgArray[i + 1];
			g += imgArray[i + 2];
		}

		r = Math.sqrt(Math.pow(r / dim, 2));
		b = Math.sqrt(Math.pow(b / dim, 2));
		g = Math.sqrt(Math.pow(g / dim, 2));

		return [Math.floor(r), Math.floor(b), Math.floor(g)];
	}

	async function draw() {
		/**
		 * Creates a canvas and puts the pixelated image on it. This is done
		 * by first calculating the size and then filling in 10x10 boxes based
		 * on the rgb values from imgArray.
		 */
		// let canvas = document.createElement('canvas');
		// canvas.width = this.width;
		// canvas.height = this.height;
		// let ctx = canvas.getContext('2d');
		// ctx.drawImage(this, 0, 0);
		// let w = Math.floor(canvas.width / ($selectedClaimSize / 10));
		// let h = Math.floor(canvas.height / ($selectedClaimSize / 10));
		// let c = document.getElementById('canvas');
		// let ctx2 = c.getContext('2d');
		// console.log(c);
		// for (let x = 0; x < $selectedClaimSize / 10; x++) {
		// 	for (let y = 0; y < $selectedClaimSize / 10; y += 1) {
		// 		let color = getColor(ctx.getImageData(x * w, y * h, w, h).data, w, h);
		// 		ctx2.fillStyle = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
		// 		ctx2.fillRect(x * 10, y * 10, 10, 10);
		// 		console.log(color);
		// 	}
		// }
	}

	function pixelateAndDraw(imageSrc: string) {
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement('canvas');
			const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
			canvas.width = img.width;
			canvas.height = img.height;

			if (ctx == null) {
				return;
			}

			// Draw the original image on the canvas
			ctx.drawImage(img, 0, 0);

			// Pixelate logic (simplified for brevity - you might adjust pixel size and logic)
			const pixelSize = 10; // Size of the 'pixel' squares
			for (let y = 0; y < canvas.height; y += pixelSize) {
				for (let x = 0; x < canvas.width; x += pixelSize) {
					const pixelData: any = ctx.getImageData(x, y, pixelSize, pixelSize);
					const avgColor = getColor(pixelData.data, pixelSize, pixelSize);
					ctx.fillStyle = `rgb(${avgColor.join(',')})`;
					ctx.fillRect(x, y, pixelSize, pixelSize);
				}
			}

			// Store the pixelated image as a data URL
			uploadedImage.set(canvas.toDataURL());
		};
		console.log('UP', $uploadedImage);
		img.src = imageSrc;
	}

	// Function to programmatically open the file dialog
	function triggerFileDialog() {
		loadImage.click(); // This should open the file dialog
	}

	const onFileSelected = (event: any) => {
		/**
		 * Used to bring up the file dialog to upload an image.
		 */
		const file = event.target.files[0];
		if (file) {
			const imageSrc = URL.createObjectURL(file);
			pixelateAndDraw(imageSrc);
		}
		// var img = new Image();
		// img.onload = draw;
		// img.src = URL.createObjectURL(e.target.files[0]);
		// console.log(img.src);
	};
</script>

<button id="from-clipboard" title="Upload image" on:click={triggerFileDialog}>
	<div>
		<!-- Assuming the Icon component is correctly imported -->
		<Icon src={VscFileMedia} color="#fff" size="20" />
	</div>
</button>

<input
	bind:this={loadImage}
	class="upload"
	type="file"
	accept=".jpg, .jpeg, .png"
	on:change={onFileSelected}
	style="display: none;"
/>

<style>
	.upload {
		display: none;
		border: 0px;
		background-color: none;
	}

	button {
		border: none;
		height: 50px;
		padding: 0px;
		color: white;
		width: 100%;
		font-size: 20px;
	}
	button:hover {
		box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.1);
	}

	#from-clipboard {
		background-color: #a68ba5;
	}
</style>
