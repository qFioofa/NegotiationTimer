<script>
	export let supportedTypes = [];
	export let onChange = async () => {};
</script>

<input class="media-upload" type="file" accept={supportedTypes.join(",")} on:change={onChange} />

<style>
	.media-upload {
		font-size: 1.2rem;
		color: var(--fg);
		width: 100%;
		max-width: 100%;
	}
</style>
