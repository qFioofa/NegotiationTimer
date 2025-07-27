<script>
	export let icon;
	export let title;
	export let description;
</script>

<div class="bottom-menu-item">
	<div class="top">
		<h3 class="top-header">
			{#if icon}
				<div class="item-icon">{icon}</div>
			{/if}
			{#if title}
				<p class="top-title">{title}</p>
			{/if}
		</h3>
		{#if description}
			<p class="top-p">
				{description}
			</p>
		{/if}
	</div>
	<slot />
</div>

<style>
	.bottom-menu-item {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		padding: 1rem;
		margin-left: 50px;
		margin-bottom: 1rem;
		border-radius: var(--radius-lg);
		transform: translateY(0);
		background: var(--bg-card);
		box-shadow: none;
		transition:
			background-color 0.3s ease,
			box-shadow 0.3s ease,
			transform 0.3s ease,
			padding 0.3s ease;
	}

	.bottom-menu-item:hover {
		background: var(--bg);
		box-shadow: 0 0 0 2px var(--accent);
		transform: translateY(2px) scale(1.02);
		padding: 1.1rem;
	}

	.top {
		display: flex;
		flex-direction: column;
	}

	.top-header {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin: 5px 5px 0 5px;
		color: var(--accent);
		font-family: var(--font-family-accent);
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-bold);
		line-height: var(--line-height-tight);
	}

	.top-title {
		color: var(--fg-heading);
		margin: 5px 5px 0 5px;
		font-family: var(--font-family-base);
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-bold);
		line-height: var(--line-height-tight);
	}

	.top-p {
		color: var(--fg-muted);
		margin: 0 5px 5px 5px;
		font-family: var(--font-family-base);
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-normal);
		line-height: var(--line-height-base);
	}

	.item-icon {
		font-size: 1.5rem;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bg-muted);
		color: var(--accent-light);
		border-radius: 50%;
		flex-shrink: 0;
	}

	.top-header,
	.top-title,
	.top-p {
		margin: 0;
		user-select: none;
	}
</style>
