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
		<div class="content-wrapper">
			{#if title}
				<h2 class="panel-title">{title}</h2>
			{/if}
			<hr class="panel-divider" />
			<slot />
		</div>
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
		height: 80vh;
		display: flex;
		flex-direction: column;
		background: var(--bg);
		backdrop-filter: blur(25px);
		border-radius: 0 20px 20px 0;
		border: 3px solid var(--accent);
		box-shadow: 0 0px 50px var(--shadow);
		z-index: 1000;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s ease;
	}

	.menu-panel.open {
		opacity: 1;
		pointer-events: auto;
	}

	.scroll-wrapper {
		flex: 1;
		max-height: 100%;
		overflow-y: auto;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.scroll-wrapper::-webkit-scrollbar {
		display: none;
	}

	.content-wrapper {
		min-height: 100%;
		display: flex;
		flex-direction: column;
		padding-left: 0.2rem;
		padding-right: 1rem;
		box-sizing: border-box;
	}

	.panel-title {
		font-family: var(--font-family-accent);
		font-size: 4rem;
		font-weight: var(--font-weight-bold);
		line-height: var(--line-height-tight);
		text-align: center;
		margin: 2rem 0 1rem 0;
		background: var(--accent);
		background-clip: text;
		color: transparent;
		user-select: none;
	}

	.panel-divider {
		width: 100%;
		height: 1px;
		border: none;
		background: var(--divider);
		margin: 0 0 2rem 0;
	}
</style>
