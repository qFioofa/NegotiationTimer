<script>
	import ApplyButton from "$lib/elements/BottomMenuItems/General/ApplyButton.svelte";
	import InputGroup from "$lib/elements/BottomMenuItems/Wrappers/InputGroup.svelte";
	import TimerInput from "$lib/elements/General/TimerInput.svelte";
	import TextError from "$lib/elements/General/TextError.svelte";
	import Common from "./Wrappers/Common.svelte";
	import { Minus, Plus } from "lucide-svelte";

	export let icon;
	export let title;
	export let description;

	export let value;
	export let placeHolder;
	export let maxLength;
	export let error = "";

	export let onIncrement = () => {};
	export let onDecrement = () => {};
</script>

<Common {icon} {title} {description}>
	<InputGroup>
		<ApplyButton bind:value bind:error onApply={onDecrement}><Minus size={16} /></ApplyButton>

		<TimerInput bind:value {placeHolder} {maxLength} bind:error />

		<ApplyButton bind:value bind:error onApply={onIncrement}><Plus size={16} /></ApplyButton>
	</InputGroup>
	<TextError bind:error />
</Common>
