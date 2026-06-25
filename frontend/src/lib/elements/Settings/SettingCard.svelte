<script>
	import { GlobalConfig } from "$lib/stores/parameters";

	import MenuOptionList from "../MenuItems/MenuOptionList.svelte";
	import MenuDecoder from "../MenuItems/MenuDecoder.svelte";
	import MenuToggle from "../MenuItems/MenuToggle.svelte";
	import MenuCoder from "../MenuItems/MenuCoder.svelte";
	import MenuMedia from "../MenuItems/MenuMedia.svelte";
	import MenuColor from "../MenuItems/MenuColor.svelte";
	import MenuClick from "../MenuItems/MenuClick.svelte";
	import MenuHold from "../MenuItems/MenuHold.svelte";
	import MenuBind from "../MenuItems/MenuBind.svelte";

	let { setting } = $props();

	// Транзиентный статус «применено», гаснет по таймауту (превью результата фичи).
	let status = $state("");
	let statusTimer;
	function flash(text = "✓ Применено") {
		status = text;
		clearTimeout(statusTimer);
		statusTimer = setTimeout(() => (status = ""), 1800);
	}

	const get = (k) => GlobalConfig.get(k);
	const set = (k, v) => GlobalConfig.set(k, v);
</script>

<div class="setting-card">
	{#if setting.type === "toggle"}
		<MenuToggle
			icon={setting.icon}
			title={setting.title}
			description={setting.description}
			tooltipText={setting.tooltip}
			isToggled={get(setting.configKey)}
			onToggle={(v) => {
				set(setting.configKey, v);
				flash(v ? "✓ Включено" : "✓ Выключено");
			}}
		/>
	{:else if setting.type === "optionList"}
		<MenuOptionList
			icon={setting.icon}
			title={setting.title}
			description={setting.description}
			tooltipText={setting.tooltip}
			options={setting.getOptions?.() ?? []}
			selectedOption={setting.configKey
				? get(setting.configKey)
				: undefined}
			onOptionSelect={(opt) => {
				if (setting.configKey) set(setting.configKey, opt);
				setting.onSelect?.(opt);
				flash();
			}}
		/>
	{:else if setting.type === "color"}
		<MenuColor
			icon={setting.icon}
			title={setting.title}
			description={setting.description}
			tooltipText={setting.tooltip}
			value={get(setting.configKey)}
			onChange={(v) => {
				set(setting.configKey, v);
				setting.onSelect?.(v);
				flash();
			}}
		/>
	{:else if setting.type === "media"}
		<MenuMedia
			icon={setting.icon}
			title={setting.title}
			description={setting.description}
			tooltipText={setting.tooltip}
			supportedTypes={setting.supportedTypes}
			configKey={setting.configKey}
		/>
	{:else if setting.type === "coder"}
		<MenuCoder
			icon={setting.icon}
			title={setting.title}
			description={setting.description}
			tooltipText={setting.tooltip}
			text={setting.text}
		/>
	{:else if setting.type === "decoder"}
		<MenuDecoder
			icon={setting.icon}
			title={setting.title}
			description={setting.description}
			tooltipText={setting.tooltip}
		/>
	{:else if setting.type === "hold"}
		<MenuHold
			icon={setting.icon}
			title={setting.title}
			description={setting.description}
			tooltipText={setting.tooltip}
			holdDuration={setting.holdDuration ?? 3000}
			onHoldComplete={setting.onHoldComplete}
		/>
	{:else if setting.type === "bind"}
		<MenuBind
			icon={setting.icon}
			title={setting.title}
			description={setting.description}
			tooltipText={setting.tooltip}
			configKey={setting.configKey}
			bindKey={get(setting.configKey)}
			onApply={setting.action}
			onBindTrigger={setting.action}
		/>
	{:else if setting.type === "click"}
		<MenuClick
			icon={setting.icon}
			title={setting.title}
			description={setting.description}
			tooltipText={setting.tooltip}
			text={setting.text}
			onClick={() => {
				setting.onClick?.();
				flash("✓ Готово");
			}}
		/>
	{/if}

	{#if status}
		<div class="status-badge" role="status">{status}</div>
	{/if}
</div>

<style>
	.setting-card {
		position: relative;
	}

	/* Статус в правой зоне = ТЗ-шный «результат / фича сработала». */
	.status-badge {
		position: absolute;
		top: 50%;
		left: 84%;
		transform: translate(-50%, -50%);
		padding: 6px 14px;
		border-radius: var(--radius-sm);
		background: var(--accent);
		color: var(--input-bg);
		font-family: var(--font-family-base);
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-bold);
		box-shadow: 0 0 10px var(--shadow);
		pointer-events: none;
		user-select: none;
		white-space: nowrap;
		animation: badge-in 0.2s ease;
	}

	@keyframes badge-in {
		from {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0.9);
		}
		to {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.status-badge {
			animation: none;
		}
	}
</style>
