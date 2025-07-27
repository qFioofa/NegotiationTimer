<script>
	import { onTimerInputChange } from "$lib/components/utils/TimerUtils";

	export let value;
	export let placeHolder;
	export let maxLength;

	export let error;
	export let onInputChange = onTimerInputChange;
</script>

<input
	type="text"
	class="timer-text-input"
	bind:value
	on:input={e => {
		const _result = onInputChange(e.target.value);
		if (_result == null) return;

		if (typeof _result === "object") {
			value = _result.value;
			error = _result.error;
			return;
		}

		value = _result;
		error = null;
	}}
	placeholder={placeHolder}
	{...maxLength !== null ? { maxlength: maxLength } : {}}
	required
/>

<style>
	.timer-text-input {
		flex: 1;
		padding: var(--spacing-sm) var(--spacing-md);
		text-align: center;
		box-sizing: border-box;
	}

	.timer-text-input {
		background: var(--input-bg);
		color: var(--input-fg);
		border: 1px solid var(--input-border);
		border-radius: var(--radius-md);
	}

	.timer-text-input:focus {
		outline: none;
		border-color: var(--accent-light);
		box-shadow: 0 0 0 2px rgba(112, 140, 110, 0.2);
	}

	.timer-text-input::placeholder {
		color: var(--input-placeholder);
	}

	.timer-text-input:disabled {
		background: var(--bg-muted);
		color: var(--fg-disabled);
		cursor: not-allowed;
	}

	.timer-text-input {
		font-family: var(--font-family-base);
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-normal);
		line-height: var(--line-height-base);
		letter-spacing: var(--letter-spacing-normal);
	}

	.timer-text-input {
		transition: var(--transition);
	}

	.timer-text-input {
		appearance: none;
		-webkit-appearance: none;
		user-select: auto;
	}

	.timer-text-input.error {
		border-color: var(--danger);
		box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.2);
	}
</style>
