<script>
	let {
		forgetText,
		closeText,
		closeForever = () => {},
		onClose = () => {},
	} = $props();
</script>

<div class="intro-actions">
	{#if forgetText}
		<button class="forget-intro" onclick={closeForever}>{forgetText}</button
		>
	{/if}
	{#if closeText}
		<button class="close-intro" onclick={onClose}>{closeText}</button>
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

	.forget-intro:hover {
		background: var(--bg-secondary);
		color: var(--fg);
	}

	/* На узких экранах кнопки делят ширину поровну и не разъезжаются по высоте. */
	@media (max-width: 480px) {
		.intro-actions {
			gap: 0.6rem;
		}
		.forget-intro,
		.close-intro {
			flex: 1;
			padding: 0.6rem 0.5rem;
			font-size: 0.85rem;
		}
	}
</style>
