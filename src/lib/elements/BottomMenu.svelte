<script>
	import { tweened } from "svelte/motion";
	import { cubicOut } from "svelte/easing";
	import { onMount } from "svelte";

	let isMenuOpen = false;
	const triggerOpacity = tweened(0, { duration: 150, easing: cubicOut });

	let triggerRef;

	function updateTriggerOpacity(e) {
		if (!triggerRef) return;

		const rect = triggerRef.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;

		const verticalDistance = Math.abs(e.clientY - centerY);
		const threshold = window.innerHeight * 0.25;

		if (verticalDistance > threshold) {
			triggerOpacity.set(0);
		} else {
			const alpha = 1 - verticalDistance / threshold;
			triggerOpacity.set(alpha);
		}
	}

	function handleTriggerEnter() {
		isMenuOpen = true;
		triggerOpacity.set(1);
	}

	function handleTriggerLeave() {
		isMenuOpen = false;
	}

	onMount(() => {
		window.addEventListener("mousemove", updateTriggerOpacity);
		return () => {
			window.removeEventListener("mousemove", updateTriggerOpacity);
		};
	});
</script>

<div class="overlay" class:visible={isMenuOpen} />

<div
	bind:this={triggerRef}
	class="menu-trigger"
	on:mouseenter={handleTriggerEnter}
	on:mouseleave={handleTriggerLeave}
	style="opacity: {$triggerOpacity}"
>
	Меню
</div>

<div
	class="menu-panel"
	class:open={isMenuOpen}
	on:mouseenter={handleTriggerEnter}
	on:mouseleave={handleTriggerLeave}
>
	<h2 class="panel-title">Панель</h2>
</div>

<style>
	.overlay {
		position: fixed;
		inset: 0;
		background: var(--bg);
		backdrop-filter: blur(8px);
		z-index: 998;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s ease;
	}
	.overlay.visible {
		opacity: 1;
		pointer-events: auto;
	}

	.menu-trigger {
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 66vw;
		max-width: 600px;
		height: 42px;
		background: var(--bg);
		backdrop-filter: blur(14px);
		color: var(--accent-light);
		font-weight: 600;
		text-align: center;
		line-height: 42px;
		cursor: pointer;
		z-index: 1001;
		box-shadow: 0 -4px 12px var(--shadow);
		transition: opacity 0.25s ease;
		user-select: none;
		border-radius: 12px 12px 0 0;
	}

	.menu-panel {
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 66vw;
		max-width: 600px;
		height: 33vh;
		background: var(--bg);
		backdrop-filter: blur(25px);
		border-radius: 20px 20px 0 0;
		border-top: 3px solid var(--accent);
		box-shadow: 0 -10px 50px var(--shadow);
		z-index: 1000;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s ease;
		overflow: hidden;
	}

	.menu-panel.open {
		opacity: 1;
		pointer-events: auto;
	}

	.panel-title {
		font-size: 1.8rem;
		text-align: center;
		margin: 1.5rem 0;
		background: linear-gradient(45deg, var(--accent), var(--accent-light));
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		font-weight: bold;
	}
</style>
