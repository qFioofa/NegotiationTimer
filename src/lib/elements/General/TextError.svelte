<script>
	export let error;
</script>

{#if error}
	<div class="error">
		{error}
	</div>
{/if}

<style>
	.error {
		color: var(--danger);
		font-size: 0.9rem;
		margin-left: 5px;
	}
</style>
