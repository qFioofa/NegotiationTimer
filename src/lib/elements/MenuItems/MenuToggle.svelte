<script>
	import InputGroup from "./Wrappers/InputGroup.svelte";
	import Common from "./Wrappers/Common.svelte";

	export let icon;
	export let title;
	export let tooltipText;
	export let isToggled;

	export let onToggle = () => {};

	function toggleSwitch() {
		isToggled = !isToggled;
		if (onToggle) onToggle(isToggled);
	}
</script>

<Common {icon} {title} {tooltipText}>
	<InputGroup>
		<div class="toggle-wrapper">
			<span class:label-active={!isToggled}>Выкл</span>
			<button
				class="toggle"
				class:toggle-on={isToggled}
				aria-label={isToggled ? "Отключить" : "Включить"}
				on:click={toggleSwitch}
			>
				<div class="circle"></div>
			</button>
			<span class:label-active={isToggled}>Вкл</span>
		</div>
	</InputGroup>
</Common>

<style>
	.toggle-wrapper {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		font-size: 1.2rem;
		color: var(--fg-muted, #888);
		user-select: none;
	}

	.label-active {
		color: var(--accent);
		font-weight: bold;
	}

	.toggle {
		width: 42px;
		height: 24px;
		border-radius: 999px;
		background: var(--input-bg);
		border: 1px solid var(--accent);
		padding: 2px;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		cursor: pointer;
		transition: background 0.3s ease;
	}

	.toggle.toggle-on {
		justify-content: flex-end;
	}

	.toggle .circle {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: var(--fg);
		transition: background 0.3s ease;
	}

	.toggle.toggle-on .circle {
		background: var(--accent);
	}
</style>
