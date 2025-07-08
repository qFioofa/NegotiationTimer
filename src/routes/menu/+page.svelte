<script>
	import { onMount } from "svelte";
	import Menu from "$lib/elements/Menu.svelte";
	import themeManager from "$lib/cssStyles/themeHanager";

	onMount(() => {
		themeManager.setTheme("green");
	});
</script>

<Menu />
