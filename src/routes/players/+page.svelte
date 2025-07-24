<script>
	if (import.meta.env.MODE === "production") {
		throw redirect(404, "/");
	}
	import PlayerComp from "$lib/elements/PlayerComp.svelte";
</script>

<PlayerComp />
