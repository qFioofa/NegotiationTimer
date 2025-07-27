<script>
	import { onMount } from "svelte";

	export let inputRef;
	export let playerName;
	export let ghostRef;
	export let defaultText = "Имя игрока";
	export let maxlength = 20;
	export let paddingRem = 1;

	const MIN_FONT_SIZE = 1.2;
	const MAX_FONT_SIZE = 3.0;
	const HEIGHT_FONT_MULTIPLIER = 2.0;
	const PLACEHOLDER_PADDING_CH = 1.5;
	const INITIAL_WIDTH_CH = 11.5;
	const INITIAL_HEIGHT_REM = 4;

	function updateWidth() {
		if (!ghostRef || !inputRef) return;

		const isPlaceholderMode = !playerName;

		if (isPlaceholderMode) {
			inputRef.style.setProperty("--font-size-dynamic", "1.5rem");
			inputRef.style.width = `${INITIAL_WIDTH_CH}ch`;
			inputRef.style.height = `${INITIAL_HEIGHT_REM}rem`;
			inputRef.style.borderRadius = "1.5rem";
			ghostRef.textContent = "";
			return;
		}

		const currentText = playerName;
		ghostRef.textContent = currentText;

		const textLength = currentText.length;
		const normalizedLength = Math.max(0, (maxlength - textLength) / maxlength);
		const dynamicFontSize = MIN_FONT_SIZE + normalizedLength * (MAX_FONT_SIZE - MIN_FONT_SIZE);
		inputRef.style.setProperty("--font-size-dynamic", `${dynamicFontSize}rem`);

		const paddingInCh = (paddingRem / dynamicFontSize) * 2;
		const widthInCh = currentText.length + paddingInCh;

		const dynamicHeight = dynamicFontSize * HEIGHT_FONT_MULTIPLIER;

		inputRef.style.width = `${Math.max(widthInCh, 6)}ch`;
		inputRef.style.height = `${dynamicHeight}rem`;
		inputRef.style.borderRadius = `${dynamicHeight / 2}rem`;
	}

	export let updatePlayerName = e => {
		playerName = e.target.value.slice(0, maxlength);
		updateWidth();
	};

	function handleInputKeydown(event) {
		event.stopPropagation();
	}

	onMount(() => {
		updateWidth();
	});
</script>

<input
	class="name-input"
	type="text"
	bind:this={inputRef}
	placeholder={defaultText}
	value={playerName}
	on:input={updatePlayerName}
	on:keydown={handleInputKeydown}
	{maxlength}
/>
<span class="ghost" bind:this={ghostRef}></span>

<style>
	.name-input {
		--font-size-dynamic: 1.5rem;
		width: 11.5ch;
		height: 4rem;
		border-radius: 1.5rem;
		padding: 0 0.5rem;
		min-width: 6ch;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.ghost {
		position: absolute;
		visibility: hidden;
		white-space: nowrap;
		padding: 0 0.5rem;
		font-size: var(--font-size-dynamic);
		line-height: var(--line-height-base);
	}

	.name-input {
		color: var(--input-fg);
		background: var(--input-bg);
		border: none;
		backdrop-filter: blur(8px);
		box-shadow: 0 0 8px var(--shadow);
	}

	.name-input:focus,
	.name-input:hover,
	.name-input:not(:placeholder-shown) {
		background: var(--bg);
		box-shadow: 0 0 12px var(--shadow);
	}

	.name-input:focus {
		outline: 2px solid var(--accent-light);
		outline-offset: 1px;
	}

	.name-input {
		font-family: var(--font-family-base);
		font-size: var(--font-size-dynamic);
		font-weight: var(--font-weight-normal);
		line-height: var(--line-height-base);
		text-align: center;
	}

	.name-input::placeholder {
		color: var(--input-placeholder);
		font-size: 1.1rem;
	}

	.ghost {
		font-family: inherit;
	}

	.name-input {
		transition: var(--transition);
		transition-property: background-color, box-shadow, outline, outline-offset, width, height,
			border-radius;
		cursor: text;
	}

	.name-input:hover:not(:focus):not(:placeholder-shown) {
		transform: scale(1.08);
	}

	.name-input {
		appearance: none;
		-webkit-appearance: none;
		user-select: auto;
	}
</style>
