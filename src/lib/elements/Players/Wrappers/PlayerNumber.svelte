<script>
	export let text;
	export let ref;
</script>

<div class="number" bind:this={ref}>{text}</div>

<style>
	.number {
		font-size: 50vh;
		font-weight: 900;
		color: var(--accent);
		text-shadow: 0 0 12px var(--shadow);
		margin-bottom: 1.2rem;
		user-select: none;
		line-height: 1;
	}
</style>
