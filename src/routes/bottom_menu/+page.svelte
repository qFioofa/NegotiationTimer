<script>
	import { onMount } from "svelte";
	import themeManager from "$lib/cssStyles/themeHanager";
	import BottomMenu from "$lib/elements/BottomMenu.svelte";

	onMount(() => {
		themeManager.setTheme("green");
	});
</script>

<BottomMenu title="Панель управления" />
