<script>
	import ApplyButton from "./General/ApplyButton.svelte";
	import { GlobalConfig } from "$lib/stores/parameters";
	import InputGroup from "./Wrappers/InputGroup.svelte";
	import TextError from "../General/TextError.svelte";
	import Message from "./General/Message.svelte";
	import Encoder from "$lib/components/Encoder";
	import Common from "./Wrappers/Common.svelte";

	export let icon;
	export let title;
	export let tooltipText;

	export let text;

	export let value;
	let error;

	function generateFilename() {
		return `nTimerCfg${Encoder.generateRandomId()}.cfg`;
	}

	async function generateEncodedConfig() {
		return await Encoder.encode({
			static: GlobalConfig.getConfig(),
			media: await GlobalConfig.getAllMedia(),
		});
	}

	function downloadAsFile(content, filename) {
		const blob = new Blob([content], { type: "text/plain" });
		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		URL.revokeObjectURL(url);
	}

	async function encode() {
		error = "";
		try {
			const encoded = await generateEncodedConfig();
			const filename = generateFilename();
			downloadAsFile(encoded, filename);
			return `✅ Конфиг сохранён как ${filename}`;
		} catch (e) {
			console.error(e);
			return {
				value: null,
				error: "Ошибка при кодировании",
			};
		}
	}
</script>

<Common {icon} {title} {tooltipText}>
	<InputGroup>
		<ApplyButton bind:value {text} bind:error onApply={encode} />
		<Message bind:value />
		<TextError {error} />
	</InputGroup>
</Common>
