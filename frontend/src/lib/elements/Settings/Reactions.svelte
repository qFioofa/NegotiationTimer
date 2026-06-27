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

	// Строка = unicode-эмодзи, путь/URL картинки/гифки или видео (.webm/.mp4).
	const EMOJIS = ["👍", "🔥", "😂", "😮", "❤️", "👎", ...stickers];

	const isVideo = (s: string) => /\.(webm|mp4)$/i.test(s);
	const isImage = (s: string) =>
		/^(https?:|\/)/.test(s) || /\.(png|gif|webp|svg|jpe?g)$/i.test(s);

	// Svelte не выставляет свойство muted из атрибута → autoplay блокируется, кадр не рисуется.
	// Ставим muted как свойство и стартуем play(), когда данные готовы (иначе play() реджектится).
	function playMuted(node: HTMLVideoElement) {
		node.muted = true;
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
			// Снос всегда внутрь экрана; случайная величина даёт конус при спаме.
			dx: inward * (10 + Math.random() * 150),
			rise: 180 + Math.random() * 120,
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
					{#each EMOJIS as e (e)}
						<button onclick={() => send(e, side)} aria-label="Реакция">
							{@render glyph(e)}
						</button>
					{/each}
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
		align-items: center;
		gap: 0.4rem;
	}

	.dock.left {
		left: var(--trigger-edge);
	}

	.dock.right {
		right: var(--trigger-edge);
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
		display: grid;
		grid-template-columns: repeat(7, 2.6rem);
		gap: 0.4rem;
		padding: 0.5rem;
		max-width: 92vw;
		max-height: 60vh;
		overflow: auto;
		border-radius: var(--radius-xxl);
		border: 2px solid var(--accent);
		box-shadow: 4px 4px 0 var(--accent-dark);
		background: var(--bg-overlay);
		backdrop-filter: blur(14px);
	}

	.panel button {
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
		cursor: pointer;
		transition: transform 0.15s ease;
	}

	.panel button:hover {
		transform: scale(1.25);
	}
	.panel button:active {
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
			transform: translate(calc(var(--dx) * 0.12), -10px) scale(1.3);
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
