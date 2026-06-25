<script>
	import {
		handleFileUpload,
		extractFilenameFromUrl,
		fileTypeFromUrl,
	} from "$lib/components/utils/MediaUtils";
	import MediaUpload from "./General/MediaUpload.svelte";
	import InputGroup from "./Wrappers/InputGroup.svelte";
	import { GlobalConfig } from "$lib/stores/parameters";
	import TextError from "../General/TextError.svelte";
	import MediaView from "./General/MediaView.svelte";
	import Message from "./General/Message.svelte";
	import Common from "./Wrappers/Common.svelte";
	import { onMount } from "svelte";

	let { icon, title, tooltipText, description, supportedTypes, configKey } =
		$props();

	let fileUrl = $state(null);
	let fileName = null;

	let loading = $state(false);
	let loaded = $state(false);
	let error = $state();

	// Аудио воспроизводится под загрузкой (балансная колонка), а картинка/видео
	// показываются в правой зоне-превью.
	let isAudio = $derived(fileUrl ? fileTypeFromUrl(fileUrl) === "audio" : false);

	async function onChange(event) {
		loading = true;
		loaded = false;

		const _result = await handleFileUpload(event, supportedTypes);

		if (_result.error) {
			error = _result.error;
			loading = false;
			return;
		}

		fileUrl = _result.fileUrl;
		fileName = _result.fileName;
		GlobalConfig.setMedia(configKey, fileUrl);

		loading = false;
		loaded = true;
		error = "";
	}

	async function onDelete() {
		await GlobalConfig.deleteMedia(configKey);
		fileUrl = null;
		fileName = null;
		loaded = false;
		error = "";
	}

	onMount(async () => {
		const media = await GlobalConfig.getMedia(configKey);
		if (!media) return;
		fileUrl = media;
	});
</script>

<Common {icon} {title} {tooltipText} {description}>
	{#snippet preview()}
		{#if fileUrl && !isAudio}
			<div class="file-info">
				<MediaView {fileUrl}></MediaView>
			</div>
		{/if}
	{/snippet}

	<InputGroup>
		<div class="media-upload">
			<MediaUpload {supportedTypes} {onChange} />
			{#if fileUrl}
				<button class="delete-media" onclick={onDelete}>
					🗑 Удалить медиа
				</button>
			{/if}
			{#if loading}
				<div class="loading">Загрузка...</div>
			{:else if loaded}
				<Message value="Файл загружен и сохранён" />
			{/if}

			{#if fileUrl && isAudio}
				<div class="file-info">
					<MediaView {fileUrl}></MediaView>
				</div>
			{/if}

			<TextError {error} />
		</div>
	</InputGroup>
</Common>

<style>
	.media-upload {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		word-break: break-word;
		overflow-wrap: anywhere;
	}

	.delete-media {
		padding: var(--spacing-xs) var(--spacing-xs);
		border: 1px solid var(--danger, #a04e4e);
		border-radius: var(--radius-lg);
		background: var(--input-bg);
		color: var(--danger, #a04e4e);
		font-family: var(--font-family-base);
		font-size: 1rem;
		cursor: pointer;
		transition: var(--transition);
	}

	.delete-media:hover {
		background: var(--bg-hover);
	}

	.loading {
		color: var(--warning);
		display: flex;
		flex-direction: column;
		align-items: stretch;
		width: 100%;
		gap: 0.6rem;
		margin-top: 0.6rem;
	}

	.file-info {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		width: 100%;
		gap: 0.6rem;
		margin-top: 0.6rem;
	}
</style>
