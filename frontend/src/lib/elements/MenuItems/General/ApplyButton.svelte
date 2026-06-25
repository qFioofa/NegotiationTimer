<script>
	let {
		value = $bindable(),
		text,
		error = $bindable(),
		onApply = async () => {},
		children,
	} = $props();
</script>

<button
	class="menu-item-apply-button"
	disabled={error}
	onclick={async () => {
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
		{@render children?.()}
	{/if}
</button>

<style>
	.menu-item-apply-button {
		width: 100%;
		padding: 0.6rem 1.2rem;
		font-size: 1.2rem;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		background: var(--accent);
		color: var(--input-bg);
		box-shadow: 0 0 8px var(--shadow);
		transition: background 0.2s ease;
		text-align: center;
		font-weight: bold;
		user-select: none;
	}

	.menu-item-apply-button:hover {
		background: var(--accent-light);
	}
</style>
