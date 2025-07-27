<script>
	export let supportedTypes = [];
	export let onChange = async () => {};
</script>

<div class="media-upload-wrapper">
	<label class="media-upload-label">
		<input
			class="media-upload-input"
			type="file"
			accept={supportedTypes.join(",")}
			on:change={onChange}
		/>
		<div class="media-upload-button">
			<span class="upload-icon">📁</span>
			<span class="upload-text">Выберите файл</span>
		</div>
	</label>
</div>

<style>
	.media-upload-wrapper {
		width: 100%;
	}

	.media-upload-label {
		display: block;
		width: 100%;
		cursor: pointer;
	}

	.media-upload-input {
		display: none;
	}

	.media-upload-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		padding: var(--spacing-xs) var(--spacing-xs);
		border-radius: var(--radius-lg);
	}

	.media-upload-button {
		background-color: var(--input-bg);
		color: var(--fg);
		border: 2px dashed var(--accent);
		transition: var(--transition);
	}

	.media-upload-button:hover {
		background-color: var(--bg-hover);
		border-style: solid;
		border-radius: var(--radius-lg);
		transform: translateY(-2px);
		box-shadow: var(--shadow-sm);
	}

	.media-upload-button:active {
		transform: translateY(0);
		border-radius: var(--radius-lg);
	}

	.upload-icon {
		font-size: 1.5rem;
	}

	.media-upload-button {
		font-family: var(--font-family-base);
		font-size: 1.2rem;
		font-weight: var(--font-weight-medium);
		line-height: var(--line-height-base);
		text-align: center;
	}

	.upload-text {
		color: var(--accent-light);
	}

	.media-upload-button {
		transition:
			background-color var(--transition),
			border-color var(--transition),
			border-radius 0.2s ease,
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.media-upload-input:focus + .media-upload-button {
		outline: 2px solid var(--accent-light);
		outline-offset: 2px;
		border-radius: var(--radius-lg);
	}
</style>
