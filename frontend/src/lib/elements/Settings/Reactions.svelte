<script lang="ts">
	import { onDestroy } from "svelte";
	import { joined, reaction, sendReaction } from "$lib/stores/room";
	import { GlobalConfig } from "$lib/stores/parameters";

	// Параметры реакций живут в настройках комнаты (тот же реестр-движок настроек).
	const secs = (v: unknown) => parseFloat(String(v)) * 1000;
	let enabled = $state(GlobalConfig.get<boolean>("reactionsEnabled"));
	let lifeMs = $state(secs(GlobalConfig.get("reactionLifetime")));
	let cooldownMs = $state(secs(GlobalConfig.get("reactionCooldown")));
	const cfgUnsubs = [
		GlobalConfig.subscribe("reactionsEnabled", (v) => (enabled = v as boolean)),
		GlobalConfig.subscribe("reactionLifetime", (v) => (lifeMs = secs(v))),
		GlobalConfig.subscribe("reactionCooldown", (v) => (cooldownMs = secs(v))),
	];
	onDestroy(() => cfgUnsubs.forEach((u) => u()));

	// Стикеры из static/stickers. Глоб нужен только чтобы собрать имена на этапе
	// сборки; URL строим сами — SvelteKit отдаёт static/ напрямую с верным MIME.
	// (Импорт через ?url из publicDir ломал video/webm: контент-тип не video/*.)
	const stickers = Object.keys(import.meta.glob("/static/stickers/*")).map((p) =>
		p.replace("/static", ""),
	);

	// Цифры — стикеры zero/one/two/three × R/G/B; всё остальное в папке = мемы.
	const NUM_RE = /\/(zero|one|two|three)[RGB]\.webm$/i;
	const NUM_ORDER = ["zero", "one", "two", "three"];
	const numKey = (s: string) => {
		const m = s.match(/\/(zero|one|two|three)([RGB])\./i)!;
		return NUM_ORDER.indexOf(m[1].toLowerCase()) * 3 + "RGB".indexOf(m[2]);
	};
	const numbers = stickers.filter((s) => NUM_RE.test(s)).sort((a, b) => numKey(a) - numKey(b));
	const memes = stickers.filter((s) => !NUM_RE.test(s));

	// Строка = unicode-эмодзи, путь/URL картинки/гифки или видео (.webm/.mp4).
	const TABS = [
		{ id: "regular", label: "Обычные", items: ["👍", "🔥", "😂", "😮", "❤️", "👎"] },
		{ id: "numbers", label: "Цифры", items: numbers },
		{ id: "memes", label: "Мемы", items: memes },
	];
	let tab = $state("regular");

	// Скорость воспроизведения видео-стикеров. >1 = живее.
	const STICKER_SPEED = 2.5;

	const isVideo = (s: string) => /\.(webm|mp4)$/i.test(s);
	const isImage = (s: string) =>
		/\.(png|gif|webp|svg|jpe?g)$/i.test(s) || /^(https?:|\/)/.test(s);

	// Svelte не выставляет свойство muted из атрибута → autoplay блокируется, кадр не рисуется.
	// Ставим muted как свойство и стартуем play(), когда данные готовы (иначе play() реджектится).
	function playMuted(node: HTMLVideoElement) {
		node.muted = true;
		node.playbackRate = STICKER_SPEED;
		const tryPlay = () => node.play().catch(() => {});
		if (node.readyState >= 2) tryPlay();
		else node.addEventListener("loadeddata", tryPlay, { once: true });
	}

	let open = $state<"left" | "right" | null>(null);

	// ponytail: клиентский анти-спам; интервал из настроек. Серверный лимит — если понадобится.
	let lastSent = 0;
	function send(emoji: string, side: "left" | "right") {
		const now = Date.now();
		if (now - lastSent < cooldownMs) return;
		lastSent = now;
		sendReaction(emoji, side);
	}

	type Flyer = {
		id: number;
		emoji: string;
		side: "left" | "right";
		dx: number; // горизонтальный снос на вершине, px (внутрь экрана)
		rise: number; // высота подъёма, px
		es: number; // конечный масштаб
		rot: number; // конечный поворот, deg
	};
	let flyers = $state<Flyer[]>([]);

	const unsub = reaction.subscribe((r) => {
		if (!r) return;
		const inward = r.side === "left" ? 1 : -1;
		const f: Flyer = {
			id: r.id,
			emoji: r.emoji,
			side: r.side,
			// Снос/подъём масштабируются от размера окна, чтобы стикер мог
			// долететь до центра экрана; случайная величина даёт разброс.
			dx: inward * Math.random() * window.innerWidth * 0.3,
			rise: 200 + Math.random() * window.innerHeight * 0.6,
			es: 0.8 + Math.random() * 0.5,
			rot: (Math.random() * 2 - 1) * 25,
		};
		flyers = [...flyers, f];
		setTimeout(() => (flyers = flyers.filter((x) => x.id !== f.id)), lifeMs);
	});
	onDestroy(unsub);
</script>

{#snippet glyph(e: string)}
	{#if isVideo(e)}
		<video
			class="glyph"
			src={e}
			use:playMuted
			autoplay
			loop
			muted
			playsinline
			preload="auto"
		></video>
	{:else if isImage(e)}
		<img class="glyph" src={e} alt="" />
	{:else}{e}{/if}
{/snippet}

{#if $joined && enabled}
	{#each ["left", "right"] as const as side (side)}
		<div class="dock {side}">
			<button
				class="toggle"
				aria-label="Реакции"
				aria-expanded={open === side}
				onclick={() => (open = open === side ? null : side)}
			>
				{open === side ? "✕" : "😀"}
			</button>

			{#if open === side}
				<div class="panel">
					<div class="tabs">
						{#each TABS as t (t.id)}
							<button
								class="tab"
								class:active={tab === t.id}
								onclick={() => (tab = t.id)}>{t.label}</button
							>
						{/each}
					</div>
					<div class="grid">
						{#each TABS.find((t) => t.id === tab)?.items ?? [] as e (e)}
							<button onclick={() => send(e, side)} aria-label="Реакция">
								{@render glyph(e)}
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/each}

	{#each flyers as f (f.id)}
		<span
			class="flyer {f.side}"
			style="--dx: {f.dx}px; --rise: {f.rise}px; --es: {f.es}; --rot: {f.rot}deg; --life: {lifeMs}ms"
		>
			{@render glyph(f.emoji)}
		</span>
	{/each}
{/if}

<style>
	.dock {
		position: fixed;
		bottom: var(--trigger-edge);
		z-index: 1001;
		display: flex;
		flex-direction: column-reverse;
		gap: 0.4rem;
	}

	/* Тоггл прижат к своему углу — иначе при открытии широкой панели ✕ уезжает к центру. */
	.dock.left {
		left: var(--trigger-edge);
		align-items: flex-start;
	}

	.dock.right {
		right: var(--trigger-edge);
		align-items: flex-end;
	}

	.toggle {
		font-size: 1.6rem;
		line-height: 1;
		width: 2.8rem;
		height: 2.8rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-xxl);
		border: 2px solid var(--accent);
		box-shadow: 4px 4px 0 var(--accent-dark);
		background: var(--bg-overlay);
		color: var(--accent-light);
		backdrop-filter: blur(14px);
		cursor: pointer;
		transition: transform 0.15s ease;
	}

	.toggle:hover {
		transform: scale(1.1);
	}
	.toggle:active {
		transform: scale(0.92);
	}

	.panel {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		padding: 0.5rem;
		max-width: 92vw;
		border-radius: var(--radius-xxl);
		border: 2px solid var(--accent);
		box-shadow: 4px 4px 0 var(--accent-dark);
		background: var(--bg-overlay);
		backdrop-filter: blur(14px);
	}

	.tabs {
		display: flex;
		gap: 0.25rem;
	}

	.tab {
		flex: 1;
		font-family: inherit;
		font-size: 0.8rem;
		font-weight: 700;
		padding: 0.3rem 0.4rem;
		border-radius: var(--radius-lg);
		border: 2px solid var(--accent);
		background: transparent;
		color: var(--accent-light);
		cursor: pointer;
	}

	.tab.active {
		background: var(--accent);
		color: var(--bg);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(7, 2.6rem);
		gap: 0.4rem;
		max-height: 50vh;
		overflow: auto;
	}

	.grid button {
		font-size: 1.5rem;
		line-height: 1;
		width: 2.6rem;
		height: 2.6rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		border-radius: var(--radius-lg);
		background: transparent;
		box-shadow: none;
		cursor: pointer;
		transition: transform 0.15s ease;
	}

	.grid button:hover {
		transform: scale(1.25);
		background: transparent;
		box-shadow: none;
	}
	.grid button:active {
		transform: scale(0.9);
	}

	.glyph {
		width: 1.8rem;
		height: 1.8rem;
		object-fit: contain;
	}

	.flyer {
		position: fixed;
		bottom: calc(var(--trigger-edge) + 3.4rem);
		z-index: 1000;
		font-size: 2.6rem;
		pointer-events: none;
		animation: fly var(--life, 5s) ease-out forwards;
	}

	.flyer .glyph {
		width: 2.6rem;
		height: 2.6rem;
	}

	.flyer.left {
		left: calc(var(--trigger-edge) + 0.5rem);
	}

	.flyer.right {
		right: calc(var(--trigger-edge) + 0.5rem);
	}

	/* dx растёт от 0 у точки-кнопки до --dx на вершине → конус, расширяющийся вверх. */
	@keyframes fly {
		0% {
			opacity: 0;
			transform: translate(0, 0) scale(0.4);
		}
		12% {
			opacity: 1;
			transform: translate(calc(var(--dx) * 0.08), calc(var(--rise) * -0.15)) scale(1.3);
		}
		100% {
			opacity: 0;
			transform: translate(var(--dx), calc(var(--rise) * -1))
				scale(var(--es)) rotate(var(--rot));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.flyer {
			animation-duration: 2s;
		}
	}
</style>
