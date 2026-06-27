<script>
	import { onMount } from "svelte";

	let {
		inputRef = $bindable(),
		playerName = $bindable(),
		ghostRef = $bindable(),
		defaultText = "Имя игрока",
		maxlength = 20,
		paddingRem = 1,
		updatePlayerName = (e) => {
			playerName = e.target.value.slice(0, maxlength);
			updateWidth();
		},
	} = $props();

	const MIN_FONT_SIZE = 1.2;
	const MAX_FONT_SIZE = 3.0;
	const HEIGHT_FONT_MULTIPLIER = 2.0;
	const INITIAL_WIDTH_CH = 11.5;
	const INITIAL_HEIGHT_REM = 4;

	// Font bounds scale with the viewport so the field stays readable and never
	// overflows on small screens. Recomputed on resize.
	function fontBounds() {
		const vw = window.innerWidth;
		if (vw <= 480) return { min: 1.0, max: 2.0 };
		if (vw <= 768) return { min: 1.1, max: 2.5 };
		return { min: MIN_FONT_SIZE, max: MAX_FONT_SIZE };
	}

	function updateWidth() {
		if (!inputRef) return;
		// Skip while not displayed (hidden / closed tab): measuring an element
		// with no layout is wrong and wasteful — it recomputes once it's shown.
		if (inputRef.offsetParent === null) return;

		const { min, max } = fontBounds();

		if (!playerName) {
			const placeholderFont = max * 0.5;
			inputRef.style.setProperty(
				"--font-size-dynamic",
				`${placeholderFont}rem`,
			);
			inputRef.style.width = `${INITIAL_WIDTH_CH}ch`;
			inputRef.style.height = `${INITIAL_HEIGHT_REM * (max / MAX_FONT_SIZE)}rem`;
			inputRef.style.borderRadius = "1.5rem";
			return;
		}

		const currentText = playerName;

		const textLength = currentText.length;
		const normalizedLength = Math.max(
			0,
			(maxlength - textLength) / maxlength,
		);
		const dynamicFontSize = min + normalizedLength * (max - min);
		inputRef.style.setProperty(
			"--font-size-dynamic",
			`${dynamicFontSize}rem`,
		);

		const paddingInCh = (paddingRem / dynamicFontSize) * 2;
		const widthInCh = currentText.length + paddingInCh;

		const dynamicHeight = dynamicFontSize * HEIGHT_FONT_MULTIPLIER;

		inputRef.style.width = `${Math.max(widthInCh, 6)}ch`;
		inputRef.style.height = `${dynamicHeight}rem`;
		inputRef.style.borderRadius = `${dynamicHeight / 2}rem`;
	}

	function handleInputKeydown(event) {
		event.stopPropagation();
	}

	let resizeRaf = 0;
	function onResize() {
		cancelAnimationFrame(resizeRaf);
		resizeRaf = requestAnimationFrame(updateWidth);
	}

	// Имя может прийти извне (синхронизация комнаты) — подгоняем ширину под него,
	// а не только на ручной ввод.
	$effect(() => {
		playerName;
		updateWidth();
	});

	onMount(() => {
		updateWidth();
		window.addEventListener("resize", onResize);
		return () => {
			window.removeEventListener("resize", onResize);
			cancelAnimationFrame(resizeRaf);
		};
	});
</script>

<input
	class="name-input"
	type="text"
	bind:this={inputRef}
	placeholder={defaultText}
	value={playerName}
	oninput={updatePlayerName}
	onkeydown={handleInputKeydown}
	{maxlength}
/>
<span class="ghost" bind:this={ghostRef}>{playerName}</span>

<style>
	.name-input {
		--font-size-dynamic: 1.5rem;
		width: 11.5ch;
		height: 4rem;
		border-radius: 1.5rem;
		padding: 0 0.5rem;
		min-width: 6ch;
		max-width: 100%;
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
		transition-property:
			background-color, box-shadow, outline, outline-offset, width,
			height, border-radius;
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
