<script>
	import { tweened } from "svelte/motion";
	import { cubicOut } from "svelte/easing";
	import { onMount } from "svelte";
	import { parameters } from "$lib/stores/parameters";

	let isMenuOpen = false;
	const triggerOpacity = tweened(0, { duration: 150, easing: cubicOut });

	let triggerRef;

	function updateTriggerOpacity(e) {
		if (!triggerRef || isMenuOpen) return;

		const rect = triggerRef.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const horizontalDistance = Math.abs(e.clientX - centerX);
		const threshold = window.innerWidth * 0.25;

		if (horizontalDistance > threshold) {
			triggerOpacity.set(0);
		} else {
			const alpha = 1 - horizontalDistance / threshold;
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
	style="
		opacity: {$triggerOpacity};
		pointer-events: {$triggerOpacity > 0.05 ? 'auto' : 'none'};
	"
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
		opacity: 0.8;
		pointer-events: auto;
	}

	.menu-trigger {
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
		transition: opacity 0.25s ease;
		user-select: none;
		border-radius: 0 12px 12px 0;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: auto;
	}

	.menu-panel {
		position: fixed;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
		width: 30vw;
		max-width: 320px;
		height: 66vh;
		background: var(--bg);
		backdrop-filter: blur(25px);
		border-radius: 0 20px 20px 0;
		border: 3px solid var(--accent);
		box-shadow: 0 0px 50px var(--shadow);
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
		margin: 1.5rem;
		background: linear-gradient(45deg, var(--accent), var(--accent-light));
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		font-weight: bold;
	}
</style>
