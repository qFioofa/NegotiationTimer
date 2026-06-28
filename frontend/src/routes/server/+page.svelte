<script lang="ts">
	import { onMount } from "svelte";
	import QRCode from "qrcode";
	import { Copy, Check, Link as LinkIcon, LogOut, Timer, Download, TriangleAlert } from "lucide-svelte";
	import { themeManager } from "$lib/cssStyles/themeHanager";
	import { GlobalConfig } from "$lib/stores/parameters";
	import {
		joined,
		isHost,
		myNick,
		roomCode,
		roomError,
		connectRoom,
		createRoom,
		leaveRoom,
		roomLink,
		lastRoom,
	} from "$lib/stores/room";
	import { hostStyle, applyHostStyle } from "$lib/stores/roomSync";
	import OnlineBadge from "$lib/elements/Settings/OnlineBadge.svelte";
	import SettingsCategories from "$lib/elements/Settings/SettingsCategories.svelte";
	import SettingsList from "$lib/elements/Settings/SettingsList.svelte";
	import SettingCard from "$lib/elements/Settings/SettingCard.svelte";
	import RoomMembers from "$lib/elements/Settings/RoomMembers.svelte";
	import {
		roomCategories,
		roomSettings,
		profileAutoSync,
		profileTimerSync,
	} from "$lib/elements/Settings/roomSettingsRegistry";

	let input = $state("");
	let qr = $state("");
	let copied = $state<"code" | "link" | "">("");
	let cfgStatus = $state("");
	let confirmStyle = $state(false);
	function flashCfg(text: string) {
		cfgStatus = text;
		setTimeout(() => (cfgStatus = ""), 1800);
	}
	async function applyStyle() {
		confirmStyle = false;
		await applyHostStyle();
		flashCfg("Профиль синхронизирован");
	}

	let section = $state("info");

	async function copy(kind: "code" | "link", text: string) {
		try {
			await navigator.clipboard.writeText(text);
			copied = kind;
			setTimeout(() => (copied = ""), 1500);
		} catch {}
	}

	onMount(() => {
		themeManager.setTheme(GlobalConfig.get("theme"));
		themeManager.setAccent(GlobalConfig.get("accentColor"));

		const room = new URLSearchParams(location.search).get("room") || lastRoom();
		if (room && !$joined) connectRoom(room);
	});

	$effect(() => {
		if ($joined && $roomCode) {
			const u = new URL(location.href);
			if (u.searchParams.get("room") !== $roomCode) {
				u.searchParams.set("room", $roomCode);
				history.replaceState(null, "", u);
			}
			QRCode.toDataURL(roomLink($roomCode), { margin: 1, width: 220 })
				.then((d) => (qr = d))
				.catch(() => (qr = ""));
		} else {
			qr = "";
		}
	});
</script>

<a class="trigger corner" href="/" aria-label="К таймеру">
	<Timer size={28} />
</a>

{#if $joined}
	<button
		class="trigger exit"
		onclick={() => leaveRoom()}
		aria-label="Выйти из комнаты"
	>
		<LogOut size={28} />
	</button>
{/if}

<OnlineBadge />

<div class="page">
	{#if $joined}
		<div class="room-panel">
			<header class="room-head">
				<p class="eyebrow">Комната</p>
				<h1 class="code">{$roomCode}</h1>
			</header>

			<nav class="nav">
				<SettingsCategories bind:selected={section} cats={roomCategories} />
			</nav>

			<div class="panel-body">
				{#if section === "info"}
					<div class="actions">
						<button
							class="btn"
							onclick={() => copy("code", $roomCode)}
						>
							{#if copied === "code"}<Check
									size={18}
								/>Скопировано{:else}<Copy size={18} />Код{/if}
						</button>
						<button
							class="btn"
							onclick={() => copy("link", roomLink($roomCode))}
						>
							{#if copied === "link"}<Check
									size={18}
								/>Скопировано{:else}<LinkIcon
									size={18}
								/>Ссылка{/if}
						</button>
					</div>

					{#if qr}
						<img
							class="qr"
							src={qr}
							alt="QR код для входа в комнату"
						/>
					{/if}

					<p class="hint">
						Покажи QR или дай ссылку — подключатся сразу.
					</p>
				{:else if section === "members"}
					<RoomMembers />
				{:else if section === "reactions"}
					<p class="hint">
						Изменения применяются у всех участников комнаты сразу.
					</p>
					<div class="settings-wrap">
						<SettingsList items={roomSettings} category="reactions" />
					</div>
				{:else if section === "camera"}
					<p class="eyebrow">Камера</p>
					<p class="hint">Раздел в разработке.</p>
				{:else if section === "profile"}
					<p class="eyebrow">Профиль</p>
					{#if $isHost}
						<p class="hint">
							Ты хост — твоё оформление и есть профиль комнаты.
							Участники могут синхронизировать его со своим.
						</p>
						<div class="settings-wrap">
							<SettingCard setting={profileTimerSync} />
						</div>
					{:else}
						<div class="settings-wrap">
							<SettingCard setting={profileAutoSync} />
						</div>
						<div class="actions">
							<button
								class="btn primary"
								disabled={!$hostStyle}
								onclick={() => (confirmStyle = true)}
							>
								<Download size={18} />Синхронизировать одноразово
							</button>
						</div>
						{#if cfgStatus}
							<p class="hint">{cfgStatus}</p>
						{:else if !$hostStyle}
							<p class="hint">Хост ещё не задал стиль комнаты.</p>
						{/if}
						<div class="settings-wrap">
							<SettingCard setting={profileTimerSync} />
						</div>
					{/if}
				{:else}
					<p class="eyebrow">Другое</p>
					<p class="hint">Раздел в разработке.</p>
				{/if}
			</div>
		</div>
	{:else}
		<div class="card">
			<h1 class="title">Сервер</h1>

			<input
				class="nick"
				bind:value={$myNick}
				placeholder="ТВОЙ НИК"
				autocomplete="off"
				maxlength="20"
			/>

			<button class="btn primary" onclick={createRoom}
				>Создать комнату</button
			>

			<div class="divider"><span>или</span></div>

			<form
				onsubmit={(e) => {
					e.preventDefault();
					connectRoom(input);
				}}
			>
				<input
					bind:value={input}
					placeholder="КОД КОМНАТЫ"
					autocomplete="off"
					maxlength="6"
				/>
				<button class="btn primary" type="submit">Присоединиться</button
				>
			</form>

			{#if $roomError}<p class="error">{$roomError}</p>{/if}
		</div>
	{/if}

	{#if confirmStyle}
		<div
			class="overlay"
			role="button"
			tabindex="0"
			onclick={(e) =>
				e.target === e.currentTarget && (confirmStyle = false)}
			onkeydown={(e) => e.key === "Escape" && (confirmStyle = false)}
		>
			<div class="confirm" role="dialog" aria-modal="true" tabindex="-1">
				<TriangleAlert size={32} class="warn-ic" />
				<h2>Синхронизировать профиль?</h2>
				<p>
					Твоё текущее оформление будет стёрто и заменено стилем хоста:
					тема, цвет, задний фон и звук. Это действие не отменить.
				</p>
				<div class="actions">
					<button class="btn" onclick={() => (confirmStyle = false)}
						>Отмена</button
					>
					<button class="btn primary" onclick={applyStyle}
						>Синхронизировать</button
					>
				</div>
			</div>
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

	.trigger {
		position: fixed;
		top: var(--trigger-edge);
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

	.trigger:hover {
		transform: scale(1.08);
		box-shadow: 6px 6px 0 var(--accent-dark);
	}

	.trigger:active {
		transform: scale(0.95);
		box-shadow: 2px 2px 0 var(--accent-dark);
	}

	.corner {
		right: var(--trigger-edge);
	}

	.exit {
		right: calc(
			var(--trigger-edge) + var(--trigger-size) + var(--trigger-gap)
		);
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

	.room-panel {
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
		width: min(96vw, 940px);
		height: min(90dvh, 860px);
		padding: 1.6rem;
		border-radius: var(--radius-xxl);
		border: 2px solid var(--accent);
		box-shadow: 6px 6px 0 var(--accent-dark);
		background: var(--bg-overlay);
		backdrop-filter: blur(14px);
	}

	.room-head {
		text-align: center;
	}

	.settings-wrap {
		width: 100%;
		max-width: 640px;
		text-align: left;
	}

	.nav {
		border-bottom: 1px solid var(--divider);
		padding-bottom: 0.6rem;
	}

	.panel-body {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.1rem;
		width: 100%;
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		text-align: center;
		scrollbar-width: thin;
		scrollbar-color: var(--accent-light) transparent;
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

	.actions {
		display: flex;
		gap: 0.6rem;
		width: 100%;
		max-width: 640px;
	}

	.actions .btn {
		flex: 1;
	}

	.qr {
		width: 220px;
		height: 220px;
		border-radius: var(--radius-lg);
		border: 4px solid #fff;
		background: #fff;
		image-rendering: pixelated;
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

	.nick {
		width: 100%;
		text-transform: none;
		letter-spacing: 0.05rem;
	}

	.btn {
		font-family: inherit;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		font-size: 1.05rem;
		font-weight: 700;
		border-radius: var(--radius-lg);
		padding: 0.7rem 1.2rem;
		border: 2px solid var(--accent);
		background: transparent;
		color: var(--accent-light);
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

	.overlay {
		position: fixed;
		inset: 0;
		z-index: 2000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		background: rgba(0, 0, 0, 0.55);
		backdrop-filter: blur(4px);
	}

	.confirm {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.8rem;
		max-width: 24rem;
		padding: 1.6rem;
		text-align: center;
		border-radius: var(--radius-xxl);
		border: 2px solid var(--accent);
		box-shadow: 4px 4px 0 var(--accent-dark);
		background: var(--bg-overlay);
	}

	.confirm :global(.warn-ic) {
		color: #ffb020;
	}

	.confirm h2 {
		margin: 0;
		font-size: 1.2rem;
	}

	.confirm p {
		margin: 0;
		color: var(--fg-muted);
		font-size: 0.9rem;
		line-height: 1.4;
	}

	.confirm .actions {
		margin-top: 0.4rem;
	}

	@media (prefers-reduced-motion: reduce) {
		.trigger,
		.btn {
			transition: none;
		}
	}
</style>
