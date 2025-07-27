<script>
	export let value;
	export let text;
	export let error;
	export let onApply = async () => {};
</script>

<button
	class="bottom-item-apply-button"
	disabled={error}
	on:click={async () => {
		const _result = await onApply(value);
		if (_result == null) return;

		if (typeof _result === "object") {
			value = _result.value;
			error = _result.error;
			return;
		}

		value = _result;
		error = null;
	}}
>
	{#if text}
		{text}
	{:else}
		<slot />
	{/if}
</button>

<style>
	.bottom-item-apply-button {
		background: var(--accent);
		color: var(--input-bg);
		border: none;
		margin: 5px;
		padding: 0.4rem 0.8rem;
		cursor: pointer;
		font-weight: bold;
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.9rem;
		font-family: var(--font-family-base);
		font-weight: var(--font-weight-bold);
		line-height: var(--line-height-base);
		transition: var(--transition);
		user-select: none;
		border-radius: 0.6rem;
		position: relative;
		transform: translateY(0);
		box-shadow: 0 4px 0 var(--accent-dark);
	}

	.bottom-item-apply-button:hover:not(:disabled) {
		background: var(--accent-light);
		transform: translateY(-1px);
		box-shadow: 0 5px 0 var(--accent-dark);
	}

	.bottom-item-apply-button:active:not(:disabled) {
		transform: translateY(4px);
		box-shadow: 0 0 0 var(--accent-dark);
		transition:
			transform 0.1s ease,
			box-shadow 0.1s ease;
	}

	.bottom-item-apply-button:disabled {
		background: var(--bg-muted);
		color: var(--fg-disabled);
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}
</style>
