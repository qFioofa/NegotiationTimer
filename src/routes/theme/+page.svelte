<script>
	if (import.meta.env.MODE === "production") {
		throw redirect(404, "/");
	}
	import { onMount } from "svelte";
	import themeManager from "$lib/cssStyles/themeHanager";
	import Timer from "$lib/elements/Timer.svelte";

	function switchTheme(name) {
		themeManager.setTheme(name);
	}

	onMount(() => {
		themeManager.setTheme("green");
	});
</script>

<div>
	<button on:click={() => switchTheme("green")}>Зелёная тема</button>
	<button on:click={() => switchTheme("brown")}>Оранжевая тема</button>
	<button on:click={() => switchTheme("red")}>Красная тема</button>
	<button on:click={() => switchTheme("blue")}>Синяя тема</button>
	<button on:click={() => switchTheme("cyan")}>Голубая тема</button>
	<button on:click={() => switchTheme("pink")}>Розовая тема</button>
	<button on:click={() => switchTheme("grey")}>Серая тема</button>
</div>

<Timer />
