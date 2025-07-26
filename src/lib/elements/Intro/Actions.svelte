<script>
	export let forgetText;
	export let closeText;

	export let closeForever = () => {};
	export let onClose = () => {};
</script>

<div class="intro-actions">
	{#if forgetText}
		<button class="forget-intro" on:click={closeForever}>{forgetText}</button>
	{/if}
	{#if closeText}
		<button class="close-intro" on:click={onClose}>{closeText}</button>
	{/if}
</div>

<style>
	.intro-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
	}

	.close-intro {
		background: var(--accent);
		color: var(--input-bg);
		border: none;
		padding: 0.6rem 1.2rem;
		border-radius: 10px;
		cursor: pointer;
		font-weight: bold;
		font-size: 1rem;
		transition: background 0.2s;
	}

	.forget-intro {
		background: var(--bg-secondary);
		color: var(--fg);
		border: 1px solid var(--accent);
		padding: 0.6rem 1.2rem;
		border-radius: 10px;
		cursor: pointer;
		font-weight: bold;
		font-size: 1rem;
		transition: background 0.2s;
	}
</style>
