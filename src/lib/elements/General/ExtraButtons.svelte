<script>
	export let icon;
	export let onClick = () => {};
</script>

{#if icon}
	<button class="item-icon" on:click={onClick}>{icon}</button>
{/if}

<style>
	.item-icon {
		font-size: 2rem;
		width: 68px;
		height: 68px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.item-icon {
		background: var(--bg-overlay);
		border-radius: var(--spacing-extra);
		border: 2px solid var(--accent);
		box-shadow: 2px 2px 0 var(--accent-dark);
		text-align: center;
	}

	.item-icon {
		font-size: var(--font-size-xl);
	}

	.item-icon {
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease,
			background 0.3s ease;
	}

	.item-icon:hover {
		background: var(--bg-overlay);
		transform: scale(1.08);
	}

	.item-icon:active {
		transform: scale(0.95);
	}
</style>
