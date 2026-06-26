<script>
	import { Users } from "lucide-svelte";
</script>

<a class="server-trigger" href="/server" aria-label="Сервер">
	<Users size={28} />
</a>

<style>
	.server-trigger {
		position: fixed;
		top: var(--trigger-edge);
		right: calc(
			var(--trigger-edge) + 2 * (var(--trigger-size) + var(--trigger-gap))
		);
		z-index: 1001;
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--trigger-size);
		height: var(--trigger-size);
		padding: 0;
		border-radius: var(--radius-xxl);
		border: 2px solid var(--accent);
		box-shadow: 4px 4px 0 var(--accent-dark);
		background: var(--bg-overlay);
		color: var(--accent-light);
		backdrop-filter: blur(14px);
		cursor: pointer;
		user-select: none;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease,
			background 0.3s ease;
	}

	.server-trigger:hover {
		transform: scale(1.08);
		box-shadow: 6px 6px 0 var(--accent-dark);
	}

	.server-trigger:active {
		transform: scale(0.95);
		box-shadow: 2px 2px 0 var(--accent-dark);
	}

	@media (prefers-reduced-motion: reduce) {
		.server-trigger {
			transition: none;
		}
	}
</style>
