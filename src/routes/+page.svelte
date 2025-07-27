<script>
	import BackgroundHandler from "$lib/elements/BackgroundHandler.svelte";
	import BottomMenu from "$lib/elements/BottomMenu.svelte";
	import IntroGuide from "$lib/elements/IntroGuide.svelte";
	import PlayerComp from "$lib/elements/PlayerComp.svelte";
	import { themeManager } from "$lib/cssStyles/themeHanager";
	import { GlobalConfig } from "$lib/stores/parameters";
	import Timer from "$lib/elements/Timer.svelte";
	import Menu from "$lib/elements/Menu.svelte";
	import { onMount } from "svelte";

	onMount(() => {
		themeManager.setTheme(GlobalConfig.get("theme"));
	});
</script>

<BackgroundHandler />

<IntroGuide />

<PlayerComp />

<BottomMenu />

<Timer />

<Menu />
