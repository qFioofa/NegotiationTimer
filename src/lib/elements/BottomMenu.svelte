<script>
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';

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
		window.addEventListener('mousemove', updateTriggerOpacity);
		return () => {
			window.removeEventListener('mousemove', updateTriggerOpacity);
		};
	});
</script>

<div
	class="overlay"
	class:visible={isMenuOpen}
/>

<div
	bind:this={triggerRef}
	class="menu-trigger"
	on:mouseenter={handleTriggerEnter}
	on:mouseleave={handleTriggerLeave}
	style="opacity: {$triggerOpacity}"
>
	📂 Меню
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
	:global(body) {
		margin: 0;
	}

	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(6px);
		z-index: 998;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s;
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
		height: 36px;
		background: rgba(30, 30, 45, 0.95);
		backdrop-filter: blur(10px);
		color: white;
		font-weight: 600;
		text-align: center;
		line-height: 36px;
		cursor: pointer;
		z-index: 1001;
		box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.3);
		transition: opacity 0.2s ease;
		user-select: none;
		opacity: 0;
	}

	.menu-panel {
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 66vw;
		max-width: 600px;
		height: 33vh;
		background: rgba(30, 30, 45, 0.95);
		backdrop-filter: blur(20px);
		border-radius: 16px 16px 0 0;
		box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.5);
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
		color: white;
		font-size: 1.5rem;
		margin: 20px;
		text-align: center;
		background: linear-gradient(45deg, #ff6a00, #ee0979);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}
</style>
