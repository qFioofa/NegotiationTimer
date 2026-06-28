<script lang="ts">
	import { fly } from "svelte/transition";
	import { notifications } from "$lib/stores/room";
</script>

<div class="toasts">
	{#each $notifications as n (n.id)}
		<div class="toast" transition:fly={{ x: -20, duration: 200 }}>
			{n.text}
		</div>
	{/each}
</div>

<style>
	.toasts {
		position: fixed;
		top: var(--trigger-edge);
		left: var(--trigger-edge);
		z-index: 1002;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		max-width: min(20rem, calc(100vw - 2 * var(--trigger-edge)));
		pointer-events: none;
	}

	.toast {
		padding: 0.7rem 1rem;
		border-radius: var(--radius-lg);
		border: 2px solid var(--accent);
		box-shadow: 4px 4px 0 var(--accent-dark);
		background: var(--bg-overlay);
		color: var(--fg-heading);
		backdrop-filter: blur(14px);
		font-weight: 700;
		font-size: 0.95rem;
	}
</style>
