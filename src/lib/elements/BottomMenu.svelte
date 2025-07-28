<script>
	import { ShuffleFunction, GlobalConfig, isPanelOpen } from "$lib/stores/parameters";
	import BottomMenuAdjust from "./BottomMenuItems/BottomMenuAdjust.svelte";
	import BottomMenuInput from "./BottomMenuItems/BottomMenuInput.svelte";
	import BottomMenuTrigger from "./BottomMenu/BottomMenuTrigger.svelte";
	import BottomMenuBind from "./BottomMenuItems/BottomMenuBind.svelte";
	import { timeAdd, timeSubtract, toMs } from "$lib/stores/timerDown";
	import BottomMenuPanel from "./BottomMenu/BottomMenuPanel.svelte";
	import { mmssToMs } from "$lib/components/utils/TimerUtils";
	import OpacityMouse from "./Wrappers/OpacityMouse.svelte";
	import { togglePause } from "$lib/components/Pause";
	import { toggleTimer } from "$lib/stores/timerDown";
	import { toggleUpTimer } from "$lib/stores/timerUp";
	import { isPaused } from "$lib/components/Pause";
	import Pause from "./Pause.svelte";
	import { get } from "svelte/store";

	let isTriggerHovered = false;

	let triggerRef;

	function handleClick() {
		if (!GlobalConfig.get("panelAutoOpen")) {
			$isPanelOpen = !$isPanelOpen;
		}
	}

	async function handleShuffle() {
		const ShufflePlayers = await $ShuffleFunction;
		if (ShufflePlayers) await ShufflePlayers();
	}

	function anyTimerToggle() {
		if ($isPaused) {
			toggleUpTimer();
			return;
		}
		toggleTimer();
	}
</script>

<Pause />

<OpacityMouse
	bind:isOpen={$isPanelOpen}
	handleTriggerEnter={() => {
		isTriggerHovered = true;
	}}
	handleTriggerLeave={() => {
		isTriggerHovered = false;
	}}
	{handleClick}
	targetRef={triggerRef}
>
	<BottomMenuTrigger bind:ref={triggerRef} text="Панель" />
</OpacityMouse>

<BottomMenuPanel title="Панель" bind:isMenuOpen={$isPanelOpen} bind:isTriggerHovered>
	<BottomMenuBind
		icon="🔀"
		title="Сделать жеребьевку"
		description="Назначьте клавишу для перемешивания"
		configKey="shuffleKey"
		bindKey={GlobalConfig.get("shuffleKey")}
		onApply={handleShuffle}
		onBindTrigger={handleShuffle}
	/>

	<BottomMenuInput
		icon="🕒"
		title="Установить конкретное время"
		description="Время на таймере заменится на введённое"
		value={GlobalConfig.get("setTime")}
		placeHolder="MM:SS"
		maxLength="5"
		onApply={val => {
			const ms = mmssToMs(val);
			timeSubtract(toMs());
			timeAdd(ms);
			GlobalConfig.set("setTime", val);
		}}
	/>

	<BottomMenuAdjust
		icon="🕒"
		title="Добавить/убавить время"
		description="Нажимайте + или − для добавления/уменьшения времени"
		value={GlobalConfig.get("timeAddSubStep")}
		placeHolder="MM:SS"
		maxLength="5"
		onIncrement={val => {
			const ms = mmssToMs(val);
			timeAdd(ms);
			GlobalConfig.set("timeAddSubStep", val);
		}}
		onDecrement={val => {
			const ms = mmssToMs(val);
			timeSubtract(ms);
			GlobalConfig.set("timeAddSubStep", val);
		}}
	/>

	<BottomMenuBind
		icon="⏸️"
		title="Пауза"
		description="Назначьте клавишу для паузы"
		configKey="pauseKey"
		bindKey={GlobalConfig.get("pauseKey")}
		onApply={togglePause}
		onBindTrigger={togglePause}
	/>

	<BottomMenuBind
		icon="▶️"
		title="Включить таймер"
		description="Назначьте клавишу для включения любого таймера"
		configKey="toggleTimer"
		bindKey={GlobalConfig.get("toggleTimer")}
		onApply={anyTimerToggle}
		onBindTrigger={anyTimerToggle}
	/>
</BottomMenuPanel>
