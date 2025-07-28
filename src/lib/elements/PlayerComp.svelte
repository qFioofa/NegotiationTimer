<script>
	import { ShuffleFunction, GlobalConfig } from "$lib/stores/parameters";
	import PlayerNumber from "./Players/Wrappers/PlayerNumber.svelte";
	import NameInput from "./Players/Wrappers/NameInput.svelte";
	import { shuffleMap } from "$lib/components/Shuffle";
	import { onMount } from "svelte";

	let number1, number2;
	let input1Ref, input2Ref;
	let ghost1Ref, ghost2Ref;
	let wrapperRef;

	let playerBackground = GlobalConfig.get("playerBackground");

	async function ShufflePlayers() {
		const _f = shuffleMap.get(GlobalConfig.get("shuffleAnimation"));
		if (_f) await _f(number1, number2);
	}

	onMount(() => {
		GlobalConfig.subscribe("playerBackground", v => (playerBackground = v));
		ShuffleFunction.set(ShufflePlayers);
	});
</script>

<div class="players-wrapper {playerBackground ? '' : 'transparent'}">
	<div class="grid-container">
		<div class="grid-item">
			<PlayerNumber text="1" bind:ref={number1} />
		</div>
		<div class="grid-item">
			<PlayerNumber text="2" bind:ref={number2} />
		</div>
		<div class="grid-item">
			<NameInput />
		</div>
		<div class="grid-item">
			<NameInput />
		</div>
	</div>
</div>

<style>
	.players-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin: 0 auto;
		padding: 2rem;
		background: var(--bg);
		border-radius: 1rem;
		box-shadow: 6px 6px 0 var(--accent-dark);
		color: var(--fg);
		border: 2px solid var(--accent);
		width: 60.4%;
		max-width: 73.4%;
		transition: var(--transition);
	}

	.transparent {
		background: transparent !important;
		border: none !important;
		box-shadow: none !important;
	}

	.grid-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: auto auto;
		gap: 0rem 28rem;
		width: 100%;
		justify-items: center;
		align-items: center;
	}

	.grid-item:nth-child(1) {
		grid-column: 1;
		grid-row: 1;
	}

	.grid-item:nth-child(2) {
		grid-column: 2;
		grid-row: 1;
	}

	.grid-item:nth-child(3) {
		grid-column: 1;
		grid-row: 2;
	}

	.grid-item:nth-child(4) {
		grid-column: 2;
		grid-row: 2;
	}

	@media (max-width: 768px) {
		.players-wrapper {
			padding: 2rem 1rem;
			width: 95vw !important;
		}

		.grid-container {
			gap: 1.5rem 2rem;
		}
	}
</style>
