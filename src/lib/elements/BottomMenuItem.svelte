<script>
	import { onMount } from "svelte";
	import { Check, Plus, Minus, Keyboard } from "lucide-svelte";

	export let title = "";
	export let description = "";
	export let type = "input";
	export let value = "00:00";
	export let onApply = () => {};
	export let onBindTrigger = () => {};
	export let onIncrement = () => {};
	export let onDecrement = () => {};
	export let icon = null;

	let bindKey = null;
	let listening = false;
	let error = "";

	function startListening() {
		listening = true;
		window.addEventListener("keydown", handleListening);
	}

	function handleListening(event) {
		if (!listening) return;
		bindKey = event.key;
		listening = false;
		window.removeEventListener("keydown", handleListening);
	}

	function bindHandler(event) {
		if (event.key === bindKey) {
			onBindTrigger();
		}
	}

	onMount(() => {
		window.addEventListener("keydown", bindHandler);
	});

	function validateTimeFormat(val) {
		const regex = /^([0-5][0-9]):([0-5][0-9])$/;
		if (!regex.test(val)) return false;
		const [, mm, ss] = val.match(regex);
		return mm >= 0 && mm <= 59 && ss >= 0 && ss <= 59;
	}

	function onInputChange(e) {
		let val = e.target.value;
		val = val.replace(/[^0-9]/g, "");
		if (val.length > 2) {
			val = val.slice(0, 2) + ":" + val.slice(2, 4);
		}
		val = val.slice(0, 5);
		value = val;

		if (!validateTimeFormat(value)) {
			error = "Введите время в формате MM:SS, где минуты и секунды от 00 до 59";
		} else {
			error = "";
		}
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
				type="text"
				bind:value
				on:input={onInputChange}
				placeholder="MM:SS"
				maxlength="5"
				required
			/>
			<button disabled={error !== ""} on:click={() => onApply(value)}>
				<Check size={16} />
			</button>
		</div>
		{#if error}
			<div class="error">{error}</div>
		{/if}
	{:else if type === "adjust"}
		<div class="adjust-group">
			<button disabled={error !== ""} on:click={() => onDecrement(value)}
				><Minus size={16} /></button
			>
			<input
				type="text"
				bind:value
				on:input={onInputChange}
				placeholder="MM:SS"
				maxlength="5"
				required
			/>
			<button disabled={error !== ""} on:click={() => onIncrement(value)}
				><Plus size={16} /></button
			>
		</div>
		{#if error}
			<div class="error">{error}</div>
		{/if}
	{:else if type === "bind"}
		<div class="bind-group">
			<div class="bind-input-wrapper">
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
				<button class="apply-button" on:click={() => onApply(value)}>Применить</button>
			</div>
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

	input[type="text"] {
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

	button {
		background: var(--accent);
		color: var(--input-bg);
		border: none;
		margin: 5px;
		border-radius: 8px;
		padding: 0.4rem 0.8rem;
		cursor: pointer;
		font-weight: bold;
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.9rem;
	}

	.error {
		color: var(--error-text);
		font-size: 0.9rem;
		margin-left: 5px;
	}

	.bind-group {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.bind-input-wrapper {
		display: flex;
		gap: 0.4rem;
		align-items: center;
	}

	.bind-button {
		flex: 1;
		font-size: 0.85rem;
		background: var(--bg-secondary);
		color: var(--fg);
		border: 1px solid var(--accent);
		justify-content: center;
	}

	.apply-button {
		min-width: 80px;
	}
</style>
