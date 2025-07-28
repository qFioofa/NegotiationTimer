<script>
	import RollingCounter from "./RollingCounter.svelte";

	export let displayTime;
	export let onClick = () => {};
</script>

<button class="timer" on:click={onClick}>
	<RollingCounter value={displayTime} />
</button>

<style>
	.timer {
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.6rem 4rem;
		border-radius: var(--radius-xxl);
		border: 2px solid var(--accent);
		box-shadow: 6px 6px 0 var(--accent-dark);
		text-align: center;
		min-width: 8rem;
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
		font-family: var(--font-family-accent);
		font-size: 6rem;
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
		box-shadow: 8px 8px 0 var(--accent-dark);
	}

	.timer:active {
		transform: scale(0.95);
		box-shadow: 2px 2px 0 var(--accent-dark);
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
