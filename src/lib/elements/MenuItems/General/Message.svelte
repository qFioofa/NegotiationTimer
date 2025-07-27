<script>
	export let value;
</script>

{#if value}
	<p class="decoder-message">{value}</p>
{/if}

<style>
	.decoder-message {
		margin: 0;
		text-align: center;
		color: var(--success);
	}
</style>
