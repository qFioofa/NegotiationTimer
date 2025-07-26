<script>
	import { handleFileUpload, extractFilenameFromUrl } from "$lib/components/utils/MediaUtils";
	import MediaUpload from "./General/MediaUpload.svelte";
	import InputGroup from "./Wrappers/InputGroup.svelte";
	import { GlobalConfig } from "$lib/stores/parameters";
	import TextError from "../General/TextError.svelte";
	import MediaView from "./General/MediaView.svelte";
	import Message from "./General/Message.svelte";
	import Common from "./Wrappers/Common.svelte";
	import { onMount } from "svelte";

	export let icon;
	export let title;
	export let tooltipText;

	export let supportedTypes;
	export let configKey;

	let fileUrl = null;
	let fileName = null;

	let loading = false;
	let loaded = false;
	let error;

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

	onMount(async () => {
		const media = await GlobalConfig.getMedia(configKey);
		if (!media) return;
		fileUrl = media;
	});
</script>

<Common {icon} {title} {tooltipText}>
	<InputGroup>
		<div class="media-upload">
			<MediaUpload {supportedTypes} {onChange} />
			{#if loading}
				<div class="status loading">Загрузка...</div>
			{:else if loaded}
				<Message value="Файл загружен и сохранён" />
			{/if}

			{#if fileUrl}
				<div class="file-info">
					<div class="filename">{fileName}</div>
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
		text-align: center;
		word-break: break-word;
		overflow-wrap: anywhere;
	}
</style>
