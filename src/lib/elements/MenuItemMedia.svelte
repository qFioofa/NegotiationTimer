<script>
	import { onMount } from "svelte";
	import { GlobalConfig } from "$lib/stores/parameters";
	import { writable } from "svelte/store";

	export let icon;
	export let title;
	export let tooltipText;
	export let supportedTypes;
	export let configKey;

	let fileUrl = null;
	let fileName = null;
	let audio = null;
	let isPlaying = false;
	let fileType = null;

	let error = writable("");
	let loading = writable(false);
	let loaded = writable(false);

	function handleFileUpload(event) {
		error.set("");
		loading.set(true);
		loaded.set(false);

		const file = event.target.files[0];
		if (!file) {
			error.set("Файл не выбран.");
			loading.set(false);
			return;
		}

		if (!supportedTypes.includes(file.type)) {
			error.set("Неподдерживаемый формат файла.");
			loading.set(false);
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			fileUrl = reader.result;
			fileName = file.name;
			fileType = file.type;
			GlobalConfig.setMedia(configKey, fileUrl);
			GlobalConfig.save();
			loading.set(false);
			loaded.set(true);

			if (fileType.startsWith("audio/")) {
				if (audio) {
					audio.pause();
					audio = null;
					isPlaying = false;
				}
				audio = new Audio(fileUrl);
			}
		};

		reader.onerror = () => {
			error.set("Ошибка при чтении файла.");
			loading.set(false);
			loaded.set(false);
		};

		reader.readAsDataURL(file);
	}

	function playAudio() {
		if (!fileUrl || !audio) return;

		if (isPlaying) {
			audio.pause();
			audio.currentTime = 0;
			isPlaying = false;
		} else {
			audio.play();
			isPlaying = true;
			audio.onended = () => {
				isPlaying = false;
			};
		}
	}

	onMount(async () => {
		const saved = await GlobalConfig.getMedia(configKey);
		if (saved) {
			fileUrl = saved;
			fileType = detectFileTypeFromBase64(saved);
			fileName = "Загруженный файл";
			loaded.set(true);

			if (fileType.startsWith("audio/")) {
				audio = new Audio(saved);
			}
		}
	});

	function detectFileTypeFromBase64(base64) {
		const match = base64.match(/^data:(.*?);base64,/);
		return match ? match[1] : "unknown";
	}
</script>

{#if title}
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

			<div class="media-upload">
				<label for="mediaInput">Загрузить файл:</label>
				<input
					type="file"
					id="mediaInput"
					accept={supportedTypes.join(",")}
					on:change={handleFileUpload}
				/>
				{#if $loading}
					<div class="status loading">Загрузка...</div>
				{:else if $loaded}
					<div class="status success">Файл загружен и сохранён</div>
				{/if}

				{#if $error}
					<div class="error">{$error}</div>
				{/if}

				{#if fileUrl}
					<div class="file-info">
						<div class="filename">{fileName}</div>

						{#if fileType.startsWith("audio/")}
							<button class="play-btn" on:click={playAudio}>
								{isPlaying ? "■ Остановить" : "▶ Воспроизвести"}
							</button>
						{:else if fileType.startsWith("image/")}
							<img src={fileUrl} alt="Изображение" class="preview-image" />
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.preview-image {
		max-width: 100%;
		border-radius: 8px;
		box-shadow: 0 0 8px var(--shadow);
		margin-top: 0.6rem;
	}

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
		z-index: 2;
		overflow: hidden;
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

	.media-upload {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		word-break: break-word;
		overflow-wrap: anywhere;
	}

	.media-upload label {
		font-size: 1.3rem;
		color: var(--fg);
	}

	.media-upload input[type="file"] {
		font-size: 1.2rem;
		color: var(--fg);
		width: 100%;
		max-width: 100%;
	}

	.file-info {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		width: 100%;
		gap: 0.6rem;
		margin-top: 0.6rem;
	}

	.filename {
		font-size: 1.2rem;
		color: var(--fg);
		word-break: break-word;
		overflow-wrap: anywhere;
	}

	.play-btn {
		width: 100%;
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

	.play-btn:hover {
		background: var(--accent-light);
	}

	.error {
		color: var(--error-text);
		font-size: 1.2rem;
		margin-top: 0.5rem;
	}

	.status {
		font-size: 1.2rem;
		margin-top: 0.4rem;
		font-weight: 500;
	}

	.status.loading {
		color: var(--accent);
	}

	.status.success {
		color: green;
	}
</style>
