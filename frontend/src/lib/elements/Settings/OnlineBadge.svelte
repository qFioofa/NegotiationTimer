<script>
	import { Users } from "lucide-svelte";
	import { joined, online } from "$lib/stores/room";
</script>

{#if $joined}
	<a class="badge" href="/server" title="Открыть меню комнаты">
		<Users size={18} />
		<span class="count">{$online}</span>
		<span class="label">в сети</span>
	</a>
{/if}

<style>
	.badge {
		position: fixed;
		top: calc(
			var(--trigger-edge) + var(--trigger-size) + var(--trigger-gap)
		);
		right: var(--trigger-edge);
		z-index: 1001;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		height: calc(var(--trigger-size) * 0.7);
		padding: 0 0.9rem;
		border-radius: var(--radius-xxl);
		border: 2px solid var(--accent);
		box-shadow: 4px 4px 0 var(--accent-dark);
		background: var(--bg-overlay);
		color: var(--accent-light);
		backdrop-filter: blur(14px);
		font-weight: 700;
		text-decoration: none;
		user-select: none;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.badge:hover {
		transform: translateY(-2px);
		box-shadow: 6px 6px 0 var(--accent-dark);
	}

	.count {
		font-size: 1.1rem;
		line-height: 1;
		color: var(--fg-heading);
		font-variant-numeric: tabular-nums;
	}

	.label {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--fg-muted);
	}

	@media (prefers-reduced-motion: reduce) {
		.badge {
			transition: none;
		}
	}
</style>
