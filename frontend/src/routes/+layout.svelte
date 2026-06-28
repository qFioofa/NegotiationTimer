<script>
	import "$lib/cssStyles/global.css";
	import "$lib/cssStyles/themes.css";
	import { onMount } from "svelte";
	import { initRoomSync } from "$lib/stores/roomSync";
	import Notifications from "$lib/elements/Notifications.svelte";

	let { children } = $props();

	onMount(initRoomSync);
</script>

{@render children()}
<Notifications />

<svelte:head>
	<link
		rel="icon"
		type="image/png"
		sizes="96x96"
		href="/icon/favicon-96x96.png"
	/>
	<link rel="apple-touch-icon" href="/icon/apple-touch-icon.png" />
</svelte:head>
