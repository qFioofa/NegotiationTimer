<script>
	export let tooltipText;
</script>

{#if tooltipText}
	<div class="tooltip-wrapper">
		<span class="info-icon" tabindex="0" role="button" aria-label="Показать подсказку">?</span>
		<div class="tooltip" role="tooltip">{tooltipText}</div>
	</div>
{/if}

<style>
	.tooltip-wrapper {
		position: relative;
		display: inline-block;
	}

	.info-icon {
		font-size: 1rem;
		background: var(--accent);
		color: var(--input-bg);
		border-radius: 50%;
		width: 18px;
		height: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: help;
		position: relative;
		z-index: 1;
		box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
	}

	.tooltip {
		opacity: 0;
		visibility: hidden;
		position: absolute;
		bottom: 140%;
		left: 50%;
		transform: translateX(-50%);
		background: var(--tooltip-bg, #222);
		color: var(--tooltip-fg, #fff);
		padding: 6px 10px;
		border-radius: 8px;
		font-size: 1.1rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		transition:
			opacity 0.2s ease,
			transform 0.2s ease;
		z-index: 9999;
		max-width: 320px;
		text-align: center;
		pointer-events: none;
		white-space: normal;
	}

	.tooltip::after {
		content: "";
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		border-width: 6px;
		border-style: solid;
		border-color: var(--tooltip-bg, #222) transparent transparent transparent;
	}

	.tooltip-wrapper:hover .tooltip,
	.tooltip-wrapper:focus-within .tooltip {
		opacity: 1;
		visibility: visible;
		transform: translateX(-50%) translateY(-4px);
	}
</style>
