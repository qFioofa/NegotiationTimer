<script>
	export let isOpen;
	export let title;
</script>

<div class="menu-panel {isOpen ? 'open' : ''}">
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
		right: -30rem;
		width: 30rem;
		height: 100vh;
		background: var(--bg);
		backdrop-filter: blur(16px);
		box-shadow: -6px 0 60px var(--shadow);
		transition: transform 0.5s ease;
		display: flex;
		flex-direction: column;
		transform: translateX(0);
		border-left: 1px solid var(--accent);
		z-index: 1000;
	}

	.menu-panel.open {
		transform: translateX(-30rem);
	}

	.menu-header {
		padding: 1.5rem 2rem 1rem;
		border-bottom: 1px solid var(--accent);
		user-select: none;
	}

	.menu-title {
		color: var(--accent);
		font-size: 2.4rem;
		font-weight: bold;
		color: var(--input-fg);
		letter-spacing: 1px;
		user-select: none;
	}

	.menu-content {
		flex: 1;
		overflow-y: auto;
		padding: 2rem;
		scrollbar-width: thin;
		scrollbar-color: var(--accent-light) transparent;
		user-select: none;
		z-index: 1001;
	}

	.menu-content::-webkit-scrollbar {
		width: 8px;
	}

	.menu-content::-webkit-scrollbar-thumb {
		background-color: var(--accent-light);
		border-radius: 6px;
	}

	.menu-items {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		user-select: none;
	}
</style>
