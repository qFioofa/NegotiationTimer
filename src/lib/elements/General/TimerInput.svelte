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
	.timer-text-input[type="text"] {
		flex: 1;
		padding: 0.4rem 0.8rem;
		font-size: 1rem;
		border: 1px solid var(--accent);
		border-radius: 8px;
		background: var(--input-bg);
		color: var(--fg);
		text-align: center;
		font-family: monospace;
	}
</style>
