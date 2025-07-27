<script>
	import { ShuffleFunction, GlobalConfig } from "$lib/stores/parameters";
	import PlayerNumber from "./Players/Wrappers/PlayerNumber.svelte";
	import NameInput from "./Players/Wrappers/NameInput.svelte";
	import ElementShuffler from "$lib/components/Shuffle";
	import { onMount } from "svelte";

	let number1, number2;
	let input1Ref, input2Ref;
	let ghost1Ref, ghost2Ref;
	let wrapperRef;
	let shuffler;

	let playerBackground = GlobalConfig.get("playerBackground");

	function ShufflePlayers() {
		shuffler.launch();
	}

	onMount(() => {
		GlobalConfig.subscribe("playerBackground", v => (playerBackground = v));
		shuffler = new ElementShuffler([number1, number2]);
		ShuffleFunction.set(ShufflePlayers);
	});
</script>

<div class="players-wrapper {playerBackground ? '' : 'transparent'}">
	<div class="player left">
		<PlayerNumber text="1" bind:ref={number1} />
		<div class="input-wrapper">
			<NameInput />
		</div>
	</div>

	<div class="player right">
		<PlayerNumber text="2" bind:ref={number2} />
		<div class="input-wrapper">
			<NameInput />
		</div>
	</div>
</div>

<style>
	.players-wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 0 auto;
		padding: 2rem;
		background: var(--bg);
		border-radius: 1rem;
		box-shadow: 0 0 30px var(--shadow);
		color: var(--fg);
		border: 2px solid var(--accent);
		width: 60.4%;
		max-width: 73.4%;
		transition: var(--transition);
		box-shadow: 6px 6px 0 var(--accent-dark);
	}

	.transparent {
		background: transparent !important;
		border: none !important;
		box-shadow: none !important;
	}

	.player {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}

	.input-wrapper {
		flex-shrink: 0;
		width: fit-content;
	}

	@media (max-width: 768px) {
		.players-wrapper {
			flex-direction: column;
			gap: 2rem;
			padding: 2rem 1rem;
			width: 95vw !important;
		}
	}
</style>
