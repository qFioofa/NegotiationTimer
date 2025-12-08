<div class="extra-buttons-wrapper">
	<slot />
</div>

<style>
	.extra-buttons-wrapper {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		align-content: center;
		justify-content: center;
		gap: var(--spacing-md);
		margin-left: 75px;
		height: 200px;
		max-height: 200px;
	}
</style>
