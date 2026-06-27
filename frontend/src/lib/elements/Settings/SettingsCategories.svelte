<script>
	import { categories as defaultCategories } from "./settingsRegistry";

	// cats по умолчанию — обычные категории; комната передаёт свой набор.
	let { selected = $bindable(), cats = defaultCategories } = $props();

	// Стрелки влево/вправо перемещают по вкладкам (доступность).
	function onKeydown(e, index) {
		if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
		e.preventDefault();
		const dir = e.key === "ArrowRight" ? 1 : -1;
		const next = (index + dir + cats.length) % cats.length;
		selected = cats[next].id;
		document.getElementById(`cat-${cats[next].id}`)?.focus();
	}
</script>

<div class="categories" role="tablist" aria-label="Категории настроек">
	{#each cats as cat, i}
		{@const Icon = cat.icon}
		<button
			id="cat-{cat.id}"
			role="tab"
			aria-selected={selected === cat.id}
			class="category"
			class:active={selected === cat.id}
			class:all={cat.id === "all"}
			tabindex={selected === cat.id ? 0 : -1}
			onclick={() => (selected = cat.id)}
			onkeydown={(e) => onKeydown(e, i)}
		>
			<span class="cat-icon" aria-hidden="true"><Icon size={18} /></span>
			<span class="cat-label">{cat.label}</span>
		</button>
	{/each}
</div>

<style>
	.categories {
		display: flex;
		gap: 0.6rem;
		overflow-x: auto;
		overflow-y: hidden;
		padding-bottom: 0.4rem;
		scrollbar-width: thin;
		scrollbar-color: var(--accent-light) transparent;
	}

	.categories::-webkit-scrollbar {
		height: 6px;
	}

	.categories::-webkit-scrollbar-thumb {
		background-color: var(--accent-light);
		border-radius: var(--radius-sm);
	}

	.category {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-shrink: 0;
		padding: 0.5rem 1rem;
		background: var(--bg-card);
		border: 1px solid transparent;
		border-radius: var(--radius-lg);
		color: var(--fg);
		cursor: pointer;
		white-space: nowrap;
		font-family: var(--font-family-base);
		font-size: var(--font-size-base);
		transition:
			background 0.2s ease,
			border-color 0.2s ease,
			color 0.2s ease;
	}

	.category:hover {
		border-color: var(--accent);
	}

	.category.active {
		background: var(--accent);
		color: var(--input-bg);
		font-weight: var(--font-weight-bold);
	}

	/* «Все» — отдельный фон для выделения (ТЗ). */
	.category.all {
		background: var(--bg-muted);
	}

	.category.all.active {
		background: var(--accent);
	}

	.cat-icon {
		font-size: 1.2rem;
	}
</style>
