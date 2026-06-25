<script>
	let { children } = $props();
</script>

<div class="item-content">
	{@render children?.()}
</div>

<style>
	.item-content {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		user-select: none;
	}
</style>
