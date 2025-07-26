<script>
	import { fileTypeFromUrl } from "$lib/components/utils/MediaUtils";
	import TextError from "$lib/elements/General/TextError.svelte";

	export let fileUrl;

	let fileType = "unknown";
	let audio = null;
	let isPlaying = false;
	let error;

	$: if (fileUrl) {
		fileType = fileTypeFromUrl(fileUrl);

		if (audio) {
			audio.pause();
			audio = null;
			isPlaying = false;
		}

		if (fileType === "audio") {
			audio = new Audio(fileUrl);
			audio.loop = true;
			audio.onended = () => (isPlaying = false);
			isPlaying = false;
		}
	}

	function playAudio() {
		if (!audio) {
			error = "Ошибка в воспроизведении аудио.";
			return;
		}

		if (isPlaying) {
			audio.pause();
			audio.currentTime = 0;
			isPlaying = false;
		} else {
			audio.play();
			isPlaying = true;
		}
	}
</script>

{#if fileType === "audio"}
	<button class="play-button" on:click={playAudio}>
		{isPlaying ? "■ Остановить" : "▶ Воспроизвести"}
	</button>
{:else if fileType === "image"}
	<img src={fileUrl} alt="Изображение" class="preview-image" />
{:else if fileType === "video"}
	<video class="preview-video" controls>
		<source src={fileUrl} type="video/mp4" />
		<track kind="captions" src="" label="empty captions" />
		Ваш браузер не поддерживает видео.
	</video>
{:else}
	<TextError {error} />
{/if}

<style>
	.play-button {
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

	.play-button:hover {
		background: var(--accent-light);
	}

	.preview-image,
	.preview-video {
		max-width: 100%;
		border-radius: 8px;
		box-shadow: 0 0 8px var(--shadow);
		margin-top: 0.6rem;
	}
</style>
