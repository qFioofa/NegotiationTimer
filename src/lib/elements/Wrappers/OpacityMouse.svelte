<script>
	import { onMount } from "svelte";
	import { tweened } from "svelte/motion";
	import { cubicOut } from "svelte/easing";

	export let handleClick = () => {};
	export let handleTriggerEnter = () => {};
	export let handleTriggerLeave = () => {};

	export let isOpen = false;

	export let MouseDistance = 0.25;
	export let pointerEventsThreshold = 0.05;
	export let targetRef = null;
	export let zIndex = 3000;

	let wrapperRef;

	const triggerOpacity = tweened(0, {
		duration: 150,
		easing: cubicOut,
	});

	function updateTriggerOpacity(e) {
		if (isOpen) return;
		const ref = targetRef || wrapperRef;
		if (!ref) return;

		const rect = ref.getBoundingClientRect();
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;

		const dx = e.clientX - cx;
		const dy = e.clientY - cy;
		const distance = Math.hypot(dx, dy);
		const maxDistance = window.innerWidth * MouseDistance;

		const alpha = Math.max(0, 1 - distance / maxDistance);
		triggerOpacity.set(alpha);
	}

	onMount(() => {
		if (typeof window === "undefined") return;
		window.addEventListener("mousemove", updateTriggerOpacity);
		return () => window.removeEventListener("mousemove", updateTriggerOpacity);
	});
</script>

<button
	bind:this={wrapperRef}
	class="opacity-mouse-wrapper"
	on:mouseenter={handleTriggerEnter}
	on:mouseleave={handleTriggerLeave}
	on:click={handleClick}
	tabindex="0"
	style="
        opacity: {$triggerOpacity};
        pointer-events: {$triggerOpacity > pointerEventsThreshold ? 'auto' : 'none'};
        z-index: {zIndex};
    "
>
	<slot />
</button>

<style>
	/* === Компоновка / Расположение === */
	.opacity-mouse-wrapper {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		margin: 0;
		border: none;
		background: transparent;
		box-shadow: none;
		cursor: pointer;
		font-family: inherit;
		font-size: inherit;
		font-weight: inherit;
		line-height: inherit;
		letter-spacing: inherit;
		color: inherit;
		appearance: none;
		-webkit-appearance: none;
	}

	.opacity-mouse-wrapper {
		background: transparent;
		border: none;
		box-shadow: none;
	}

	.opacity-mouse-wrapper {
		transition: opacity 0.15s cubic-out;
	}

	.opacity-mouse-wrapper:hover:not(:disabled) {
		background-color: transparent;
		transform: none;
		box-shadow: none;
	}

	.opacity-mouse-wrapper:active:not(:disabled) {
		transform: none;
		box-shadow: none;
		transition: none;
	}

	.opacity-mouse-wrapper:disabled {
		background-color: transparent;
		color: inherit;
		cursor: pointer;
		transform: none;
		box-shadow: none;
	}

	.opacity-mouse-wrapper:focus {
		outline: none;
		outline-offset: 0;
	}

	.opacity-mouse-wrapper::before,
	.opacity-mouse-wrapper::after {
		content: none;
		display: none;
	}
</style>
