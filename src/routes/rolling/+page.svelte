<script>
	import { redirect } from "@sveltejs/kit";
	if (import.meta.env.MODE === "production") {
		throw redirect(404, "/");
	}
	import RollingDigit from "$lib/elements/Timer/RollingDigit.svelte";

	let currentDigit = 5;
	let fontSize = 300;

	function increment() {
		currentDigit = (currentDigit + 1) % 10;
	}

	function decrement() {
		currentDigit = (currentDigit - 1 + 10) % 10;
	}

	function randomDigit() {
		currentDigit = Math.floor(Math.random() * 10);
	}
</script>

<div class="demo-container">
	<div class="display-area">
		<div class="digit-wrapper">
			<RollingDigit bind:digit={currentDigit} bind:fontSize />
		</div>
	</div>

	<div class="controls">
		<button on:click={decrement} class="btn">−</button>
		<button on:click={randomDigit} class="btn">🎲</button>
		<button on:click={increment} class="btn">+</button>
	</div>
</div>

<style>
	.demo-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		width: 100vw;
		background-color: var(--bg);
		color: var(--fg);
		font-family: var(--font-family-base);
		overflow: hidden;
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	.display-area {
		flex-grow: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		background-color: var(--accent);
		padding: 1rem;
	}

	.digit-wrapper {
		color: var(--input-bg);
		font-weight: var(--font-weight-bold);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.controls {
		display: flex;
		justify-content: center;
		gap: 2rem;
		padding: 2rem;
		width: 100%;
		background-color: var(--bg-card);
		border-top: 1px solid var(--border);
	}

	.btn {
		padding: 1rem 2rem;
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-bold);
		font-family: var(--font-family-base);
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		background: var(--bg-muted);
		color: var(--fg);
		box-shadow: 0 4px 0 var(--bg-hover);
		transition: var(--transition);
		user-select: none;
		min-height: 50px;
		min-width: 50px;
	}

	.btn:hover:not(:disabled) {
		background: var(--bg-hover);
		box-shadow: 0 6px 0 var(--bg-hover);
		transform: translateY(-2px);
	}

	.btn:active:not(:disabled) {
		transform: translateY(4px);
		box-shadow: 0 0 0 var(--bg-hover);
		transition:
			transform 0.1s ease,
			box-shadow 0.1s ease;
	}

	.btn:focus {
		outline: 2px solid var(--accent-light);
		outline-offset: 2px;
	}
</style>
