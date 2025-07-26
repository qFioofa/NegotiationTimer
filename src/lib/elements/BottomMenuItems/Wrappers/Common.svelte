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
		background: var(--bg);
		padding: 1rem;
		margin-left: 50px;
		border-radius: 12px;
		border: 1px solid var(--accent);
		margin-bottom: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.top-header {
		font-size: 1.7rem;
		color: var(--accent);
		margin: 5px;
		display: flex;
		align-items: center;
		gap: 0.4rem;
		user-select: none;
	}

	.top-title {
		margin: 5px;
		color: var(--fg-muted);
		font-size: 1.7rem;
		user-select: none;
	}

	.top-p {
		margin: 5px;
		color: var(--fg-muted);
		font-size: 1.1rem;
		user-select: none;
	}
</style>
