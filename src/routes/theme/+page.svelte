<script>
	if (import.meta.env.MODE === "production") {
		throw redirect(404, "/");
	}
	import { onMount } from "svelte";
	import { themeManager } from "$lib/cssStyles/themeHanager";
	import Timer from "$lib/elements/Timer.svelte";

	function switchTheme(name) {
		themeManager.setTheme(name);
	}

	onMount(() => {
		themeManager.setTheme("green");
	});
</script>

<div>
	<button onclick={() => switchTheme("green")}>Зелёная тема</button>
	<button onclick={() => switchTheme("brown")}>Оранжевая тема</button>
	<button onclick={() => switchTheme("red")}>Красная тема</button>
	<button onclick={() => switchTheme("blue")}>Синяя тема</button>
	<button onclick={() => switchTheme("cyan")}>Голубая тема</button>
	<button onclick={() => switchTheme("pink")}>Розовая тема</button>
	<button onclick={() => switchTheme("grey")}>Серая тема</button>
</div>

<Timer />
