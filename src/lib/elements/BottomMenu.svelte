<script>
	import { onMount } from "svelte";
	import { tweened } from "svelte/motion";
	import { cubicOut } from "svelte/easing";
	import { isPaused, setPause, togglePause } from "$lib/components/Pause";
	import Pause from "./Pause.svelte";
	import BottomMenuItem from "./BottomMenuItem.svelte";
	import { parameters, timeAdd, timeSubtract, toMs, GlobalConfig } from "$lib/stores/parameters";

	let isMenuOpen = false;
	let isTriggerHovered = false;
	let isPanelHovered = false;

	const triggerOpacity = tweened(0, { duration: 150, easing: cubicOut });
	let triggerRef;

	function mmssToMs(str) {
		const parts = str.split(":");
		if (parts.length !== 2) return 0;
		const mm = parseInt(parts[0], 10);
		const ss = parseInt(parts[1], 10);
		if (isNaN(mm) || isNaN(ss)) return 0;
		return mm * 60 + ss;
	}

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

	function handleClick() {
		if (!GlobalConfig.get("panelAutoOpen")) {
			isMenuOpen = !isMenuOpen;
			if (GlobalConfig.get("panelAutoPause")) setPause(isMenuOpen);
		} else {
			isMenuOpen = true;
		}
		triggerOpacity.set(1);
	}

	function handleTriggerEnter() {
		isTriggerHovered = true;
		triggerOpacity.set(1);
		if (GlobalConfig.get("panelAutoOpen")) {
			isMenuOpen = true;
			if (GlobalConfig.get("panelAutoPause")) setPause(true);
		}
	}

	function handleTriggerLeave() {
		isTriggerHovered = false;
		setTimeout(checkHoverState, 50);
	}

	function handlePanelEnter() {
		isPanelHovered = true;
	}

	function handlePanelLeave() {
		isPanelHovered = false;
		setTimeout(checkHoverState, 50);
	}

	function checkHoverState() {
		if (!isTriggerHovered && !isPanelHovered && GlobalConfig.get("panelAutoOpen")) {
			isMenuOpen = false;
			if (GlobalConfig.get("panelAutoPause")) setPause(false);
		}
	}

	function handleShuffle() {
		const { ShufflePlayers } = $parameters;
		if (ShufflePlayers) ShufflePlayers();
	}

	onMount(() => {
		window.addEventListener("mousemove", updateTriggerOpacity);
		return () => {
			window.removeEventListener("mousemove", updateTriggerOpacity);
		};
	});
</script>

<Pause />

<button
	bind:this={triggerRef}
	class="menu-trigger"
	tabindex="0"
	on:mouseenter={handleTriggerEnter}
	on:mouseleave={handleTriggerLeave}
	on:focus={handleTriggerEnter}
	on:blur={handleTriggerLeave}
	on:click={handleClick}
	style="
        opacity: {$triggerOpacity};
        pointer-events: {$triggerOpacity > 0.05 ? 'auto' : 'none'};
    "
>
	Меню
</button>

<div
	class="menu-panel"
	class:open={isMenuOpen}
	role="menu"
	aria-orientation="vertical"
	aria-labelledby="panel-title"
	tabindex="-1"
	on:mouseenter={handlePanelEnter}
	on:mouseleave={handlePanelLeave}
>
	<div class="scroll-wrapper">
		<h2 id="panel-title" class="panel-title">Панель</h2>

		<BottomMenuItem
			title="Сделать жеребьевку"
			description="Назначьте клавишу для перемешивания"
			type="bind"
			configKey="shuffleKey"
			onApply={handleShuffle}
			onBindTrigger={handleShuffle}
			icon="🔀"
			role="menuitem"
		/>

		<BottomMenuItem
			icon="🕒"
			role="menuitem"
			title="Установить конкретное время"
			description="Время на таймере заменится на введённое"
			type="input"
			value={GlobalConfig.get("setTime")}
			onApply={val => {
				const ms = mmssToMs(val);
				timeSubtract(toMs());
				timeAdd(ms);
			}}
		/>

		<BottomMenuItem
			icon="🕒"
			role="menuitem"
			title="Добавить/убавить время"
			description="Нажимайте + или − для изменения"
			type="adjust"
			value={GlobalConfig.get("timeAddSubStep")}
			onIncrement={val => {
				const ms = mmssToMs(val);
				timeAdd(ms);
			}}
			onDecrement={val => {
				const ms = mmssToMs(val);
				timeSubtract(ms);
			}}
		/>

		<BottomMenuItem
			title="Пауза"
			description="Назначьте клавишу для паузы"
			type="bind"
			configKey="pauseKey"
			onApply={togglePause}
			onBindTrigger={togglePause}
			icon="⏸️"
			role="menuitem"
		/>
	</div>
</div>

<style>
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
