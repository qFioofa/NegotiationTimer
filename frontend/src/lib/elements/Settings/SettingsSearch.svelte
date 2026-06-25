<script>
	import { Search, X } from "lucide-svelte";

	let { query = $bindable("") } = $props();
	let inputRef;

	export function focus() {
		inputRef?.focus();
	}
</script>

<div class="search">
	<span class="search-icon" aria-hidden="true"><Search size={20} /></span>
	<input
		bind:this={inputRef}
		bind:value={query}
		type="text"
		class="search-input"
		placeholder="Поиск настроек..."
		aria-label="Поиск настроек"
	/>
	{#if query}
		<button
			class="search-clear"
			aria-label="Очистить поиск"
			onclick={() => {
				query = "";
				inputRef?.focus();
			}}
		>
			<X size={18} />
		</button>
	{/if}
</div>

<style>
	.search {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0 var(--spacing-md);
		background: var(--input-bg);
		border: 1px solid var(--accent);
		border-radius: var(--radius-lg);
	}

	.search-icon {
		font-size: 1.4rem;
		flex-shrink: 0;
		user-select: none;
	}

	.search-input {
		flex: 1;
		min-width: 0;
		padding: 0.8rem 0;
		background: transparent;
		border: none;
		outline: none;
		color: var(--fg);
		font-family: var(--font-family-base);
		font-size: var(--font-size-slg);
	}

	.search-clear {
		flex-shrink: 0;
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		border-radius: 50%;
		color: var(--fg-muted);
		cursor: pointer;
		font-size: 1.2rem;
		transition: background 0.2s ease;
	}

	.search-clear:hover {
		background: var(--bg-muted);
		color: var(--fg);
	}
</style>
