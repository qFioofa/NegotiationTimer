<script>
	import { onMount } from "svelte";

	function goHome() {
		window.location.href = "/";
	}

	onMount(() => {
		document.body.style.backgroundColor = "#8B0000";
		document.body.style.background = "linear-gradient(135deg, #8B0000 0%, #450000 100%)";

		createParticles();

		return () => {
			document.body.style.backgroundColor = "";
			document.body.style.background = "";
		};
	});
</script>

<div class="container">
	<div class="decoration">
		<div class="grid-line vertical" style="left: 50%;"></div>
		<div class="grid-line horizontal" style="top: 50%;"></div>
	</div>

	<div class="top-left">
		<div class="error-404">404</div>
	</div>

	<div class="bottom-right">
		<h1 class="error-title">Куда мы попали?</h1>
		<p class="error-message">Кажется, что нужно вернуться на главную страницу.</p>
		<button on:click={goHome}>Вернуться на главную</button>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		min-height: 100vh;
		overflow: hidden;
		font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
		background: linear-gradient(135deg, var(--error-black) 0%, #450000 100%);
		color: #fff;
		transition: background 0.5s ease;
	}

	.container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		height: 100vh;
		position: relative;
	}

	.top-left {
		grid-column: 1;
		grid-row: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.error-404 {
		font-size: 15rem;
		font-weight: 800;
		color: black;
		opacity: 0;
		animation: appear 1.2s forwards 0.5s;
		position: relative;
		z-index: 2;
	}

	.bottom-right {
		grid-column: 2;
		grid-row: 2;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		padding: 0 0 15% 15%;
		opacity: 0;
		animation: slideIn 1.2s forwards 1s;
	}

	.error-title {
		font-size: 3rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
		color: white;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.error-message {
		font-size: 1.4rem;
		color: rgba(255, 255, 255, 0.85);
		max-width: 500px;
		line-height: 1.6;
	}

	.decoration {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		pointer-events: none;
		overflow: hidden;
		z-index: 1;
	}

	.grid-line {
		position: absolute;
		background: rgba(255, 255, 255, 0.1);
	}

	.grid-line.vertical {
		width: 1px;
		height: 100%;
		left: 50%;
	}

	.grid-line.horizontal {
		width: 100%;
		height: 1px;
		top: 50%;
	}

	button {
		font-family: inherit;
		cursor: pointer;
		background: black;
		color: var(--error-black);
		border: none;
		padding: 0.8rem 1.8rem;
		border-radius: 0.8rem;
		transition: all 0.3s ease;
		font-size: 1.1rem;
		font-weight: 600;
		margin-top: 1.5rem;
		position: relative;
		overflow: hidden;
		z-index: 2;
	}

	button:hover {
		transform: translateY(-3px);
	}

	button:active {
		transform: translateY(1px);
	}

	@keyframes appear {
		0% {
			opacity: 0;
			transform: scale(0.8);
		}
		60% {
			opacity: 1;
			transform: scale(1.1);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes slideIn {
		0% {
			opacity: 0;
			transform: translateX(100px);
		}
		100% {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes float {
		0% {
			transform: translate(0, 0) rotate(0deg);
		}
		100% {
			transform: translate(100px, 100vh) rotate(360deg);
		}
	}

	@media (max-width: 768px) {
		.container {
			grid-template-columns: 1fr;
			grid-template-rows: 1fr 1fr;
		}

		.top-left {
			grid-column: 1;
			grid-row: 1;
		}

		.bottom-right {
			grid-column: 1;
			grid-row: 2;
			padding: 0 10%;
			align-items: center;
			text-align: center;
		}

		.error-404 {
			font-size: 10rem;
		}

		.error-title {
			font-size: 2.2rem;
		}

		.error-message {
			font-size: 1.1rem;
		}
	}
</style>
