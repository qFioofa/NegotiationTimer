<script>
	import { onMount } from "svelte";
	import BottomMenu from "$lib/elements/BottomMenu.svelte";
	import Menu from "$lib/elements/Menu.svelte";
	import PlayerComp from "$lib/elements/PlayerComp.svelte";
	import Timer from "$lib/elements/Timer.svelte";
	import themeManager from "$lib/cssStyles/themeHanager";
	import { GlobalConfig } from "$lib/stores/parameters";

	onMount(() => {
		themeManager.setTheme(GlobalConfig.get("theme"));
	});
</script>

<PlayerComp />

<BottomMenu title="Панель управления" />

<Timer />

<Menu />
