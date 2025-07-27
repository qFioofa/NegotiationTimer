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
		isolation: isolate;
	}

	.info-icon {
		width: 18px;
		height: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		position: relative;
		z-index: 1;
	}

	.tooltip {
		position: absolute;
		bottom: 140%;
		left: 50%;
		transform: translateX(-50%);
		padding: var(--spacing-xs) var(--spacing-sm);
		border-radius: var(--radius-sm);
		max-width: 320px;
		text-align: center;
		white-space: normal;
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
		z-index: 2;
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

	.info-icon {
		background: var(--accent);
		color: var(--input-bg);
		box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
		cursor: help;
	}

	.tooltip {
		background: var(--tooltip-bg, #222);
		color: var(--tooltip-fg, #fff);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.info-icon {
		font-family: var(--font-family-base);
		font-size: 1rem;
		font-weight: var(--font-weight-bold);
		line-height: 1;
	}

	.tooltip {
		font-family: var(--font-family-base);
		font-size: 1.1rem;
		font-weight: var(--font-weight-normal);
		line-height: var(--line-height-base);
	}

	.tooltip {
		transition:
			opacity 0.2s ease,
			visibility 0.2s ease,
			transform 0.2s ease;
	}

	.tooltip-wrapper:hover .tooltip,
	.tooltip-wrapper:focus-within .tooltip {
		opacity: 1;
		visibility: visible;
		transform: translateX(-50%) translateY(-4px);
	}
</style>
