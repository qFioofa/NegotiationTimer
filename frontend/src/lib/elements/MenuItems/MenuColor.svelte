<script>
	import { onMount } from "svelte";
	import InputGroup from "./Wrappers/InputGroup.svelte";
	import Common from "./Wrappers/Common.svelte";

	let {
		icon,
		title,
		tooltipText,
		description,
		value = null,
		onChange = () => {},
	} = $props();

	// <input type="color"> понимает только hex, а getComputedStyle отдаёт rgb(...).
	function currentAccentHex() {
		const v = getComputedStyle(document.documentElement)
			.getPropertyValue("--accent")
			.trim();
		const m = v.match(/\d+(\.\d+)?/g);
		if (!m || m.length < 3) return "#708c6e";
		return (
			"#" +
			m
				.slice(0, 3)
				.map((n) => Math.round(+n).toString(16).padStart(2, "0"))
				.join("")
		);
	}

	// Если кастомный цвет не задан — показываем текущий акцент темы как стартовое значение.
	let color = $state(value ?? "#708c6e");

	onMount(() => {
		if (!value) color = currentAccentHex();
	});

	function pick(v) {
		onChange(v);
		// Сброс (null) убирает override — показываем вернувшийся цвет темы.
		color = v ?? currentAccentHex();
	}
</script>

<Common {icon} {title} {tooltipText} {description}>
	<InputGroup>
		<div class="color-wrapper">
			<input
				type="color"
				value={color}
				aria-label="Выбрать цвет акцента"
				oninput={(e) => pick(e.currentTarget.value)}
			/>
			<button class="reset" onclick={() => pick(null)}>Сброс</button>
		</div>
	</InputGroup>
</Common>

<style>
	.color-wrapper {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	input[type="color"] {
		width: 42px;
		height: 28px;
		padding: 0;
		border: 1px solid var(--accent);
		border-radius: var(--radius-sm);
		background: var(--input-bg);
		cursor: pointer;
	}

	.reset {
		padding: 4px 10px;
		border: 1px solid var(--accent);
		border-radius: var(--radius-sm);
		background: var(--input-bg);
		color: var(--fg-muted);
		font-family: var(--font-family-base);
		font-size: 1rem;
		cursor: pointer;
	}
</style>
