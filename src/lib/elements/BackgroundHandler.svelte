<script>
	import { onMount } from "svelte";
	import { GlobalConfig } from "$lib/stores/parameters";
	import {
		detectFileTypeFromBase64,
		fileTypeFromUrl,
	} from "$lib/components/utils/MediaUtils";

	import BackgroundImage from "./Background/BackgroundImage.svelte";
	import BackgroundVideo from "./Background/BackgroundVideo.svelte";

	let mediaUrl = null;
	let mediaType = "unknown";
	let usingBackroundImage = GlobalConfig.get("usingBackroundImage");
	let isBackgroundLoading = false;

	async function setBackgroundSrc() {
		isBackgroundLoading = true;

		try {
			const mediaBlob = await GlobalConfig.getMedia("backgroundImage");
			if (mediaBlob) {
				mediaUrl = mediaBlob;
				mediaType = fileTypeFromUrl(mediaUrl);
			} else {
				mediaUrl = null;
				mediaType = "unknown";
			}
		} catch (error) {
			console.error("Error loading background media:", error);
			mediaUrl = null;
			mediaType = "unknown";
		} finally {
			isBackgroundLoading = false;
		}
	}

	onMount(async () => {
		GlobalConfig.subscribe(
			"backgroundImage",
			async (v) => await setBackgroundSrc(),
		);
		GlobalConfig.subscribe(
			"usingBackroundImage",
			(v) => (usingBackroundImage = v),
		);
		await setBackgroundSrc();
	});
</script>

{#if isBackgroundLoading}
	<div class="loading-overlay">
		<div class="loading-content">
			<div class="loading-text">Задний фон загружается...</div>
			<svg class="spinner" viewBox="0 0 50 50">
				<circle
					class="path"
					cx="25"
					cy="25"
					r="20"
					fill="none"
					stroke-width="5"
				></circle>
			</svg>
		</div>
	</div>
{/if}

{#if !isBackgroundLoading && mediaUrl && usingBackroundImage}
	{#if mediaType === "video"}
		<BackgroundVideo bind:url={mediaUrl} />
	{:else if mediaType === "image"}
		<BackgroundImage bind:url={mediaUrl} />
	{/if}
{/if}

<style>
	.loading-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 97.5%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		pointer-events: none;
		z-index: 9999;
	}

	.loading-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}

	.loading-text {
		font-size: 1.5rem;
		font-style: italic;
		color: #ccc;
		text-align: center;
	}

	.spinner {
		width: 60px;
		height: 60px;
		animation: rotate 2s linear infinite;
	}

	.spinner .path {
		stroke: #555;
		stroke-linecap: round;
		animation: dash 1.5s ease-in-out infinite;
	}

	@keyframes rotate {
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes dash {
		0% {
			stroke-dasharray: 1, 150;
			stroke-dashoffset: 0;
		}
		50% {
			stroke-dasharray: 90, 150;
			stroke-dashoffset: -35;
		}
		100% {
			stroke-dasharray: 90, 150;
			stroke-dashoffset: -124;
		}
	}
</style>
