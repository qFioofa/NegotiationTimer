<script>
	let { text, ref = $bindable() } = $props();
</script>

<div class="number" bind:this={ref}>{text}</div>

<style>
	.number {
		font-family: var(--font-family-simple);
		/* min с vw, чтобы две цифры рядом не вылезали за карточку на узких/landscape окнах */
		font-size: min(50vh, 26vw);
		text-shadow: 0 0 12px var(--shadow);
		font-weight: var(--font-weight-black);
		line-height: 1;
		color: var(--accent);
		user-select: none;
	}
</style>
