<script>
	import { GlobalConfig, isPanelOpen } from "$lib/stores/parameters";
	import BottomMenuAdjust from "./BottomMenuItems/BottomMenuAdjust.svelte";
	import BottomMenuInput from "./BottomMenuItems/BottomMenuInput.svelte";
	import { timeAdd, timeSubtract, toMs, timeMs } from "$lib/stores/timerDown";
	import { mmssToSeconds, timerDisplay } from "$lib/components/utils/TimerUtils";
	import { setPause } from "$lib/components/Pause";
	import { Clock } from "lucide-svelte";
	import Pause from "./Pause.svelte";

	let triggerRef = $state();
	let plateRef = $state();

	// Быстрые пресеты ±времени — самое частое действие во время сессии.
	const presets = [
		{ label: "−5:00", sec: -300 },
		{ label: "−1:00", sec: -60 },
		{ label: "−0:05", sec: -5 },
		{ label: "+0:05", sec: 5 },
		{ label: "+1:00", sec: 60 },
		{ label: "+5:00", sec: 300 },
	];

	function applyPreset(sec) {
		if (sec >= 0) timeAdd(sec);
		else timeSubtract(-sec);
	}

	function setOpen(open) {
		$isPanelOpen = open;
		if (GlobalConfig.get("panelAutoPause")) setPause(open);
	}

	function toggle() {
		setOpen(!$isPanelOpen);
	}

	// Esc и клик вне плашки/иконки закрывают её (как у модалки настроек).
	function onKeydown(e) {
		if ($isPanelOpen && e.key === "Escape") setOpen(false);
	}

	function onPointerDown(e) {
		if (!$isPanelOpen) return;
		if (plateRef?.contains(e.target) || triggerRef?.contains(e.target))
			return;
		setOpen(false);
	}
</script>

<svelte:window onkeydown={onKeydown} onpointerdown={onPointerDown} />

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
	<Clock size={28} />
</button>

<div
	bind:this={plateRef}
	class="panel-plate"
	class:open={$isPanelOpen}
	inert={!$isPanelOpen}
	role="menu"
	aria-orientation="vertical"
>
	<div class="plate-body">
		<div class="presets" role="group" aria-label="Быстрое изменение времени">
			{#each presets as p}
				<button class="chip" onclick={() => applyPreset(p.sec)}>
					{p.label}
				</button>
			{/each}
		</div>

		<BottomMenuInput
			icon={Clock}
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
			icon={Clock}
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

		<div class="current-time" aria-live="polite">
			<span class="current-time-label">На таймере сейчас</span>
			<span class="current-time-value">{timerDisplay($timeMs)}</span>
		</div>
	</div>
</div>

<style>
	/* Иконка-близнец кнопки настроек, слева от шестерёнки. Позиция и размер —
	   из общих --trigger-* (см. global.css), чтобы не было магических чисел. */
	.panel-trigger {
		position: fixed;
		top: var(--trigger-edge);
		right: calc(
			var(--trigger-edge) + var(--trigger-size) + var(--trigger-gap)
		);
		z-index: 1001;
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--trigger-size);
		height: var(--trigger-size);
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

	.panel-trigger:active {
		transform: scale(0.95);
		box-shadow: 2px 2px 0 var(--accent-dark);
	}

	/* Открыто: иконка подсвечена — визуально «принадлежит» плашке. */
	.panel-trigger.active {
		background: var(--accent);
		box-shadow:
			0 0 18px var(--accent),
			4px 4px 0 var(--accent-dark);
	}

	/* Плашка с управлением временем — выпадает под иконками, справа.
	   Геометрия считается из --trigger-*, поэтому адаптив без отдельных медиа. */
	.panel-plate {
		position: fixed;
		top: calc(var(--trigger-edge) + var(--trigger-size) + 0.5rem);
		right: var(--trigger-edge);
		z-index: 1000;
		width: min(460px, calc(100vw - 2 * var(--trigger-edge)));
		box-sizing: border-box;
		padding: 1.5rem;
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

	/* «Хвостик» от плашки к центру иконки-часам — смещение считается из --trigger-*. */
	.panel-plate::before {
		content: "";
		position: absolute;
		top: -8px;
		right: calc(
			var(--trigger-size) + var(--trigger-gap) + var(--trigger-size) / 2 -
				7px
		);
		width: 14px;
		height: 14px;
		background: var(--bg);
		border-left: 3px solid var(--accent);
		border-top: 3px solid var(--accent);
		transform: rotate(45deg);
	}

	/* Скролл — на внутреннем теле, чтобы не обрезать хвостик у плашки. */
	.plate-body {
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
		max-height: calc(
			100vh - 2 * var(--trigger-edge) - var(--trigger-size) - 0.5rem
		);
		overflow-y: auto;
		overflow-x: hidden;
		scrollbar-width: none;
	}

	.plate-body::-webkit-scrollbar {
		display: none;
	}

	.panel-plate.open {
		opacity: 1;
		transform: translateY(0);
		pointer-events: auto;
	}

	.presets {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
	}

	.chip {
		min-width: 0;
		padding: 0.95rem 0.5rem;
		border: 1px solid var(--accent);
		border-radius: var(--radius-md);
		background: var(--bg-muted);
		color: var(--accent-light);
		font-family: var(--font-family-base);
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-bold);
		line-height: 1;
		cursor: pointer;
		user-select: none;
		transition:
			background 0.2s ease,
			transform 0.1s ease;
	}

	.chip:hover {
		background: var(--bg-hover);
		border-color: var(--accent-light);
	}

	.chip:active {
		transform: scale(0.94);
	}

	/* Текущее значение таймера — живо обновляется (store timeMs), даже на ходу. */
	.current-time {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1.4rem;
		border-radius: var(--radius-lg);
		border: 2px solid var(--accent);
		background: var(--bg-card);
	}

	.current-time-label {
		color: var(--fg-muted);
		font-family: var(--font-family-base);
		font-size: var(--font-size-base);
		user-select: none;
	}

	.current-time-value {
		color: var(--accent-light);
		font-family: var(--font-family-accent);
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-bold);
		line-height: 1;
		font-variant-numeric: tabular-nums;
		user-select: none;
	}

	@media (max-width: 480px) {
		.panel-trigger {
			font-size: 1.6rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.panel-trigger,
		.panel-plate,
		.chip {
			transition: opacity 0.1s ease;
		}
	}
</style>
