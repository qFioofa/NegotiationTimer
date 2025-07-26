<script>
	import ApplyButton from "./General/ApplyButton.svelte";
	import InputGroup from "./Wrappers/InputGroup.svelte";
	import TextError from "../General/TextError.svelte";
	import Common from "./Wrappers/Common.svelte";

	export let icon;
	export let title;
	export let tooltipText;
	export let text;
	export let error;

	export let onClick = () => {};
</script>

<Common {icon} {title} {tooltipText}>
	<InputGroup>
		<ApplyButton {text} {error} onApply={onClick} />
		<TextError {error} />
	</InputGroup>
</Common>
