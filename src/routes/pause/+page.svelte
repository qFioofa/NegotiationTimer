<script lang="ts">
	import { isPaused, togglePause } from "$lib/components/Pause";
	import Pause from "$lib/elements/Pause.svelte";
</script>

<Pause />

<button on:click={togglePause} class="pause-button">
	{$isPaused ? "Продолжить" : "Пауза"}
</button>

<div class="dummy-element">
	Этот элемент должен быть виден, когда пауза выключена, и частично виден сквозь overlay, когда
	пауза включена
</div>

<style>
	.pause-button {
		position: fixed;
		top: 20px;
		right: 20px;
		z-index: 1000;
		padding: 8px 16px;
		background: var(--accent);
		color: rgb(255, 0, 0);
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	.dummy-element {
		padding: 20px;
		margin: 50px auto;
		max-width: 600px;
		background: #f0f0f0;
		border: 1px solid #ccc;
		border-radius: 8px;
	}
</style>
