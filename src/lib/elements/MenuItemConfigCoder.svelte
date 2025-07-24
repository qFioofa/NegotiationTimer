<script>
	import { GlobalConfig } from "$lib/stores/parameters";
	import Encoder from "$lib/components/Encoder";
	import { writable, get } from "svelte/store";

	export let mode = "coder"; // "coder" или "decoder"
	export let icon;
	export let title;
	export let tooltipText;

	const text = writable("");
	const error = writable("");

	async function encodeAndCopy() {
		error.set("");
		try {
			const encoded = await Encoder.encode({
				static: GlobalConfig.getConfig(),
				media: await GlobalConfig.getAllMedia(),
			});

			text.set(encoded);
			await navigator.clipboard.writeText(encoded);
			error.set("✅ Строка закодирована и скопирована в буфер обмена");
		} catch (e) {
			console.error(e);
			text.set("");
			error.set("Ошибка при кодировании");
		}
	}

	async function decodeConfig() {
		error.set("");
		const value = get(text).trim();
		if (!value) {
			error.set("Введите строку для загрузки");
			return;
		}
		try {
			const decoded = await Encoder.decode(value);

			if (!decoded.static || !decoded.media) {
				error.set("Неверный формат данных");
				return;
			}

			await GlobalConfig.setConfig(decoded.static, decoded.media);
			error.set("✅ Конфигурация загружена");
		} catch (e) {
			console.error(e);
			error.set("Ошибка при декодировании");
		}
	}
</script>

<div class="menu-item">
	{#if icon}
		<div class="item-icon">{icon}</div>
	{/if}

	<div class="item-content">
		<div class="item-title">
			<span>{title}</span>
			{#if tooltipText}
				<div class="tooltip-wrapper">
					<span class="info-icon" tabindex="0" role="button">?</span>
					<div class="tooltip">{tooltipText}</div>
				</div>
			{/if}
		</div>

		{#if mode === "coder"}
			<button on:click={encodeAndCopy}>Закодировать и скопировать</button>
		{:else if mode === "decoder"}
			<textarea bind:value={$text} placeholder="Вставьте строку конфигурации"></textarea>
			<button on:click={decodeConfig}>Загрузить</button>
		{/if}

		{#if $error}
			<div class="error">{$error}</div>
		{/if}
	</div>
</div>

<style>
	.menu-item {
		padding: 20px;
		margin: 12px 0;
		background: var(--bg);
		border-radius: 14px;
		border: 1px solid var(--accent);
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		position: relative;
		overflow: hidden;
		z-index: 2;
	}

	.item-icon {
		font-size: 2rem;
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--input-bg);
		border-radius: 50%;
		color: var(--accent);
		flex-shrink: 0;
	}

	.item-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		min-width: 0;
	}

	.item-title {
		font-size: 1.6rem;
		color: var(--fg);
		font-weight: 500;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.tooltip-wrapper {
		position: relative;
		display: inline-block;
	}

	.info-icon {
		font-size: 1rem;
		background: var(--accent);
		color: var(--input-bg);
		border-radius: 50%;
		width: 18px;
		height: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: help;
		position: relative;
		z-index: 1;
	}

	.tooltip {
		opacity: 0;
		visibility: hidden;
		position: absolute;
		bottom: 140%;
		left: 50%;
		transform: translateX(-50%);
		background: var(--tooltip-bg, #222);
		color: var(--tooltip-fg, #fff);
		padding: 6px 10px;
		border-radius: 8px;
		font-size: 1.2rem;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
		transition: opacity 0.2s ease;
		z-index: 1000;
		max-width: 300px;
		text-align: center;
		pointer-events: none;
	}

	.tooltip-wrapper:hover .tooltip,
	.tooltip-wrapper:focus-within .tooltip {
		opacity: 1;
		visibility: visible;
	}

	textarea {
		width: 100%;
		min-height: 120px;
		font-size: 1.2rem;
		padding: 10px;
		border: 1px solid var(--accent);
		border-radius: 8px;
		background: var(--input-bg);
		color: var(--fg);
		resize: vertical;
		box-shadow: 0 0 8px var(--shadow);
	}

	button {
		padding: 0.6rem 1.2rem;
		font-size: 1.2rem;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		background: var(--accent);
		color: var(--input-bg);
		box-shadow: 0 0 8px var(--shadow);
		transition: background 0.2s ease;
	}

	button:hover {
		background: var(--accent-light);
	}

	.error {
		color: var(--error-text);
		font-size: 1.2rem;
		margin-top: 0.5rem;
		white-space: pre-wrap;
	}
</style>
