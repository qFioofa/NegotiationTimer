<script>
	import { onMount, onDestroy } from "svelte";

	export let url;

	const originalStyles = {
		backgroundImage: "",
		backgroundSize: "",
		backgroundPosition: "",
		backgroundRepeat: "",
	};

	function removeBackground() {
		if (typeof document === "undefined") return;

		document.body.style.backgroundImage = originalStyles.backgroundImage;
		document.body.style.backgroundSize = originalStyles.backgroundSize;
		document.body.style.backgroundPosition = originalStyles.backgroundPosition;
		document.body.style.backgroundRepeat = originalStyles.backgroundRepeat;
		document.body.classList.remove("background-active");
	}

	function applyBackground() {
		if (typeof document === "undefined" || !url) return;

		removeBackground();

		document.body.style.backgroundImage = `url(${url})`;
		document.body.style.backgroundSize = "cover";
		document.body.style.backgroundPosition = "center";
		document.body.style.backgroundRepeat = "no-repeat";
		document.body.classList.add("background-active");
	}

	$: url, applyBackground();

	onMount(() => {
		originalStyles.backgroundImage = document.body.style.backgroundImage;
		originalStyles.backgroundSize = document.body.style.backgroundSize;
		originalStyles.backgroundPosition = document.body.style.backgroundPosition;
		originalStyles.backgroundRepeat = document.body.style.backgroundRepeat;
		applyBackground();
	});

	onDestroy(removeBackground);
</script>
