<script>
	export let isOpen;
	export let ref;

	export let handleOpen = () => {};
</script>

<div class="menu-container">
	<button
		bind:this={ref}
		class="menu-button {isOpen ? 'menu-open' : ''}"
		on:click={handleOpen}
		aria-label={isOpen ? "Close menu" : "Open menu"}
	>
		<div class="menu-line"></div>
		<div class="menu-line"></div>
		<div class="menu-line"></div>
	</button>
</div>

<style>
	.menu-container {
		position: fixed;
		top: 2rem;
		right: 2rem;
		z-index: 1001;
	}

	.menu-button {
		width: 5rem;
		height: 5rem;
		border-radius: 50%;
		background: var(--bg);
		backdrop-filter: blur(12px);
		border: 2px solid var(--accent);
		box-shadow: 0 0 25px var(--shadow);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
		cursor: pointer;
		z-index: 1001;
	}

	.menu-button:hover {
		background-color: var(--bg);
		transform: none;
		box-shadow: none;

		transform: scale(1.08);
		box-shadow: 0 0 35px var(--shadow);
	}

	.menu-line {
		width: 2.4rem;
		height: 0.25rem;
		background: var(--accent);
		margin: 0.3rem 0;
		border-radius: 3px;
		transition: all 0.3s ease;
	}

	.menu-open .menu-line:nth-child(1) {
		transform: translateY(0.6rem) rotate(45deg);
	}

	.menu-open .menu-line:nth-child(2) {
		opacity: 0;
	}

	.menu-open .menu-line:nth-child(3) {
		transform: translateY(-0.6rem) rotate(-45deg);
	}
</style>
