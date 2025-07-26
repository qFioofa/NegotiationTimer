<script>
	import { onMount } from "svelte";
	import { GlobalConfig } from "$lib/stores/parameters";
	import { detectFileTypeFromBase64, fileTypeFromUrl } from "$lib/components/utils/MediaUtils";

	import BackgroundImage from "./Background/BackgroundImage.svelte";
	import BackgroundVideo from "./Background/BackgroundVideo.svelte";

	let mediaUrl = null;
	let mediaType = "unknown";
	let usingBackroundImage = GlobalConfig.get("usingBackroundImage");

	async function setBackgroundSrc() {
		const mediaBlob = await GlobalConfig.getMedia("backgroundImage");
		if (!mediaBlob) return;
		mediaUrl = mediaBlob;
		mediaType = fileTypeFromUrl(mediaUrl);
	}

	onMount(async () => {
		GlobalConfig.subscribe("backgroundImage", async v => await setBackgroundSrc());
		GlobalConfig.subscribe("usingBackroundImage", v => (usingBackroundImage = v));
		await setBackgroundSrc();
	});
</script>

{#if mediaUrl && usingBackroundImage}
	{#if mediaType === "video"}
		<BackgroundVideo bind:url={mediaUrl} />
	{:else if mediaType === "image"}
		<BackgroundImage bind:url={mediaUrl} />
	{/if}
{/if}
