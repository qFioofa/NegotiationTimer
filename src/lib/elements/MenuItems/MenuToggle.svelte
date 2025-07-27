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
			<span class="toggle-label label-off" class:label-active={!isToggled}>Выкл</span>
			<button
				class="toggle"
				class:toggle-on={isToggled}
				aria-label={isToggled ? "Отключить" : "Включить"}
				on:click={toggleSwitch}
			>
				<div class="circle"></div>
			</button>
			<span class="toggle-label label-on" class:label-active={isToggled}>Вкл</span>
		</div>
	</InputGroup>
</Common>

<style>
	.toggle-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.6rem;
	}

	.toggle {
		width: 42px;
		height: 24px;
		padding: 2px;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-shrink: 0;
	}

	.toggle.toggle-on {
		justify-content: flex-end;
	}

	.circle {
		width: 18px;
		height: 18px;
		flex-shrink: 0;
	}

	.toggle-label {
		width: 80px;
		text-align: center;
	}

	.toggle-wrapper {
		color: var(--fg-muted);
		user-select: none;
	}

	.label-active {
		color: var(--success);
	}

	.toggle {
		background: var(--input-bg);
		border: 1px solid var(--accent);
		border-radius: 999px;
		cursor: pointer;
	}

	.toggle:not(.toggle-on) {
		border-color: var(--accent);
	}

	.circle {
		background: var(--fg);
		border-radius: 50%;
	}

	.toggle.toggle-on .circle {
		background: var(--accent);
	}

	.toggle-wrapper {
		font-family: var(--font-family-base);
		font-size: 1.2rem;
		font-weight: var(--font-weight-normal);
		line-height: var(--line-height-base);
	}

	.label-active {
		font-weight: var(--font-weight-bold);
	}

	.toggle {
		transition:
			background 0.3s ease,
			border-color 0.3s ease;
	}

	.circle {
		transition:
			background 0.3s ease,
			transform 0.2s ease;
	}

	.toggle:active .circle {
		transform: scale(0.9);
	}

	.label-off,
	.label-on {
		transition: color 0.3s ease;
	}

	.label-off.label-active {
		color: var(--danger);
	}
</style>
