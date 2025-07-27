<script>
	import ToolTip from "./ToolTip.svelte";

	export let icon;
	export let title;
	export let tooltipText;
</script>

<div class="menu-item">
	<div class="menu-top">
		{#if icon}
			<div class="item-icon">{icon}</div>
		{/if}
		<div class="item-title">
			{#if title}
				{title}
			{/if}
		</div>
		<ToolTip {tooltipText} />
	</div>

	<hr class="divider" />

	<div class="menu-slot">
		<slot />
	</div>
</div>

<style>
	.menu-item {
		padding: 20px;
		border-radius: 14px;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		transform: translateY(0);
	}

	.menu-top {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.item-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.item-icon {
		font-size: 2rem;
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.divider {
		width: 100%;
		height: 1px;
		border: none;
		margin: 0;
	}

	.menu-slot {
		margin-top: 0.5rem;
	}

	.menu-item {
		background: var(--bg-card);
		border: none;
		box-shadow: none;
	}

	.item-title {
		color: var(--fg-heading);
	}

	.item-icon {
		background: var(--bg-muted);
		color: var(--accent-light);
	}

	.divider {
		background: var(--divider, rgba(255, 255, 255, 0.1));
	}

	.menu-slot {
		color: var(--fg);
	}

	.menu-item:hover {
		background: var(--bg);
		border-color: var(--accent);
		box-shadow: 0 0 0 2px var(--accent);
		transform: translateY(2px) scale(1.06);
		padding: 21px;
	}

	.menu-item {
		font-family: var(--font-family-base);
	}

	.item-title {
		font-family: var(--font-family-accent);
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-bold);
		line-height: var(--line-height-tight);
		letter-spacing: var(--letter-spacing-normal);
	}

	.menu-slot {
		font-family: var(--font-family-base);
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-normal);
		line-height: var(--line-height-base);
		letter-spacing: var(--letter-spacing-normal);
	}

	.menu-item {
		transition:
			background-color 0.3s ease,
			border-color 0.3s ease,
			box-shadow 0.3s ease,
			transform 0.3s ease,
			padding 0.3s ease;
	}

	.item-title {
		user-select: none;
	}
</style>
