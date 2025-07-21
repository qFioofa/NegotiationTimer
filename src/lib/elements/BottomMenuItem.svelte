<script>
	import { onMount } from "svelte";
	import { Check, Plus, Minus, Keyboard } from "lucide-svelte";

	export let title = "";
	export let description = "";
	export let type = "input";
	export let placeholder = "";
	export let value = "";
	export let onApply = () => {};
	export let onBindSet = () => {};
	export let onIncrement = () => {};
	export let onDecrement = () => {};
	export let icon = null;

	let bindKey = null;
	let listening = false;
	let inputRef;

	function formatTimeInput(val) {
		let digits = val.replace(/[^0-9]/g, "");
		if (digits.length > 4) digits = digits.slice(0, 4);
		if (digits.length <= 2) return `00:${digits.padStart(2, "0")}`;
		return `${digits.slice(0, -2).padStart(2, "0")}:${digits.slice(-2)}`;
	}

	function handleKeydown(event) {
		if (!listening) return;
		bindKey = event.key;
		listening = false;
		window.removeEventListener("keydown", handleKeydown);
	}

	function startListening() {
		listening = true;
		bindKey = null;
		window.addEventListener("keydown", handleKeydown);
		onBindSet();
	}
</script>

<div class="bottom-menu-item">
	<div class="top">
		<h3>
			{#if icon}
				<div class="item-icon">{icon}</div>
			{/if}
			{title}
		</h3>
		<p>{description}</p>
	</div>

	{#if type === "input"}
		<div class="input-group">
			<input
				bind:this={inputRef}
				type="text"
				bind:value
				{placeholder}
				on:input={() => (value = formatTimeInput(value))}
			/>
			<button on:click={() => onApply(value)}><Check size={16} /></button>
		</div>
	{:else if type === "adjust"}
		<div class="adjust-group">
			<button on:click={onDecrement}><Minus size={16} /></button>
			<input bind:this={inputRef} type="text" bind:value readonly />
			<button on:click={onIncrement}><Plus size={16} /></button>
		</div>
	{:else if type === "bind"}
		<div class="bind-group">
			<button class="bind-button" on:click={startListening}>
				<Keyboard size={14} />
				{#if bindKey}
					Клавиша: {bindKey}
				{:else if listening}
					Нажмите клавишу...
				{:else}
					Установить клавишу
				{/if}
			</button>
		</div>
	{/if}
</div>

<style>
	.bottom-menu-item {
		background: var(--bg);
		padding: 1rem;
		margin-left: 50px;
		border-radius: 12px;
		border: 1px solid var(--accent);
		margin-bottom: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.top h3 {
		font-size: 1.7rem;
		color: var(--accent);
		margin: 5px;
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.top p {
		margin: 5px;
		color: var(--fg-muted);
		font-size: 1.1rem;
	}

	.input-group,
	.adjust-group {
		display: flex;
		gap: 0.4rem;
		align-items: center;
	}

	input {
		flex: 1;
		padding: 0.4rem 0.8rem;
		font-size: 1rem;
		border: 1px solid var(--accent);
		border-radius: 8px;
		background: var(--input-bg);
		color: var(--fg);
		text-align: center;
	}

	button {
		background: var(--accent);
		color: var(--input-bg);
		border: none;
		border-radius: 8px;
		padding: 0.4rem 0.8rem;
		cursor: pointer;
		font-weight: bold;
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.9rem;
	}

	.bind-button {
		font-size: 0.85rem;
		background: var(--bg-secondary);
		color: var(--fg);
		border: 1px solid var(--accent);
	}
</style>
