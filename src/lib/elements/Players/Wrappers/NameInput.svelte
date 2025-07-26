<script>
	import { onMount } from "svelte";

	export let inputRef;
	export let playerName;
	export let ghostRef;
	export let defaultText = "Имя игрока";
	export let maxlength = 40;
	export let padding = 32;

	function updateWidth() {
		if (!ghostRef || !inputRef) return;

		ghostRef.textContent = playerName || defaultText;

		const width = ghostRef.offsetWidth + padding;

		inputRef.style.width = `${width}px`;
	}

	export let updatePlayerName = e => {
		playerName = e.target.value.slice(0, maxlength);
		updateWidth();
	};

	onMount(() => {
		updateWidth();
	});
</script>

<input
	class="name-input"
	type="text"
	bind:this={inputRef}
	placeholder={defaultText}
	value={playerName}
	on:input={updatePlayerName}
	{maxlength}
/>
<span class="ghost" bind:this={ghostRef}>{defaultText}</span>

<style>
	.name-input {
		height: 5rem;
		border-radius: 2rem;
		text-align: center;
		font-size: 1.2rem;
		color: var(--input-fg);
		background: var(--input-bg);
		border: 2px solid var(--bg);
		backdrop-filter: blur(8px);
		transition: all 0.3s ease;
		padding: 0 1rem;
		box-shadow: 0 0 10px var(--shadow);
		min-width: 8ch;
	}

	.name-input:focus,
	.name-input:hover,
	.name-input:not(:placeholder-shown) {
		background: var(--input-bg);
		box-shadow: 0 0 16px var(--shadow);
	}

	.ghost {
		position: absolute;
		visibility: hidden;
		white-space: nowrap;
		font-size: 1.2rem;
		font-family: inherit;
		padding: 0 1rem;
	}
</style>
