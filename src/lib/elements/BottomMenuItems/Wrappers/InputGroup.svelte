<script>
	let { children } = $props();
</script>

<div class="input-group">
	{@render children?.()}
</div>

<style>
	.input-group {
		display: flex;
		gap: 0.4rem;
		align-items: center;
		user-select: none;
	}
</style>
