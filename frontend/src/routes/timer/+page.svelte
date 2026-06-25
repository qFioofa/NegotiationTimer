<script>
	if (import.meta.env.MODE === "production") {
		throw redirect(404, "/");
	}
	import Timer from "$lib/elements/Timer.svelte";
</script>

<Timer />
