<script>
	import { onMount } from "svelte";
	import { tweened } from "svelte/motion";
	import { cubicOut } from "svelte/easing";
	import MenuItem from "./MenuItem.svelte";

	let menuOpen = false;
	let opacity = tweened(0, { duration: 50, easing: cubicOut });
	let menuBtn;

	const items = [
		{
			icon: "🖥",
			title: "Черный экран",
			tooltipText: "При завершении времени появляется черный экран о завершении",
			isToggled: true,
			onToggle: val => console.log(`{this}`, val),
		},
		{
			icon: "🛠",
			title: "Выдвигать панель",
			tooltipText: "Автоматически выдвигать панель, когда мышка внизу экрана",
			isToggled: true,
			onToggle: val => console.log("Тоггл настроек:", val),
		},
		{
			icon: "⏸️",
			title: "Автопауза",
			tooltipText: "Автоматически ставить на паузу, когда панель открыта",
			isToggled: true,
			onToggle: val => console.log("Тоггл настроек:", val),
		},
		{
			icon: "🎨",
			title: "Тема",
			tooltipText: "Выберите визуальную тему",
			options: ["green", "brown", "red", "blue", "cyan", "pink", "grey"],
			selectedOption: "green",
			onOptionSelect: opt => console.log("Выбрана тема:", opt),
		},
	];

	onMount(() => {
		if (typeof window === "undefined") return;

		const onMouseMove = e => {
			if (!menuBtn) return;

			const rect = menuBtn.getBoundingClientRect();
			const dx = e.clientX - (rect.left + rect.width / 2);
			const dy = e.clientY - (rect.top + rect.height / 2);
			const dist = Math.hypot(dx, dy);
			const max = window.innerWidth / 4;
			const val = Math.max(0, 1 - dist / max);
			opacity.set(val);
		};

		document.addEventListener("mousemove", onMouseMove);
		return () => document.removeEventListener("mousemove", onMouseMove);
	});
</script>

<div class="menu-container">
	<button
		bind:this={menuBtn}
		class="menu-button {menuOpen ? 'menu-open' : ''}"
		style="opacity: {$opacity}"
		on:click={() => (menuOpen = !menuOpen)}
		aria-label={menuOpen ? "Close menu" : "Open menu"}
	>
		<div class="menu-line"></div>
		<div class="menu-line"></div>
		<div class="menu-line"></div>
	</button>
</div>

{#if menuOpen}
	<button
		class="overlay visible"
		on:click={() => (menuOpen = false)}
		aria-label="Close menu overlay"
	></button>
{/if}

<div class="menu-panel {menuOpen ? 'open' : ''}">
	<div class="menu-header">
		<h2 class="menu-title">Меню настроек</h2>
	</div>
	<div class="menu-content">
		<ul class="menu-items">
			{#each items as item}
				<MenuItem {...item} />
			{/each}
		</ul>
	</div>
</div>

<style>
	.menu-container {
		position: fixed;
		top: 2rem;
		right: 2rem;
		z-index: 1000;
	}

	.menu-button {
		width: 5rem;
		height: 5rem;
		border-radius: 50%;
		background: var(--bg);
		backdrop-filter: blur(12px);
		border: 2px solid var(--accent);
		box-shadow: 0 0 25px var(--shadow);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
		cursor: pointer;
	}

	.menu-button:hover {
		transform: scale(1.08);
		box-shadow: 0 0 35px var(--shadow);
	}

	.menu-line {
		width: 2.4rem;
		height: 0.25rem;
		background: var(--accent);
		margin: 0.3rem 0;
		border-radius: 3px;
		transition: all 0.3s ease;
	}

	.menu-open .menu-line:nth-child(1) {
		transform: translateY(0.6rem) rotate(45deg);
	}

	.menu-open .menu-line:nth-child(2) {
		opacity: 0;
	}

	.menu-open .menu-line:nth-child(3) {
		transform: translateY(-0.6rem) rotate(-45deg);
	}

	.overlay {
		position: fixed;
		inset: 0;
		background: var(--bg);
		backdrop-filter: blur(5px);
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 0.3s ease,
			visibility 0.3s ease;
		z-index: 900;
	}

	.overlay.visible {
		opacity: 0.8;
		visibility: visible;
	}

	.menu-panel {
		position: fixed;
		top: 0;
		right: -30rem;
		width: 30rem;
		height: 100vh;
		background: var(--bg);
		backdrop-filter: blur(16px);
		box-shadow: -6px 0 60px var(--shadow);
		transition: transform 0.5s ease;
		display: flex;
		flex-direction: column;
		z-index: 950;
		transform: translateX(0);
		border-left: 1px solid var(--accent);
	}

	.menu-panel.open {
		transform: translateX(-30rem);
	}

	.menu-header {
		padding: 1.5rem 2rem 1rem;
		border-bottom: 1px solid var(--accent);
		user-select: none;
	}

	.menu-title {
		color: var(--accent);
		font-size: 2.4rem;
		font-weight: bold;
		color: var(--input-fg);
		letter-spacing: 1px;
		user-select: none;
	}

	.menu-content {
		flex: 1;
		overflow-y: auto;
		padding: 2rem;
		scrollbar-width: thin;
		scrollbar-color: var(--accent-light) transparent;
		user-select: none;
	}

	.menu-content::-webkit-scrollbar {
		width: 8px;
	}

	.menu-content::-webkit-scrollbar-thumb {
		background-color: var(--accent-light);
		border-radius: 6px;
	}

	.menu-items {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		user-select: none;
	}
</style>
