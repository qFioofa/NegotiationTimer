<script>
	export let visible = true;
</script>

<div class="pause-overlay" class:active={visible}>
	{#if visible}
		<div class="pause-content">
			<h1 class="pause-title">ПАУЗА</h1>
		</div>
	{/if}
</div>

<style>
	.pause-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(10px);
		display: none;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		z-index: 999;
		transition: opacity 0.3s ease;
		opacity: 0;
		pointer-events: none;
	}

	.pause-overlay.active {
		display: flex;
		opacity: 1;
		pointer-events: auto;
	}

	.pause-content {
		text-align: center;
		color: var(--accent-light);
	}

	.pause-title {
		font-size: 4rem;
		font-weight: 700;
		text-shadow: 0 0 20px var(--accent);
		margin-bottom: 2rem;
	}
</style>
