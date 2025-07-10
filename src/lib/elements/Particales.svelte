<script>
	import { onMount, onDestroy } from "svelte";
	import ParticleSystem from "./ParticleSystem.js";

	let canvas;
	let ps;

	onMount(() => {
		ps = new ParticleSystem(canvas);
		ps.start();

		canvas.addEventListener("click", () => {
			const active = ps.toggleEmission();
			if (active) {
				ps.createParticles(20);
			}
		});
	});

	onDestroy(() => {
		if (ps) {
			ps.reset();
		}
	});
</script>

<canvas bind:this={canvas} class="particle-canvas" />

<style>
	.particle-canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
		pointer-events: auto;
	}
</style>
