<script>
	import { GlobalConfig, isPanelOpen } from "$lib/stores/parameters";
	import BottomMenuAdjust from "./BottomMenuItems/BottomMenuAdjust.svelte";
	import BottomMenuInput from "./BottomMenuItems/BottomMenuInput.svelte";
	import BottomMenuTrigger from "./BottomMenu/BottomMenuTrigger.svelte";
	import { timeAdd, timeSubtract, toMs } from "$lib/stores/timerDown";
	import BottomMenuPanel from "./BottomMenu/BottomMenuPanel.svelte";
	import { mmssToSeconds } from "$lib/components/utils/TimerUtils";
	import OpacityMouse from "./Wrappers/OpacityMouse.svelte";
	import Pause from "./Pause.svelte";

	let isTriggerHovered = false;

	let triggerRef;

	function handleClick() {
		if (!GlobalConfig.get("panelAutoOpen")) {
			$isPanelOpen = !$isPanelOpen;
		}
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

<BottomMenuPanel
	title="Панель"
	bind:isMenuOpen={$isPanelOpen}
	bind:isTriggerHovered
>
	<BottomMenuInput
		icon="🕒"
		title="Установить конкретное время"
		description="Время на таймере заменится на введённое"
		value={GlobalConfig.get("setTime")}
		placeHolder="MM:SS"
		maxLength="5"
		onApply={(val) => {
			const seconds = mmssToSeconds(val);
			timeSubtract(toMs());
			timeAdd(seconds);
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
		onIncrement={(val) => {
			const seconds = mmssToSeconds(val);
			timeAdd(seconds);
			GlobalConfig.set("timeAddSubStep", val);
		}}
		onDecrement={(val) => {
			const seconds = mmssToSeconds(val);
			timeSubtract(seconds);
			GlobalConfig.set("timeAddSubStep", val);
		}}
	/>
</BottomMenuPanel>
