<script>
	import { onDestroy } from "svelte";
	import { derived } from "svelte/store";
	import { GlobalConfig } from "$lib/stores/parameters";

	let usingBackroundImage = derived(GlobalConfig, $cfg => $cfg.get("usingBackroundImage"));
	let backgroundImageUrl = null;

	function updateBodyBackground() {
		if (typeof document === "undefined") return;

		const saved = GlobalConfig.get("backgroundImage");
		if (usingBackroundImage && saved) {
			backgroundImageUrl = `url(${saved})`;
			document.body.style.backgroundImage = backgroundImageUrl;
			document.body.style.backgroundSize = "cover";
			document.body.style.backgroundPosition = "center";
			document.body.style.backgroundRepeat = "no-repeat";
			document.body.classList.add("background-active");
		} else {
			backgroundImageUrl = null;
			document.body.style.backgroundImage = "";
			document.body.classList.remove("background-active");
		}
	}

	$: updateBodyBackground();

	onDestroy(() => {
		if (typeof document !== "undefined") {
			document.body.style.backgroundImage = "";
			document.body.classList.remove("background-active");
		}
	});
</script>
