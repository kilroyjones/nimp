<script lang="ts">
	export let isChecked: boolean;
</script>

<label class="slider">
	<input type="checkbox" bind:checked={isChecked} on:click|stopPropagation={() => {}} />
	<span class="slider-round" />
</label>

<style>
	.slider {
		position: relative;
		display: inline-block;
		width: 60px;
		height: 34px;
	}

	.slider input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.slider .slider-round {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #f16868;
		transition: 0.4s;
		border-radius: 34px;
	}

	.slider .slider-round:before {
		position: absolute;
		content: '';
		height: 26px;
		width: 26px;
		left: 4px;
		bottom: 4px;
		background-color: white;
		transition: 0.4s;
		border-radius: 50%;
	}

	input:checked + .slider-round {
		background-color: #2196f3;
	}

	input:checked + .slider-round:before {
		transform: translateX(26px);
	}
</style>
