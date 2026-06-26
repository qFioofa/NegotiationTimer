<script>
	import BackgroundHandler from "$lib/elements/BackgroundHandler.svelte";
	import BottomMenu from "$lib/elements/BottomMenu.svelte";
	import IntroGuide from "$lib/elements/IntroGuide.svelte";
	import PlayerComp from "$lib/elements/PlayerComp.svelte";
	import MobileApp from "$lib/elements/MobileApp.svelte";
	import { themeManager } from "$lib/cssStyles/themeHanager";
	import { GlobalConfig } from "$lib/stores/parameters";
	import Timer from "$lib/elements/Timer.svelte";
	import SettingsTrigger from "$lib/elements/Settings/SettingsTrigger.svelte";
	import ServerTrigger from "$lib/elements/Settings/ServerTrigger.svelte";
	import OnlineBadge from "$lib/elements/Settings/OnlineBadge.svelte";
	import { registerBinds } from "$lib/elements/Settings/settingsRegistry";
	import { onMount } from "svelte";

	let hideUI = GlobalConfig.get("hideAllUI");

	let isMobile = false;

	onMount(() => {
		themeManager.setTheme(GlobalConfig.get("theme"));
		themeManager.setAccent(GlobalConfig.get("accentColor"));
		registerBinds();

		const mq = window.matchMedia(
			"(max-width: 820px) and (orientation: portrait)",
		);
		const sync = () => (isMobile = mq.matches);
		sync();
		mq.addEventListener("change", sync);

		const offHide = GlobalConfig.subscribe(
			"hideAllUI",
			(v) => (hideUI = v),
		);
		return () => {
			mq.removeEventListener("change", sync);
			offHide();
		};
	});
</script>

<BackgroundHandler />

<IntroGuide />

{#if !hideUI}
	{#if isMobile}
		<MobileApp />
		<BottomMenu />
	{:else}
		<PlayerComp />
		<Timer />
		<BottomMenu />
	{/if}
{/if}

<SettingsTrigger />
<ServerTrigger />
<OnlineBadge />
