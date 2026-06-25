<script>
	import BackgroundHandler from "$lib/elements/BackgroundHandler.svelte";
	import BottomMenu from "$lib/elements/BottomMenu.svelte";
	import IntroGuide from "$lib/elements/IntroGuide.svelte";
	import PlayerComp from "$lib/elements/PlayerComp.svelte";
	import { themeManager } from "$lib/cssStyles/themeHanager";
	import { GlobalConfig } from "$lib/stores/parameters";
	import Timer from "$lib/elements/Timer.svelte";
	import SettingsTrigger from "$lib/elements/Settings/SettingsTrigger.svelte";
	import { registerBinds } from "$lib/elements/Settings/settingsRegistry";
	import { onMount } from "svelte";

	let hideUI = GlobalConfig.get("hideAllUI");

	onMount(() => {
		themeManager.setTheme(GlobalConfig.get("theme"));
		themeManager.setAccent(GlobalConfig.get("accentColor"));
		registerBinds();

		return GlobalConfig.subscribe("hideAllUI", (v) => (hideUI = v));
	});
</script>

<BackgroundHandler />

<IntroGuide />

{#if !hideUI}
	<PlayerComp />

	<Timer />
{/if}

<BottomMenu />

<SettingsTrigger />
