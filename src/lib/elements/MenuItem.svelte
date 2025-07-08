<script>
	export let icon;
	export let text;
	export let badge = null;

	let isClicked = false;

	function handleClick() {
		isClicked = true;
		setTimeout(() => (isClicked = false), 300);
	}
</script>

<li class="menu-item" on:mouseenter on:click={handleClick} class:clicked={isClicked}>
	<div class="item-icon">{icon}</div>
	<div class="item-text">{text}</div>
	{#if badge}
		<div class="item-badge">{badge}</div>
	{/if}
</li>

<style>
	.menu-item {
		padding: 20px;
		margin: 12px 0;
		background: var(--bg);
		border-radius: 14px;
		border: 1px solid var(--accent);
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		position: relative;
	}

	.menu-item:hover {
		transform: translateX(10px);
		box-shadow: 0 0 20px var(--shadow);
	}

	.menu-item.clicked {
		box-shadow: 0 0 30px var(--shadow);
	}

	.item-icon {
		font-size: 2rem;
		margin-right: 1.5rem;
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--input-bg);
		border-radius: 50%;
	}

	.item-text {
		font-size: 1.6rem;
		color: var(--fg);
		flex: 1;
		font-weight: 500;
	}

	.item-badge {
		background: var(--accent);
		color: var(--input-bg);
		font-weight: bold;
		padding: 6px 12px;
		border-radius: 999px;
		font-size: 1.2rem;
	}
</style>
