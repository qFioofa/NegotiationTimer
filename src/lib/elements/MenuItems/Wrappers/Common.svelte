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
				<span>{title}</span>
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
		margin: 12px 0;
		background: var(--bg);
		border-radius: 14px;
		border: 1px solid var(--accent);
		transition: all 0.3s ease;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.menu-item:hover {
		box-shadow: 0 0 20px var(--shadow);
	}

	.menu-top {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.item-title {
		font-size: 1.6rem;
		color: var(--fg);
		font-weight: 500;
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
		background: var(--input-bg);
		border-radius: 50%;
		color: var(--accent);
	}

	.divider {
		width: 100%;
		height: 1px;
		border: none;
		margin: 0;
		background: var(--divider, rgba(255, 255, 255, 0.1));
	}

	.menu-slot {
		margin-top: 0.5rem;
	}
</style>
