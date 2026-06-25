<script>
	// Strict 3-zone card (ТЗ): [иконка + название + функционал] │ [описание] │
	// [результат/превью]. Зоны разделены тонкими вертикальными перегородками.
	// Каждая зона всегда присутствует; пусто — остаётся пустое место.
	// Tooltip убран: его текст идёт как описание (description ?? tooltipText).
	let { icon, title, tooltipText, description, preview, children } = $props();

	let desc = $derived(description ?? tooltipText);
</script>

<div class="menu-item">
	<div class="col col-func">
		<div class="func-head">
			{#if icon}
				{@const Icon = icon}
				<div class="item-icon"><Icon size={24} /></div>
			{/if}
			{#if title}
				<div class="item-title">{title}</div>
			{/if}
		</div>
		<div class="item-control">
			{@render children?.()}
		</div>
	</div>

	<div class="col col-info">
		{#if desc}
			<div class="item-description">{desc}</div>
		{/if}
	</div>

	<div class="col col-preview">
		{#if preview}
			{@render preview()}
		{/if}
	</div>
</div>

<style>
	.menu-item {
		display: grid;
		grid-template-columns: minmax(190px, 1.1fr) minmax(140px, 1fr) minmax(
				140px,
				1fr
			);
		align-items: stretch;
		gap: 0;
		padding: 20px;
		border-radius: 14px;
		background: var(--bg-card);
		border: 1px solid transparent;
		box-shadow: none;
		font-family: var(--font-family-base);
		transition:
			background-color 0.25s ease,
			border-color 0.25s ease,
			box-shadow 0.25s ease;
	}

	.col {
		position: relative;
		display: flex;
		flex-direction: column;
		min-width: 0;
		padding: 0 var(--spacing-lg);
	}

	.col:first-child {
		padding-left: 0;
	}

	.col:last-child {
		padding-right: 0;
	}

	/* Уточнённые вертикальные перегородки: тонкая линия по центру высоты,
	   плавно гаснущая к краям — мягче жёсткого border во всю высоту. */
	.col-info::before,
	.col-preview::before {
		content: "";
		position: absolute;
		left: 0;
		top: 10%;
		bottom: 10%;
		width: 1px;
		background: linear-gradient(
			to bottom,
			transparent,
			color-mix(in srgb, var(--accent) 45%, transparent) 50%,
			transparent
		);
	}

	/* Зона 1: иконка + название в одну строку, под ними — функционал. */
	.col-func {
		gap: 1rem;
		justify-content: flex-start;
	}

	.func-head {
		display: flex;
		align-items: center;
		gap: 0.8rem;
		min-width: 0;
	}

	.item-icon {
		font-size: 1.8rem;
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		flex-shrink: 0;
		background: var(--bg-muted);
		color: var(--accent-light);
	}

	.item-title {
		color: var(--fg);
		font-family: var(--font-family-accent);
		font-size: var(--font-size-slg);
		font-weight: var(--font-weight-bold);
		line-height: var(--line-height-tight);
		letter-spacing: var(--letter-spacing-normal);
		user-select: none;
		word-break: break-word;
	}

	.item-control {
		width: 100%;
		min-width: 0;
		color: var(--fg);
		font-size: var(--font-size-base);
		line-height: var(--line-height-base);
	}

	/* Контролы прижаты влево, под иконку с названием. */
	.col-func :global(.toggle-wrapper),
	.col-func :global(.item-content) {
		justify-content: flex-start;
		align-items: flex-start;
	}

	/* Зона 2: описание функционала (центр). */
	.col-info {
		justify-content: center;
	}

	.item-description {
		color: var(--fg-muted);
		font-family: var(--font-family-base);
		font-size: var(--font-size-base);
		line-height: var(--line-height-base);
		user-select: none;
		word-break: break-word;
	}

	/* Зона 3: результат / предосмотр (справа). */
	.col-preview {
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	/* Hover: только мягкая подсветка, без scale/padding — ничего не вылезает. */
	.menu-item:hover {
		background: var(--bg);
		border-color: var(--accent);
		box-shadow: 0 0 0 2px var(--accent);
	}

	/* Узкий экран: зоны складываются в стопку, перегородки — горизонтальные. */
	@media (max-width: 720px) {
		.menu-item {
			grid-template-columns: 1fr;
		}
		.col {
			padding: 0;
		}
		.col-info::before,
		.col-preview::before {
			display: none;
		}
		.col-info,
		.col-preview {
			padding-top: var(--spacing-md);
			margin-top: var(--spacing-md);
			border-top: 1px solid
				color-mix(in srgb, var(--accent) 30%, transparent);
		}
		.col-preview:empty {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.menu-item {
			transition: none;
		}
	}
</style>
