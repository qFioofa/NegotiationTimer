<script>
	import { isPaused, setPause } from "$lib/components/Pause";
	import { GlobalConfig } from "$lib/stores/parameters";

	export let title;
	export let isMenuOpen;
	export let isTriggerHovered;
	export let panelRef;

	let isPanelHovered;

	export let handlePanelEnter = () => {
		isPanelHovered = true;
	};

	export let handlePanelLeave = () => {
		isPanelHovered = false;
	};

	$: if (isTriggerHovered) {
		if (GlobalConfig.get("panelAutoOpen")) {
			isMenuOpen = true;
			if (GlobalConfig.get("panelAutoPause")) setPause(true);
		}
	}

	$: if (!isPanelHovered) {
		if (GlobalConfig.get("panelAutoOpen")) {
			isMenuOpen = false;
			if (GlobalConfig.get("panelAutoPause")) setPause(false);
		}
	}

	$: if (isMenuOpen) {
		if (!GlobalConfig.get("panelAutoOpen")) {
			if (GlobalConfig.get("panelAutoPause")) setPause(true);
		}
	} else {
		if (!GlobalConfig.get("panelAutoOpen")) {
			if (GlobalConfig.get("panelAutoPause")) setPause(false);
		}
	}
</script>

<div
	role="menu"
	bind:this={panelRef}
	class="menu-panel"
	class:open={isMenuOpen}
	aria-orientation="vertical"
	aria-labelledby="panel-title"
	tabindex="-1"
	on:mouseenter={handlePanelEnter}
	on:mouseleave={handlePanelLeave}
>
	<div class="scroll-wrapper">
		{#if title}
			<h2 class="panel-title">{title}</h2>
		{/if}
		<slot />
	</div>
</div>

<style>
	.menu-panel {
		position: fixed;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
		width: 30vw;
		max-width: 50vw;
		height: 66vh;
		background: var(--bg);
		backdrop-filter: blur(25px);
		border-radius: 0 20px 20px 0;
		border: 3px solid var(--accent);
		box-shadow: 0 0px 50px var(--shadow);
		z-index: 1000;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s ease;
		overflow: hidden;
	}
	.menu-panel.open {
		opacity: 1;
		pointer-events: auto;
	}
	.scroll-wrapper {
		max-height: 100%;
		overflow-y: auto;
		padding-right: 8px;
		scrollbar-width: thin;
		scrollbar-color: var(--accent) transparent;
	}
	.scroll-wrapper::-webkit-scrollbar {
		width: 6px;
	}
	.scroll-wrapper::-webkit-scrollbar-thumb {
		background-color: var(--accent);
		border-radius: 4px;
	}
	.scroll-wrapper::-webkit-scrollbar-track {
		background: transparent;
	}
	.panel-title {
		font-size: 4rem;
		text-align: left;
		margin: 2rem;
		background: linear-gradient(45deg, var(--accent), var(--accent-light));
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		font-weight: bold;
		user-select: none;
	}
</style>
