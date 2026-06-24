<script>
	import ApplyButton from "./General/ApplyButton.svelte";
	import InputGroup from "./Wrappers/InputGroup.svelte";
	import TextError from "../General/TextError.svelte";
	import Common from "./Wrappers/Common.svelte";
	import { Keyboard } from "lucide-svelte";
	import { GlobalConfig } from "$lib/stores/parameters";
	import {
		startListeningForKey,
		setBindListener,
		removeBindListener,
		codeToLabel,
	} from "$lib/components/utils/BindUtils";

	let {
		icon,
		title,
		description,
		tooltipText,
		configKey,
		bindKey = $bindable(""),
		error = $bindable(""),
		onApply = () => {},
		onBindTrigger = () => {},
	} = $props();

	let previousKey = $state("");
	let listening = $state(false);

	function listenForKey() {
		if (listening) return;
		listening = true;
		startListeningForKey((event) => {
			bindKey = event.code;
			listening = false;
		});
	}

	// ponytail: НЕТ onDestroy-removal — бинд должен жить и после закрытия модалки.
	// Глобальная регистрация при старте — registerBinds() в settingsRegistry.
	$effect(() => {
		if (!bindKey || typeof onBindTrigger !== "function") return;
		if (previousKey && previousKey !== bindKey)
			removeBindListener(previousKey);
		setBindListener(bindKey, onBindTrigger);
		GlobalConfig.set(configKey, bindKey);
		previousKey = bindKey;
	});
</script>

<Common {icon} {title} {tooltipText} {description}>
	<InputGroup>
		<div class="bind-input-wrapper">
			<button class="bind-button" onclick={listenForKey}>
				<Keyboard size={14} />
				{#if listening}
					<span class="bind-label">Нажмите клавишу...</span>
				{:else if bindKey}
					<span class="bind-label">Клавиша: {codeToLabel(bindKey)}</span>
				{:else}
					<span class="bind-label">Установить клавишу</span>
				{/if}
			</button>
			<ApplyButton bind:error {onApply} text="Проверить" />
		</div>
		<TextError {error} />
	</InputGroup>
</Common>

<style>
	.bind-input-wrapper {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		flex-wrap: wrap;
		width: 100%;
	}

	.bind-button {
		flex: 1;
		min-width: 160px;
		padding: 0.5rem 0.8rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		background: var(--bg-muted);
		color: var(--accent-light);
		border: 1px solid var(--accent);
		border-radius: 10px;
		cursor: pointer;
		font-family: var(--font-family-base);
		font-size: 0.95rem;
		transition:
			background 0.2s,
			border-color 0.2s;
	}

	.bind-button:hover {
		background: var(--bg-hover);
		border-color: var(--accent-light);
	}

	.bind-label {
		white-space: nowrap;
		user-select: none;
	}
</style>
