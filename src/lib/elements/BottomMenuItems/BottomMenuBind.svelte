<script>
	import ApplyButton from "$lib/elements/BottomMenuItems/General/ApplyButton.svelte";
	import InputGroup from "$lib/elements/BottomMenuItems/Wrappers/InputGroup.svelte";
	import TextError from "$lib/elements/General/TextError.svelte";
	import Common from "./Wrappers/Common.svelte";
	import { Keyboard } from "lucide-svelte";
	import { onDestroy } from "svelte";
	import { GlobalConfig } from "$lib/stores/parameters";
	import {
		startListeningForKey,
		setBindListener,
		removeBindListener,
		codeToLabel,
	} from "$lib/components/utils/BindUtils";

	export let icon;
	export let title;
	export let description;
	export let configKey;
	export let bindKey = "";
	export let error = "";

	export let onApply = () => {};
	export let onBindTrigger = () => {};

	let previousKey = "";
	let localIsListeningBind = false;

	function listenForKey() {
		if (localIsListeningBind) return;

		localIsListeningBind = true;

		startListeningForKey(event => {
			bindKey = event.code;
			localIsListeningBind = false;
		});
	}

	$: if (bindKey && typeof onBindTrigger === "function") {
		if (previousKey && previousKey !== bindKey) {
			removeBindListener(previousKey);
		}

		setBindListener(bindKey, onBindTrigger);
		GlobalConfig.set(configKey, bindKey);
		previousKey = bindKey;
	}

	onDestroy(() => {
		if (bindKey) removeBindListener(bindKey);
	});
</script>

<Common {icon} {title} {description}>
	<InputGroup>
		<div class="bind-input-wrapper">
			<div class="bind-input">
				<button class="bind-button" on:click={listenForKey}>
					<Keyboard size={14} />
					{#if localIsListeningBind}
						<span class="bind-label">Нажмите клавишу...</span>
					{:else if bindKey}
						<span class="bind-label">Клавиша: {codeToLabel(bindKey)}</span>
					{:else}
						<span class="bind-label">Установить клавишу</span>
					{/if}
				</button>
			</div>

			<div class="apply-wrapper">
				<ApplyButton bind:error {onApply} text="Применить" />
			</div>
		</div>
	</InputGroup>
	<TextError bind:error />
</Common>

<style>
	.bind-input-wrapper {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.6rem;
		width: 100%;
		flex-wrap: wrap;
	}

	.bind-input {
		flex: 1;
		min-width: 180px;
	}

	.apply-wrapper {
		flex-shrink: 0;
	}

	.bind-button {
		width: 100%;
		font-size: 0.9rem;
		background: var(--bg-secondary);
		color: var(--fg);
		border: 1px solid var(--accent);
		padding: 0.5rem 0.8rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		border-radius: 10px;
		cursor: pointer;
		transition:
			background 0.2s,
			border-color 0.2s;
	}

	.bind-button:hover {
		background: var(--bg-hover, var(--bg));
		border-color: var(--accent-hover, var(--accent));
	}

	.bind-label {
		white-space: nowrap;
		text-align: center;
	}
</style>
