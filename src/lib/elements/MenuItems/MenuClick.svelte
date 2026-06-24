<script>
	import ApplyButton from "./General/ApplyButton.svelte";
	import InputGroup from "./Wrappers/InputGroup.svelte";
	import TextError from "../General/TextError.svelte";
	import Common from "./Wrappers/Common.svelte";

	let {
		icon,
		title,
		tooltipText,
		description,
		text,
		error,
		onClick = () => {},
	} = $props();
</script>

<Common {icon} {title} {tooltipText} {description}>
	<InputGroup>
		<ApplyButton {text} {error} onApply={onClick} />
		<TextError {error} />
	</InputGroup>
</Common>
