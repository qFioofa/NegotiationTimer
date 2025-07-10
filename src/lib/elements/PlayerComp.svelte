<script>
	import { onMount } from "svelte";

	export let player1Name = "";
	export let player2Name = "";

	let input1Ref, input2Ref;
	let ghost1Ref, ghost2Ref;
	let wrapperRef;

	function updatePlayer1Name(e) {
		player1Name = e.target.value.slice(0, 40);
		updateWidths();
	}

	function updatePlayer2Name(e) {
		player2Name = e.target.value.slice(0, 40);
		updateWidths();
	}

	function updateWidths() {
		if (!ghost1Ref || !ghost2Ref || !input1Ref || !input2Ref || !wrapperRef) return;

		ghost1Ref.textContent = player1Name || "Имя игрока";
		ghost2Ref.textContent = player2Name || "Имя игрока";

		const padding = 32;
		const w1 = ghost1Ref.offsetWidth + padding;
		const w2 = ghost2Ref.offsetWidth + padding;

		input1Ref.style.width = `${w1}px`;
		input2Ref.style.width = `${w2}px`;
	}

	onMount(() => {
		updateWidths();
	});
</script>

<div class="players-wrapper" bind:this={wrapperRef}>
	<div class="player left">
		<div class="number">1</div>
		<input
			class="name-input"
			type="text"
			bind:this={input1Ref}
			placeholder="Имя игрока"
			value={player1Name}
			on:input={updatePlayer1Name}
			maxlength="40"
		/>
		<span class="ghost" bind:this={ghost1Ref}>Имя игрока</span>
	</div>

	<div class="player right">
		<div class="number">2</div>
		<input
			class="name-input"
			type="text"
			bind:this={input2Ref}
			placeholder="Имя игрока"
			value={player2Name}
			on:input={updatePlayer2Name}
			maxlength="40"
		/>
		<span class="ghost" bind:this={ghost2Ref}>Имя игрока</span>
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
		backdrop-filter: blur(12px);
		color: var(--fg);
		border: 1px solid var(--accent);
		transition: width 0.3s ease;
		width: 60.4%;
		max-width: 73.4%;
	}

	.player {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}

	.number {
		font-size: 50vh;
		font-weight: 900;
		color: var(--accent);
		text-shadow: 0 0 12px var(--shadow);
		margin-bottom: 1.2rem;
		user-select: none;
		line-height: 1;
	}

	.name-input {
		height: 5rem;
		border-radius: 2rem;
		text-align: center;
		font-size: 1.2rem;
		color: var(--input-fg);
		background: var(--input-bg);
		border: 2px solid var(--bg);
		backdrop-filter: blur(8px);
		transition: all 0.3s ease;
		padding: 0 1rem;
		box-shadow: 0 0 10px var(--shadow);
		min-width: 8ch;
	}

	.name-input:focus,
	.name-input:hover,
	.name-input:not(:placeholder-shown) {
		background: var(--input-bg);
		box-shadow: 0 0 16px var(--shadow);
	}

	.ghost {
		position: absolute;
		visibility: hidden;
		white-space: nowrap;
		font-size: 1.2rem;
		font-family: inherit;
		padding: 0 1rem;
	}

	.vs-divider {
		font-size: 10rem;
		font-weight: 800;
		color: var(--accent-light);
		text-shadow: 0 0 4px var(--shadow);
		user-select: none;
		width: 10%;
		text-align: center;
	}

	@media (max-width: 768px) {
		.players-wrapper {
			flex-direction: column;
			gap: 2rem;
			padding: 2rem 1rem;
			width: 95vw !important;
		}

		.player {
			width: 100%;
		}

		.vs-divider {
			width: auto;
			order: -1;
			font-size: 2.2rem;
		}

		.number {
			font-size: 26vh;
		}
	}
</style>
