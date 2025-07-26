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
		border-radius: 8px;
		padding: 0.4rem 0.8rem;
		cursor: pointer;
		font-weight: bold;
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.9rem;
	}
</style>
