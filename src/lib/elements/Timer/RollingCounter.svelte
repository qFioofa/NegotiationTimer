<script>
	import RollingDigit from "./RollingDigit.svelte";

	export let value = "00:05";
	export let fontSize = 64;
	export let padding = 8;

	const height = fontSize + padding;

	function parseDigits(str) {
		return str.split("").map(c => (/\d/.test(c) ? parseInt(c) : c));
	}
</script>

<div class="counter" style="font-size: {fontSize}px">
	{#each parseDigits(value) as char, i}
		{#if typeof char === "number"}
			<RollingDigit {char} {height} />
		{:else}
			<span class="separator" style="height: {height}px">{char}</span>
		{/if}
	{/each}
</div>

<style>
	.counter {
		display: flex;
		align-items: flex-end;
		gap: 0.4rem;
		font-family: "Courier New", monospace;
	}

	.separator {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 0.3rem;
		color: var(--accent-light);
		user-select: none;
		font-weight: 700;
	}
</style>
