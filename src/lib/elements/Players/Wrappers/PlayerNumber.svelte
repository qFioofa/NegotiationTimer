<script>
	export let text;
	export let ref;
</script>

<div class="number" bind:this={ref}>{text}</div>

<style>
	.number {
		font-family: var(--font-family-simple);
		font-size: 50vh;
		text-shadow: 0 0 12px var(--shadow);
		font-weight: var(--font-weight-black);
		line-height: 1;
		color: var(--accent);
		margin-bottom: 1.2rem;
		user-select: none;
	}
</style>
