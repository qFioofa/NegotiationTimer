<script>
	export let text = "";
	export let ref;
</script>

<div bind:this={ref} class="panel-trigger">{text}</div>

<style>
	.panel-trigger {
		position: fixed;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
		width: 42px;
		height: 30vh;
		background: var(--bg);
		backdrop-filter: blur(14px);
		color: var(--accent-light);
		border: 1px solid var(--accent);
		font-weight: 600;
		text-align: center;
		writing-mode: vertical-rl;
		text-orientation: mixed;
		cursor: pointer;
		z-index: 1001;
		box-shadow: 4px 0 12px var(--shadow);
		transition: all 0.15s ease;
		user-select: none;
		border-radius: 0 12px 12px 0;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: auto;
		overflow: hidden;
	}

	.panel-trigger:active {
		transform: translateY(-50%) translateX(-10px);
		box-shadow: 2px 0 6px var(--shadow);
		text-shadow: 0 0 2px currentColor;
	}
</style>
