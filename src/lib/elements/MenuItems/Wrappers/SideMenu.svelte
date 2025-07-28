<script>
	export let isOpen;
	export let title;
</script>

<div class="menu-panel" class:open={isOpen}>
	<div class="menu-header">
		{#if title}
			<h2 class="menu-title">{title}</h2>
		{/if}
	</div>
	<div class="menu-content">
		<ul class="menu-items">
			<slot />
		</ul>
	</div>
</div>

<style>
	.menu-panel {
		position: fixed;
		top: 0;
		right: 0;
		width: 36rem;
		height: 100vh;
		display: flex;
		flex-direction: column;
		transform: translateX(100%);
	}

	.menu-panel.open {
		transform: translateX(0);
	}

	.menu-header {
		padding: var(--spacing-lg) var(--spacing-xl) var(--spacing-md);
		border-bottom: 3px solid var(--accent);
	}

	.menu-content {
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		padding: var(--spacing-xl);
	}

	.menu-items {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.menu-panel {
		background: var(--bg);
		backdrop-filter: blur(16px);
		box-shadow: 0px 0 60px var(--shadow);
		border-left: 3px solid var(--accent);
		z-index: 1000;
	}

	.menu-title {
		color: var(--accent);
	}

	.menu-content {
		scrollbar-width: thin;
		scrollbar-color: var(--accent-light) transparent;
	}

	.menu-content::-webkit-scrollbar {
		width: 8px;
	}

	.menu-content::-webkit-scrollbar-thumb {
		background-color: var(--accent-light);
		border-radius: var(--radius-sm);
	}

	.menu-title {
		font-family: var(--font-family-accent);
		font-size: var(--font-size-xxl);
		font-weight: var(--font-weight-bold);
		line-height: var(--line-height-tight);
		letter-spacing: 1px;
	}

	.menu-panel {
		transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	.menu-header,
	.menu-title,
	.menu-content,
	.menu-items {
		user-select: none;
	}
</style>
