<script>
	import BrushSize from './BrushSize.svelte';
	import ImageUpload from './ImageUpload.svelte';
	import PublishReset from './PublishReset.svelte';
</script>

<div class="brush-upload-container">
	<div class="brush-slider">
		<BrushSize />
	</div>
	<div class="upload-button">
		<ImageUpload />
	</div>
</div>

<div class="publish-reset-container">
	<PublishReset />
</div>

<style>
	.brush-upload-container {
		display: flex;
		width: 256px;
		height: 50px;
	}

	.brush-slider {
		flex-basis: 70%;
	}

	.upload-button {
		margin-top: 2px; /* I have not figured out why I need this? */
		flex-basis: 30%;
	}

	.publish-reset-container {
		display: flex;
		width: 100%;
		width: 256px;
		height: 50px;
		margin-top: 12px;
	}
</style>
