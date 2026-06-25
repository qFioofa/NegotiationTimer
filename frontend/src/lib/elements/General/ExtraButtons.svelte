<script>
	let { icon, image, tooltip, onClick = () => {} } = $props();

	let wrapperEl = $state(null);
	let hintEl = $state(null);
	let placement = $state("top right"); // default: сверху-справа

	// Pick a placement that fits the viewport. Default top-right, flip the axis
	// that would clip. Measured on hover/focus — hint keeps its layout size even
	// while hidden (visibility: hidden), so the rect is accurate.
	function place() {
		if (!wrapperEl || !hintEl) return;
		const b = wrapperEl.getBoundingClientRect();
		const w = hintEl.offsetWidth;
		const h = hintEl.offsetHeight;
		const m = 8;

		const vertical = b.top - h - m < 0 ? "bottom" : "top";
		const horizontal =
			b.left + b.width / 2 + w > window.innerWidth - m ? "left" : "right";

		placement = `${vertical} ${horizontal}`;
	}
</script>

{#if icon || image}
	<div class="extra-button" bind:this={wrapperEl}>
		<button
			class="item-icon"
			onclick={onClick}
			onmouseenter={place}
			onfocus={place}
			aria-label={tooltip}
		>
			{#if image}
				<img class="item-image" src={image} alt={tooltip ?? ""} />
			{:else}
				{@const Icon = icon}
				<Icon size={30} />
			{/if}
		</button>

		{#if tooltip}
			<span class="hint {placement}" bind:this={hintEl} role="tooltip">
				{tooltip}
			</span>
		{/if}
	</div>
{/if}

<style>
	.extra-button {
		position: relative;
		display: inline-flex;
	}

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
		color: var(--accent-light);
		text-align: center;
	}

	.item-icon {
		font-size: var(--font-size-xl);
	}

	.item-image {
		width: 60%;
		height: 60%;
		object-fit: contain;
		display: block;
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

	/* Hover hint — accent language of .item-icon / .timer, fades + slides in */
	.hint {
		position: absolute;
		padding: 0.5rem 0.9rem;
		white-space: nowrap;
		background: var(--bg-overlay);
		color: var(--accent-light);
		border: 2px solid var(--accent);
		border-radius: var(--spacing-extra);
		box-shadow: 2px 2px 0 var(--accent-dark);
		backdrop-filter: blur(14px);
		font-family: var(--font-family-base);
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-bold);
		line-height: var(--line-height-base);
		letter-spacing: var(--letter-spacing-normal);
		text-shadow: 0 0 8px var(--shadow);
		z-index: 20;
		user-select: none;
		pointer-events: none;
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 0.2s ease,
			transform 0.2s ease,
			visibility 0.2s ease;
	}

	/* vertical side (+ hidden-state slide offset toward the button) */
	.hint.top {
		bottom: calc(100% + 8px);
		transform: translateY(6px);
	}
	.hint.bottom {
		top: calc(100% + 8px);
		transform: translateY(-6px);
	}

	/* horizontal extension from the button's centre */
	.hint.right {
		left: 50%;
	}
	.hint.left {
		right: 50%;
	}

	.extra-button:hover .hint,
	.extra-button:focus-within .hint {
		opacity: 1;
		visibility: visible;
		transform: translateY(0);
	}

	@media (prefers-reduced-motion: reduce) {
		.hint,
		.hint.top,
		.hint.bottom {
			transform: none;
			transition:
				opacity 0.15s ease,
				visibility 0.15s ease;
		}
		.extra-button:hover .hint,
		.extra-button:focus-within .hint {
			transform: none;
		}
	}
</style>
