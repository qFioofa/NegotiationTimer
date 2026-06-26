<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { Socket, Presence } from "phoenix";
	import { Users, ArrowLeft, LogOut } from "lucide-svelte";
	import { themeManager } from "$lib/cssStyles/themeHanager";
	import { GlobalConfig } from "$lib/stores/parameters";

	const WS_URL = import.meta.env.VITE_WS_URL ?? "ws://localhost:4000/socket";

	function clientId(): string {
		let id = localStorage.getItem("server_client_id");
		if (!id) {
			id = crypto.randomUUID();
			localStorage.setItem("server_client_id", id);
		}
		return id;
	}

	let code = $state("");
	let joined = $state(false);
	let error = $state("");
	let online = $state(0);

	let socket: Socket | null = null;
	let channel: ReturnType<Socket["channel"]> | null = null;

	function randomCode(): string {
		return Math.random().toString(36).slice(2, 8).toUpperCase();
	}

	function connect(roomCode: string) {
		error = "";
		const trimmed = roomCode.trim().toUpperCase();
		if (!trimmed) {
			error = "Введите код комнаты";
			return;
		}

		socket = new Socket(WS_URL);
		socket.connect();

		channel = socket.channel(`room:${trimmed}`, { client_id: clientId() });
		const presence = new Presence(channel);
		presence.onSync(() => {
			online = presence.list().length;
		});

		channel
			.join()
			.receive("ok", () => {
				code = trimmed;
				joined = true;
			})
			.receive("error", (resp: { reason?: string }) => {
				error = resp?.reason ?? "Не удалось подключиться";
				cleanup();
			});
	}

	function create() {
		connect(randomCode());
	}

	function cleanup() {
		channel?.leave();
		socket?.disconnect();
		channel = null;
		socket = null;
	}

	function leave() {
		cleanup();
		joined = false;
		online = 0;
		code = "";
	}

	onMount(() => {
		themeManager.setTheme(GlobalConfig.get("theme"));
		themeManager.setAccent(GlobalConfig.get("accentColor"));
	});

	onDestroy(cleanup);
</script>

<a class="back" href="/" aria-label="Вернуться назад">
	<ArrowLeft size={28} />
</a>

{#if joined}
	<button class="exit" onclick={leave} aria-label="Выйти из комнаты">
		<LogOut size={28} />
	</button>

	<div class="badge" title="Уникальных пользователей в комнате">
		<Users size={20} />
		<span class="badge-count">{online}</span>
		<span class="badge-label">в сети</span>
	</div>
{/if}

<div class="page">
	{#if joined}
		<div class="card room">
			<p class="eyebrow">Комната</p>
			<h1 class="code">{code}</h1>
			<p class="hint">Поделитесь кодом, чтобы пригласить других.</p>
		</div>
	{:else}
		<div class="card lobby">
			<h1 class="title">Сервер</h1>

			<button class="btn primary" onclick={create}>Создать комнату</button>

			<div class="divider"><span>или</span></div>

			<form
				onsubmit={(e) => {
					e.preventDefault();
					connect(code);
				}}
			>
				<input
					bind:value={code}
					placeholder="КОД КОМНАТЫ"
					autocomplete="off"
					maxlength="6"
				/>
				<button class="btn primary" type="submit">Присоединиться</button>
			</form>

			{#if error}<p class="error">{error}</p>{/if}
		</div>
	{/if}
</div>

<style>
	.page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		background: transparent;
		color: var(--fg);
		font-family: inherit;
	}

	.back {
		position: fixed;
		top: var(--trigger-edge);
		right: var(--trigger-edge);
		z-index: 1001;
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--trigger-size);
		height: var(--trigger-size);
		border-radius: var(--radius-xxl);
		border: 2px solid var(--accent);
		box-shadow: 4px 4px 0 var(--accent-dark);
		background: var(--bg-overlay);
		color: var(--accent-light);
		backdrop-filter: blur(14px);
		cursor: pointer;
		user-select: none;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
	}

	.back:hover {
		transform: scale(1.08);
		box-shadow: 6px 6px 0 var(--accent-dark);
	}

	.back:active {
		transform: scale(0.95);
		box-shadow: 2px 2px 0 var(--accent-dark);
	}

	.exit {
		position: fixed;
		top: var(--trigger-edge);
		right: calc(var(--trigger-edge) + var(--trigger-size) + var(--trigger-gap));
		z-index: 1001;
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--trigger-size);
		height: var(--trigger-size);
		border-radius: var(--radius-xxl);
		border: 2px solid var(--accent);
		box-shadow: 4px 4px 0 var(--accent-dark);
		background: var(--bg-overlay);
		color: var(--accent-light);
		backdrop-filter: blur(14px);
		cursor: pointer;
		user-select: none;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
	}

	.exit:hover {
		transform: scale(1.08);
		box-shadow: 6px 6px 0 var(--accent-dark);
	}

	.exit:active {
		transform: scale(0.95);
		box-shadow: 2px 2px 0 var(--accent-dark);
	}

	.badge {
		position: fixed;
		top: var(--trigger-edge);
		right: calc(
			var(--trigger-edge) + 2 * (var(--trigger-size) + var(--trigger-gap))
		);
		z-index: 1001;
		display: flex;
		align-items: center;
		gap: 0.55rem;
		height: var(--trigger-size);
		padding: 0 1.1rem;
		border-radius: var(--radius-xxl);
		border: 2px solid var(--accent);
		box-shadow: 4px 4px 0 var(--accent-dark);
		background: var(--bg-overlay);
		color: var(--accent-light);
		backdrop-filter: blur(14px);
		font-weight: 700;
		user-select: none;
	}

	.badge-count {
		font-size: 1.25rem;
		line-height: 1;
		color: var(--fg-heading);
		font-variant-numeric: tabular-nums;
		position: relative;
		padding-right: 0.55rem;
	}

	.badge-count::after {
		content: "";
		position: absolute;
		top: 0;
		right: 0;
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: var(--accent-light);
		box-shadow: 0 0 8px var(--accent-light);
		animation: pulse 1.8s ease-in-out infinite;
	}

	.badge-label {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--fg-muted);
		letter-spacing: 0.02em;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 0.45;
			transform: scale(0.7);
		}
	}

	.card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.1rem;
		text-align: center;
		width: min(92vw, 420px);
		padding: 2.5rem 2rem;
		border-radius: var(--radius-xxl);
		border: 2px solid var(--accent);
		box-shadow: 6px 6px 0 var(--accent-dark);
		background: var(--bg-overlay);
		backdrop-filter: blur(14px);
	}

	.title {
		margin: 0;
		font-size: 2.4rem;
		font-weight: 800;
		color: var(--fg-heading);
	}

	.eyebrow {
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.18em;
		font-size: 0.8rem;
		color: var(--fg-muted);
	}

	.code {
		margin: 0;
		font-size: 3rem;
		font-weight: 800;
		letter-spacing: 0.3rem;
		color: var(--accent-light);
	}

	.hint {
		margin: 0;
		color: var(--fg-muted);
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		align-items: stretch;
		width: 100%;
	}

	input {
		font-family: inherit;
		font-size: 1.1rem;
		text-align: center;
		letter-spacing: 0.25rem;
		padding: 0.75rem 1rem;
		border-radius: var(--radius-lg);
		border: 2px solid var(--input-border);
		background: var(--input-bg);
		color: var(--input-fg);
		text-transform: uppercase;
	}

	input::placeholder {
		color: var(--input-placeholder);
		letter-spacing: 0.1rem;
	}

	input:focus {
		outline: none;
		box-shadow: 0 0 0 3px var(--accent-muted);
	}

	.btn {
		font-family: inherit;
		cursor: pointer;
		font-size: 1.05rem;
		font-weight: 700;
		border-radius: var(--radius-lg);
		padding: 0.75rem 1.6rem;
		border: 2px solid var(--accent);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.btn:hover {
		transform: translateY(-2px);
		box-shadow: 4px 4px 0 var(--accent-dark);
	}

	.btn:active {
		transform: translateY(1px);
		box-shadow: 2px 2px 0 var(--accent-dark);
	}

	.primary {
		background: var(--accent);
		color: var(--bg);
	}

	.divider {
		width: 100%;
		text-align: center;
		border-bottom: 1px solid var(--divider);
		line-height: 0.1rem;
		margin: 0.4rem 0;
	}

	.divider span {
		background: var(--bg-overlay);
		padding: 0 0.7rem;
		color: var(--fg-subtle);
		font-size: 0.85rem;
	}

	.error {
		margin: 0;
		color: #ff6b6b;
	}

	@media (prefers-reduced-motion: reduce) {
		.back,
		.exit,
		.btn,
		.badge-count::after {
			transition: none;
			animation: none;
		}
	}
</style>
