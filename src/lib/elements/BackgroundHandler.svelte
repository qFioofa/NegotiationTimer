<script>
	import { onMount, onDestroy } from "svelte";
	import { derived } from "svelte/store";
	import { GlobalConfig } from "$lib/stores/parameters";

	let usingBackgroundImage = derived(GlobalConfig, $cfg => $cfg.get("usingBackroundImage"));
	let backgroundImageUrl = null;
	let isVideo = false;
	let videoElement;
	let videoStyleElement;

	onMount(async () => {
		await initBackground();
	});

	async function initBackground() {
		const mediaBlob = await GlobalConfig.getMedia("backgroundImage");
		if (!mediaBlob) return;

		backgroundImageUrl = mediaBlob;
		updateBodyBackground();
	}

	function injectVideoStyles() {
		if (videoStyleElement) return;

		videoStyleElement = document.createElement("style");
		videoStyleElement.textContent = `
			.background-video {
				position: fixed;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				max-width: 100vw;
				max-height: 100vh;
				object-fit: contain;
				z-index: -1;
				pointer-events: none;
			}
		`;
		document.head.appendChild(videoStyleElement);
	}

	function removeVideoStyles() {
		if (videoStyleElement) {
			videoStyleElement.remove();
			videoStyleElement = null;
		}
	}

	function updateBodyBackground() {
		if (typeof document === "undefined" || !backgroundImageUrl) return;

		isVideo =
			backgroundImageUrl.startsWith("data:video/") ||
			/\.(mp4|webm|ogg)$/i.test(backgroundImageUrl.split("?")[0].split("#")[0]);
		if (isVideo) {
			removeBackgroundVideo();

			videoElement = document.createElement("video");
			videoElement.src = backgroundImageUrl;
			videoElement.autoplay = true;
			videoElement.loop = true;
			videoElement.muted = true;
			videoElement.playsInline = true;
			videoElement.className = "background-video";

			injectVideoStyles();
			document.body.appendChild(videoElement);
			document.body.classList.add("background-active");
		} else {
			removeBackgroundVideo();

			document.body.style.backgroundImage = `url(${backgroundImageUrl})`;
			document.body.style.backgroundSize = "cover";
			document.body.style.backgroundPosition = "center";
			document.body.style.backgroundRepeat = "no-repeat";
			document.body.classList.add("background-active");
		}
	}

	function removeBackgroundVideo() {
		if (videoElement) {
			videoElement.pause();
			videoElement.remove();
			videoElement = null;
		}
		removeVideoStyles();
	}

	onDestroy(() => {
		removeBackgroundVideo();
		if (typeof document !== "undefined") {
			document.body.style.backgroundImage = "";
			document.body.classList.remove("background-active");
		}
	});
</script>
