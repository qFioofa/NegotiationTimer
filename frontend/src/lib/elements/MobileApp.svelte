<!--
	Отдельный мобильный интерфейс (портрет, телефон). Совсем другая раскладка, чем
	на десктопе: игроки сверху, крупный таймер по центру, всё управление — в зоне
	большого пальца снизу. Вся логика переиспользуется из общих сторов
	(timerDown / Pause / ShuffleFunction) — дублируется только разметка/стиль.
	Рендерится вместо десктоп-дерева (см. +page.svelte, matchMedia).
-->
<script>
	import {
		isRunning,
		toggleTimer,
		startTimer,
		timeMs,
		downTimerSnap,
		timerExpired,
		resetToStart as syncResetToStart,
	} from "$lib/stores/timerDown";
	import {
		ShuffleFunction,
		GlobalConfig,
		isBlackout,
	} from "$lib/stores/parameters";
	import { timerDisplay } from "$lib/components/utils/TimerUtils";
	import { isPaused } from "$lib/components/Pause";
	import { shuffleMap } from "$lib/components/Shuffle";
	import { RotateCcw, Pause, Shuffle, Play } from "lucide-svelte";
	import RollingCounter from "./Timer/RollingCounter.svelte";
	import NameInput from "./Players/Wrappers/NameInput.svelte";
	import { nameA, nameB } from "$lib/stores/players";
	import { canEditTimer } from "$lib/stores/room";
	import BlackOut from "./BlackOut.svelte";
	import { onMount } from "svelte";

	// --- Игроки / жеребьёвка (как в PlayerComp, на своих DOM-узлах) ---
	let number1 = $state(),
		number2 = $state();

	async function shufflePlayers() {
		if (
			typeof window !== "undefined" &&
			window.matchMedia("(prefers-reduced-motion: reduce)").matches
		) {
			const r = Math.round(Math.random());
			number1.textContent = r === 0 ? "1" : "2";
			number2.textContent = r === 0 ? "2" : "1";
			return;
		}
		const f = shuffleMap.get(GlobalConfig.get("shuffleAnimation"));
		if (f) await f(number1, number2);
	}

	// --- Таймер: пауза/возобновление и блэкаут — те же эффекты, что в Timer.svelte ---
	let wasRunningBeforePause = $state(false);

	$effect(() => {
		if ($isPaused) {
			if ($isRunning) {
				wasRunningBeforePause = true;
				toggleTimer();
			}
		} else if (wasRunningBeforePause) {
			startTimer();
			wasRunningBeforePause = false;
		}
	});

	$effect(() => {
		if ($timerExpired) isBlackout.set(true);
	});

	// Точное изменение времени (±, задать) живёт во всплывающей плашке BottomMenu
	// (иконка-часы вверху справа) — чтобы не занимать место на основном экране.
	function resetToStart() {
		syncResetToStart($downTimerSnap);
		GlobalConfig.set("timerDuration", $downTimerSnap);
	}

	async function handleShuffle() {
		const f = await $ShuffleFunction;
		if (f) await f();
	}

	// Размер таймера подстраивается под ширину экрана.
	let counterSize = $state(76);
	function fitCounter() {
		counterSize = Math.round(
			Math.min(120, Math.max(56, window.innerWidth * 0.2)),
		);
	}

	onMount(() => {
		ShuffleFunction.set(shufflePlayers);
		fitCounter();
		window.addEventListener("resize", fitCounter);
		return () => window.removeEventListener("resize", fitCounter);
	});
</script>

<BlackOut blackoutTitle="Время вышло!" configKey="audioTimerEnd" />

<div class="mobile-app">
	<section class="players">
		<div class="player">
			<div class="badge" bind:this={number1}>1</div>
			<NameInput defaultText="Игрок 1" bind:playerName={$nameA} />
		</div>
		<div class="vs">VS</div>
		<div class="player">
			<div class="badge" bind:this={number2}>2</div>
			<NameInput defaultText="Игрок 2" bind:playerName={$nameB} />
		</div>
	</section>

	<section class="timer-zone">
		<button
			class="timer-btn"
			class:running={$isRunning}
			onclick={toggleTimer}
			disabled={!$canEditTimer}
			aria-label={$isRunning ? "Пауза" : "Старт"}
		>
			<RollingCounter
				value={timerDisplay($timeMs)}
				fontSize={counterSize}
			/>
		</button>
		<span class="hint">
			{#if $isRunning}
				<Pause size={14} /> идёт — нажмите для паузы
			{:else}
				<Play size={14} /> нажмите, чтобы запустить
			{/if}
		</span>
	</section>

	<section class="actions">
		<button class="action" onclick={resetToStart} disabled={!$canEditTimer} aria-label="Сбросить к стартовому времени">
			<RotateCcw size={24} />
		</button>
		<button class="action" onclick={() => isPaused.set(true)} disabled={!$canEditTimer} aria-label="Пауза">
			<Pause size={24} />
		</button>
		<button class="action accent" onclick={handleShuffle} aria-label="Жеребьёвка игроков">
			<Shuffle size={24} />
		</button>
	</section>
</div>

<style>
	.mobile-app {
		position: fixed;
		inset: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: calc(var(--trigger-edge) + var(--trigger-size) + 0.5rem) 0.9rem
			calc(0.9rem + env(safe-area-inset-bottom));
		box-sizing: border-box;
		overflow: hidden;
	}

	/* --- Игроки --- */
	.players {
		display: flex;
		align-items: stretch;
		justify-content: center;
		gap: 0.6rem;
	}

	.player {
		flex: 1 1 0;
		min-width: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 0.9rem 0.5rem;
		background: var(--bg-card);
		border: 2px solid var(--accent);
		border-radius: var(--radius-lg);
		box-shadow: 4px 4px 0 var(--accent-dark);
	}

	.badge {
		font-family: var(--font-family-simple);
		font-size: clamp(3rem, 16vw, 6rem);
		font-weight: var(--font-weight-black);
		line-height: 1;
		color: var(--accent);
		text-shadow: 0 0 12px var(--shadow);
		user-select: none;
	}

	.vs {
		align-self: center;
		font-family: var(--font-family-accent);
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-bold);
		color: var(--fg-muted);
		user-select: none;
	}

	/* --- Таймер --- */
	.timer-zone {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		min-height: 0;
	}

	.timer-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.4rem 1.8rem;
		border-radius: var(--radius-xxl);
		border: 2px solid var(--accent);
		box-shadow: 6px 6px 0 var(--accent-dark);
		background: var(--bg-overlay);
		color: var(--accent-light);
		backdrop-filter: blur(14px);
		font-family: var(--font-family-accent);
		line-height: 1;
		text-shadow: 0 0 8px var(--shadow);
	}

	.timer-btn.running {
		border-color: var(--accent-light);
		box-shadow:
			0 0 24px var(--accent),
			6px 6px 0 var(--accent-dark);
	}

	.timer-btn:active {
		transform: translateY(3px) scale(0.99);
		box-shadow: 2px 2px 0 var(--accent-dark);
	}

	.hint {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		color: var(--fg-muted);
		font-family: var(--font-family-base);
		font-size: var(--font-size-sm);
		user-select: none;
	}

	/* --- Действия (компактный ряд иконок; точное время — в плашке-часах) --- */
	.actions {
		display: flex;
		justify-content: center;
		gap: 0.6rem;
	}

	.action {
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3.2rem;
		height: 3.2rem;
		border: 1px solid var(--accent);
		border-radius: var(--radius-md);
		background: var(--bg-muted);
		color: var(--accent-light);
		box-shadow: none;
	}

	.action.accent {
		background: var(--accent);
		color: var(--input-bg);
	}

	.action:active {
		transform: scale(0.94);
	}

	.action:disabled,
	.timer-btn:disabled {
		opacity: 0.4;
		pointer-events: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.action:active,
		.timer-btn:active {
			transform: none;
		}
	}
</style>
