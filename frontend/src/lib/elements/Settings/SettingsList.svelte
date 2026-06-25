<script>
	import { settings, ALL_CATEGORY } from "./settingsRegistry";
	import { settingScore } from "./fuzzy";
	import SettingCard from "./SettingCard.svelte";

	let { category, query = "" } = $props();

	// Поиск только внутри выбранной категории; в «Все» — глобально (ТЗ).
	let visible = $derived.by(() => {
		const inCategory =
			category === ALL_CATEGORY
				? settings
				: settings.filter((s) => s.category === category);

		const q = query.trim();
		if (!q) return inCategory.map((s) => ({ s, score: 0 }));

		return inCategory
			.map((s) => ({ s, score: settingScore(q, s) }))
			.filter((r) => r.score !== null)
			.sort((a, b) => b.score - a.score);
	});
</script>

<div class="list">
	{#each visible as { s } (s.id)}
		<SettingCard setting={s} />
	{:else}
		<div class="empty">Ничего не найдено</div>
	{/each}
</div>

<style>
	.list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.empty {
		padding: var(--spacing-xl);
		text-align: center;
		color: var(--fg-muted);
		font-family: var(--font-family-accent);
		font-size: var(--font-size-slg);
		user-select: none;
	}
</style>
