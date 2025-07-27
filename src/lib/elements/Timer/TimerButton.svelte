<script>
	export let displayTime;
	export let onClick = () => {};
</script>

<button class="timer" on:click={onClick}>
	{displayTime}
</button>

<style>
	.timer {
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.6rem 4rem;
		border-radius: var(--spacing-extra);
		border: 2px solid var(--accent);
		box-shadow: 6px 6px 0 var(--accent-dark);
		text-align: center;
	}

	.timer {
		background: var(--bg-overlay);
		color: var(--accent-light);
		backdrop-filter: blur(14px);
		cursor: pointer;
		user-select: none;
	}

	.timer:hover {
		background: var(--bg-overlay);
	}

	.timer {
		font-size: 6rem;
		font-family: var(--font-family-simple);
		font-weight: var(--font-weight-bold);
		line-height: var(--line-height-tight);
		text-shadow: 0 0 8px var(--shadow);
	}

	.timer {
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease,
			background 0.3s ease;
	}

	.timer:hover {
		transform: scale(1.08);
	}

	.timer:active {
		transform: scale(0.95);
	}

	@media (max-width: 768px) {
		.timer {
			width: 12rem;
			height: 12rem;
			font-size: 3.2rem;
			padding: 1.2rem;
		}
	}
</style>
