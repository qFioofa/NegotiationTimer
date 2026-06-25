<script>
	import ApplyButton from "$lib/elements/BottomMenuItems/General/ApplyButton.svelte";
	import InputGroup from "$lib/elements/BottomMenuItems/Wrappers/InputGroup.svelte";
	import Common from "$lib/elements/BottomMenuItems/Wrappers/Common.svelte";
	import TimerInput from "$lib/elements/General/TimerInput.svelte";
	import TextError from "$lib/elements/General/TextError.svelte";
	import { Check } from "lucide-svelte";

	let {
		icon,
		title,
		description,
		value = $bindable(),
		placeHolder,
		maxLength,
		applyButton = true,
		error = $bindable(""),
		onApply = () => {},
	} = $props();
</script>

<Common {icon} {title} {description}>
	<InputGroup>
		<TimerInput bind:value {placeHolder} {maxLength} bind:error />
		{#if applyButton}
			<ApplyButton bind:value bind:error {onApply}>
				<Check size={16} />
			</ApplyButton>
		{/if}
	</InputGroup>
	<TextError {error} />
</Common>
