<script>
	import "$lib/cssStyles/global.css";
	import "$lib/cssStyles/themes.css";
	import { onMount } from "svelte";
	import { initRoomSync } from "$lib/stores/roomSync";

	let { children } = $props();

	// Подключаем шину синхронизации комнаты один раз на всё приложение.
	onMount(initRoomSync);
</script>

{@render children()}

<svelte:head>
	<link
		rel="icon"
		type="image/png"
		sizes="96x96"
		href="/icon/favicon-96x96.png"
	/>
	<link rel="apple-touch-icon" href="/icon/apple-touch-icon.png" />
</svelte:head>
