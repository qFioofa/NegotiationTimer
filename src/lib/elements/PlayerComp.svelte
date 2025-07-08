<script>
	export let player1Name = "";
	export let player2Name = "";

	function updatePlayer1Name(e) {
		player1Name = e.target.value.slice(0, 40);
		e.target.style.width = `${Math.max(8, e.target.value.length * 0.65 + 4)}ch`;
	}

	function updatePlayer2Name(e) {
		player2Name = e.target.value.slice(0, 40);
		e.target.style.width = `${Math.max(8, e.target.value.length * 0.65 + 4)}ch`;
	}
</script>

<div class="players-wrapper">
	<div class="player left">
		<div class="number">1</div>
		<input
			class="name-input"
			type="text"
			placeholder="Имя игрока"
			value={player1Name}
			on:input={updatePlayer1Name}
			maxlength="40"
		/>
	</div>

	<div class="vs-divider">VS</div>

	<div class="player right">
		<div class="number">2</div>
		<input
			class="name-input"
			type="text"
			placeholder="Имя игрока"
			value={player2Name}
			on:input={updatePlayer2Name}
			maxlength="40"
		/>
	</div>
</div>

<style>
	.players-wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		max-width: 1024px;
		margin: 0 auto;
		padding: 2rem;
		background: var(--bg);
		border-radius: 1rem;
		box-shadow: 0 0 30px var(--shadow);
		backdrop-filter: blur(12px);
		color: var(--fg);
		border: 1px solid var(--accent);
	}

	.player {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 30%;
	}

	.number {
		font-size: 36vh;
		font-weight: 900;
		color: var(--accent);
		text-shadow: 0 0 12px var(--shadow);
		margin-bottom: 1.2rem;
		user-select: none;
		line-height: 1;
	}

	.name-input {
		width: 7rem;
		height: 5rem;
		border-radius: 20%;
		text-align: center;
		font-size: 1.2rem;
		color: var(--input-fg);
		background: var(--input-bg);
		border: 2px solid var(--bg);
		backdrop-filter: blur(8px);
		transition: all 0.3s ease;
		padding: 0 1rem;
		cursor: pointer;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		box-shadow: 0 0 10px var(--shadow);
	}

	.name-input:focus,
	.name-input:hover,
	.name-input:not(:placeholder-shown) {
		width: 18ch;
		border-radius: 2rem;
		padding-left: 1rem;
		cursor: text;
		background: var(--input-bg);
		box-shadow: 0 0 16px var(--shadow);
	}

	.vs-divider {
		font-size: 3rem;
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
