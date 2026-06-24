<script>
	import { GlobalConfig, isPanelOpen } from "$lib/stores/parameters";
	import BottomMenuAdjust from "./BottomMenuItems/BottomMenuAdjust.svelte";
	import BottomMenuInput from "./BottomMenuItems/BottomMenuInput.svelte";
	import { timeAdd, timeSubtract, toMs } from "$lib/stores/timerDown";
	import { mmssToSeconds } from "$lib/components/utils/TimerUtils";
	import { setPause } from "$lib/components/Pause";
	import Pause from "./Pause.svelte";

	let triggerRef = $state();

	function toggle() {
		$isPanelOpen = !$isPanelOpen;
		if (GlobalConfig.get("panelAutoPause")) setPause($isPanelOpen);
	}
</script>

<Pause />

<button
	bind:this={triggerRef}
	class="panel-trigger"
	class:active={$isPanelOpen}
	aria-label="Время"
	aria-haspopup="true"
	aria-expanded={$isPanelOpen}
	onclick={toggle}
>
	🕒
</button>

<div class="panel-plate" class:open={$isPanelOpen} role="menu" aria-orientation="vertical">
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
</div>

<style>
	/* Иконка-близнец кнопки настроек (SettingsTrigger), слева от шестерёнки. */
	.panel-trigger {
		position: fixed;
		top: 1.5rem;
		right: 6.25rem;
		z-index: 1001;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 4rem;
		height: 4rem;
		padding: 0;
		border-radius: var(--radius-xxl);
		border: 2px solid var(--accent);
		box-shadow: 4px 4px 0 var(--accent-dark);
		background: var(--bg-overlay);
		color: var(--accent-light);
		backdrop-filter: blur(14px);
		cursor: pointer;
		user-select: none;
		font-size: 2rem;
		line-height: 1;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease,
			background 0.3s ease;
	}

	.panel-trigger:hover {
		transform: scale(1.08);
		box-shadow: 6px 6px 0 var(--accent-dark);
	}

	.panel-trigger:active,
	.panel-trigger.active {
		transform: scale(0.95);
		box-shadow: 2px 2px 0 var(--accent-dark);
	}

	/* Плашка с управлением временем — выпадает под иконками, справа. */
	.panel-plate {
		position: fixed;
		top: 6rem;
		right: 1.5rem;
		z-index: 1000;
		width: min(360px, calc(100vw - 3rem));
		max-height: calc(100vh - 7.5rem);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
		box-sizing: border-box;
		overflow-y: auto;
		overflow-x: hidden;
		scrollbar-width: none;
		background: var(--bg);
		backdrop-filter: blur(25px);
		border: 3px solid var(--accent);
		border-radius: 20px;
		box-shadow: 0 0 50px var(--shadow);
		opacity: 0;
		transform: translateY(-0.5rem);
		pointer-events: none;
		transition:
			opacity 0.25s ease,
			transform 0.25s ease;
	}

	.panel-plate::-webkit-scrollbar {
		display: none;
	}

	.panel-plate.open {
		opacity: 1;
		transform: translateY(0);
		pointer-events: auto;
	}

	@media (max-width: 480px) {
		.panel-trigger {
			top: 1rem;
			right: 4.8rem;
			width: 3.2rem;
			height: 3.2rem;
			font-size: 1.6rem;
		}

		.panel-plate {
			top: 5rem;
			right: 1rem;
			width: min(360px, calc(100vw - 2rem));
			max-height: calc(100vh - 6rem);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.panel-trigger,
		.panel-plate {
			transition: opacity 0.1s ease;
		}
	}
</style>
