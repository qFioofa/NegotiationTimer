<script>
	import { tweened } from "svelte/motion";
	import { cubicOut } from "svelte/easing";
	import { onMount } from "svelte";
	import { isPaused, setPause } from "$lib/components/Pause";
	import Pause from "./Pause.svelte";
	import BottomMenuItem from "./BottomMenuItem.svelte";

	function dummyApply(val) {
		console.log("Применить:", val);
	}
	function dummyBind() {
		console.log("Ожидание ввода бинда...");
	}

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
		setPause(true);
		isMenuOpen = true;
		triggerOpacity.set(1);
	}

	function handleTriggerLeave() {
		setPause(false);
		isMenuOpen = false;
	}

	onMount(() => {
		window.addEventListener("mousemove", updateTriggerOpacity);
		return () => {
			window.removeEventListener("mousemove", updateTriggerOpacity);
		};
	});
</script>

<Pause />

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
	<div class="scroll-wrapper">
		<h2 class="panel-title">Панель</h2>

		<BottomMenuItem
			title="Добавить/убавить время"
			description="Нажимайте + или − для изменения"
			type="adjust"
			value="00:30"
			onIncrease={() => dummyApply("+00:30")}
			onDecrease={() => dummyApply("-00:30")}
			icon="⏸️"
		/>

		<BottomMenuItem
			title="Установить конкретное время"
			description="Время на таймере заменится на введённое"
			type="input"
			placeholder="02:00"
			value="02:00"
			onApply={dummyApply}
			icon="⏸️"
		/>

		<BottomMenuItem
			title="Сделать решафл"
			description="Назначьте клавишу для перемешивания"
			type="bind"
			bindKey="R"
			onBindSet={dummyBind}
			icon="⏸️"
		/>

		<BottomMenuItem
			title="Пауза"
			description="Назначьте клавишу для паузы"
			type="bind"
			bindKey="P"
			onBindSet={dummyBind}
			icon="⏸️"
		/>
	</div>
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
		max-width: 50vw;
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

	.scroll-wrapper {
		max-height: 100%;
		overflow-y: auto;
		padding-right: 8px;
		scrollbar-width: thin;
		scrollbar-color: var(--accent) transparent;
	}

	.scroll-wrapper::-webkit-scrollbar {
		width: 6px;
	}

	.scroll-wrapper::-webkit-scrollbar-thumb {
		background-color: var(--accent);
		border-radius: 4px;
	}

	.scroll-wrapper::-webkit-scrollbar-track {
		background: transparent;
	}

	.panel-title {
		font-size: 4rem;
		text-align: left;
		margin: 2rem;
		background: linear-gradient(45deg, var(--accent), var(--accent-light));
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		font-weight: bold;
		user-select: none;
	}
</style>
