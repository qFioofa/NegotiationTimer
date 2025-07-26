<script>
	import { handleFileUpload } from "$lib/components/utils/MediaUtils";
	import MediaUpload from "./General/MediaUpload.svelte";
	import ApplyButton from "./General/ApplyButton.svelte";
	import InputGroup from "./Wrappers/InputGroup.svelte";
	import { GlobalConfig } from "$lib/stores/parameters";
	import TextError from "../General/TextError.svelte";
	import Message from "./General/Message.svelte";
	import Encoder from "$lib/components/Encoder";
	import Common from "./Wrappers/Common.svelte";

	export let icon;
	export let title;
	export let tooltipText;
	export let delay = 500;

	export let value;
	let error;

	async function reloadPage() {
		if (delay > 0) {
			await new Promise(resolve => setTimeout(resolve, delay));
		}
		if (typeof window === "undefined") return;
		window.location.reload();
	}

	async function decodeFromFile(event) {
		error = "";
		value = "";

		const { file, error: uploadError } = await handleFileUpload(event, false);
		if (uploadError) {
			error = uploadError;
			return;
		}

		try {
			const fileText = await file.text();
			const decoded = await Encoder.decode(fileText.trim());

			if (!decoded.static || !decoded.media) {
				error = "Неверный формат данных";
				return;
			}

			await GlobalConfig.setConfig(decoded.static, decoded.media);
			value = "Конфигурация загружена";
			reloadPage();
		} catch (e) {
			console.error(e);
			error = "Ошибка при декодировании";
		}
	}
</script>

<Common {icon} {title} {tooltipText}>
	<InputGroup>
		<MediaUpload supportedTypes={[".cfg"]} onChange={decodeFromFile} />
		<Message bind:value />
		<TextError {error} />
	</InputGroup>
</Common>
