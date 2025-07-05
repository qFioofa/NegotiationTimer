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
		padding: 2vh 2vw;
		position: relative;
		background: #000;
		border-radius: 0.75rem;
		box-shadow: 0 0 30px rgba(255, 255, 255, 0.05);
		color: white;
	}

	.player {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 30%;
	}

	.number {
		font-size: 10vh;
		font-weight: 900;
		color: #ff6600;
		text-shadow: 0 0 15px rgba(255, 102, 0, 0.5);
		margin-bottom: 1rem;
	}

	.name-input {
		width: 4rem;
		height: 4rem;
		border-radius: 50%;
		text-align: center;
		font-size: 1.1rem;
		color: white;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(6px);
		transition: all 0.3s ease;
		padding: 0 1rem;
		cursor: pointer;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.name-input:focus,
	.name-input:hover {
		width: 16ch;
		border-radius: 2rem;
		text-align: left;
		padding-left: 1.2rem;
		cursor: text;
	}

	.name-input:not(:placeholder-shown) {
		text-align: left;
		border-radius: 2rem;
		padding-left: 1.2rem;
	}

	.vs-divider {
		font-size: 2.5rem;
		font-weight: 700;
		color: #888;
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
			font-size: 2rem;
		}
	}
</style>
