<div class="extra-buttons-wrapper">
	<slot />
</div>

<style>
	.extra-buttons-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-md);
		margin-left: var(--spacing-xl);
	}
</style>
