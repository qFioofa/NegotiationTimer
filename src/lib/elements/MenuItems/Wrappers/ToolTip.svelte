<script>
	let { tooltipText } = $props();

	let iconEl = $state(null);
	let tipEl = $state(null);
	let visible = $state(false);
	let ready = $state(false);
	let style = $state("");

	// Render the tooltip on <body> so it escapes the menu's scroll container
	// (overflow) and the panel's transform — both of which otherwise clip it.
	function portal(node) {
		document.body.appendChild(node);
		return { destroy: () => node.remove() };
	}

	// Position relative to the icon, in viewport coords. Default above & centered,
	// flip below if it would clip the top, clamp into the viewport on both axes.
	function place() {
		if (!iconEl || !tipEl) return;
		const r = iconEl.getBoundingClientRect();
		const t = tipEl.getBoundingClientRect();
		const m = 8;

		let top = r.top - t.height - m;
		if (top < m) top = r.bottom + m;
		top = Math.max(m, Math.min(top, window.innerHeight - t.height - m));

		let left = r.left + r.width / 2 - t.width / 2;
		left = Math.max(m, Math.min(left, window.innerWidth - t.width - m));

		style = `top: ${top}px; left: ${left}px;`;
	}

	const show = () => (visible = true);
	const hide = () => (visible = false);

	$effect(() => {
		if (visible && tipEl) {
			place();
			ready = true;
		} else {
			ready = false;
		}
	});
</script>

{#if tooltipText}
	<span
		class="info-icon"
		bind:this={iconEl}
		tabindex="0"
		role="button"
		aria-label="Показать подсказку"
		onmouseenter={show}
		onmouseleave={hide}
		onfocus={show}
		onblur={hide}>?</span
	>

	{#if visible}
		<div
			class="tooltip"
			class:ready
			bind:this={tipEl}
			use:portal
			role="tooltip"
			{style}
		>
			{tooltipText}
		</div>
	{/if}
{/if}

<style>
	.info-icon {
		width: 18px;
		height: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: var(--accent);
		color: var(--input-bg);
		box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
		cursor: help;
		font-family: var(--font-family-base);
		font-size: 1rem;
		font-weight: var(--font-weight-bold);
		line-height: 1;
	}

	.tooltip {
		position: fixed;
		max-width: 320px;
		padding: var(--spacing-xs) var(--spacing-sm);
		border-radius: var(--radius-sm);
		text-align: center;
		white-space: normal;
		background: var(--tooltip-bg, #222);
		color: var(--tooltip-fg, #fff);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		font-family: var(--font-family-base);
		font-size: 1.1rem;
		font-weight: var(--font-weight-normal);
		line-height: var(--line-height-base);
		pointer-events: none;
		/* above menu/pause/blackout panels so it is never hidden behind UI */
		z-index: 4000;
		opacity: 0;
		transform: translateY(4px);
		transition:
			opacity 0.2s ease,
			transform 0.2s ease;
	}

	.tooltip.ready {
		opacity: 1;
		transform: translateY(0);
	}

	@media (prefers-reduced-motion: reduce) {
		.tooltip,
		.tooltip.ready {
			transform: none;
			transition: opacity 0.15s ease;
		}
	}
</style>
