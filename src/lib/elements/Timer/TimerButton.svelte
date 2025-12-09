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
		background: var(--bg-overlay);
		color: var(--accent-light);
		backdrop-filter: blur(14px);
		cursor: pointer;
		user-select: none;
		font-family: var(--font-family-accent);
		font-size: 6rem;
		font-weight: var(--font-weight-bold);
		line-height: var(--line-height-tight);
		text-shadow: 0 0 8px var(--shadow);
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease,
			background 0.3s ease;
		box-sizing: border-box;
	}

	.timer:hover {
		background: var(--bg-overlay);
		transform: scale(1.08);
		box-shadow: 8px 8px 0 var(--accent-dark);
	}

	.timer:active {
		transform: scale(0.95);
		box-shadow: 2px 2px 0 var(--accent-dark);
	}

	@media (max-width: 768px) {
		.timer {
			padding: 1rem 2.5rem;
			font-size: 4rem;
			min-width: 6rem;
		}
	}

	@media (max-width: 480px) {
		.timer {
			padding: 0.8rem 2rem;
			font-size: 3rem;
			min-width: 5rem;
		}
	}

	@media (max-width: 360px) {
		.timer {
			padding: 0.6rem 1.5rem;
			font-size: 2.5rem;
			min-width: 4rem;
		}
	}
</style>
