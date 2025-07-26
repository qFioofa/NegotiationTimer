<script>
	import { onMount, onDestroy } from "svelte";

	export let url;

	let videoElement = null;
	let styleElement = null;

	function removeBackground() {
		if (videoElement) {
			videoElement.pause();
			videoElement.remove();
			videoElement = null;
		}
		document.body.classList.remove("background-active");
	}

	function injectStyles() {
		if (styleElement) return;

		styleElement = document.createElement("style");
		styleElement.textContent = `
			.background-video {
				position: fixed;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				min-width: 100%;
				min-height: 100%;
				width: auto;
				height: auto;
				object-fit: cover;
				z-index: -1;
				pointer-events: none;
			}

			body.background-active {
				overflow: hidden;
			}
		`;
		document.head.appendChild(styleElement);
	}

	function createBackground() {
		if (typeof document === "undefined" || !url) return;

		removeBackground();

		videoElement = document.createElement("video");
		videoElement.src = url;
		videoElement.autoplay = true;
		videoElement.loop = true;
		videoElement.muted = true;
		videoElement.playsInline = true;
		videoElement.className = "background-video";

		videoElement.onerror = () => {
			removeBackground();
		};

		videoElement.onloadeddata = () => {
			videoElement.play().catch(e => {
				console.warn("Autoplay blocked:", e);
			});
		};

		document.body.appendChild(videoElement);
		document.body.classList.add("background-active");
	}

	$: if (url) {
		createBackground();
	} else {
		removeBackground();
	}

	onMount(() => {
		injectStyles();
		if (url) createBackground();
	});

	onDestroy(() => {
		removeBackground();
		if (styleElement) {
			styleElement.remove();
			styleElement = null;
		}
	});
</script>
