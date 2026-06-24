<script>
	import { fade, scale } from "svelte/transition";
	import { tick } from "svelte";

	import SettingsCategories from "./SettingsCategories.svelte";
	import { ALL_CATEGORY } from "./settingsRegistry";
	import SettingsSearch from "./SettingsSearch.svelte";
	import SettingsList from "./SettingsList.svelte";

	let { isOpen = $bindable(false), triggerEl, onClose = () => {} } = $props();

	let category = $state(ALL_CATEGORY);
	let query = $state("");
	let searchRef = $state();
	let panelRef = $state();

	function close() {
		isOpen = false;
		onClose();
		triggerEl?.focus();
	}

	// Esc закрывает, Tab держится внутри панели (focus-trap, доступность).
	function onKeydown(e) {
		if (e.key === "Escape") {
			e.preventDefault();
			close();
			return;
		}
		if (e.key !== "Tab") return;

		const focusable = panelRef?.querySelectorAll(
			'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
		);
		if (!focusable || !focusable.length) return;

		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	}

	// Автофокус в поиск при открытии и сброс состояния поиска.
	$effect(() => {
		if (isOpen) {
			query = "";
			tick().then(() => searchRef?.focus());
		}
	});
</script>

{#if isOpen}
	<div class="overlay" transition:fade={{ duration: 200 }}>
		<button
			class="backdrop"
			aria-label="Закрыть настройки"
			tabindex="-1"
			onclick={close}
		></button>

		<div
			bind:this={panelRef}
			class="panel"
			role="dialog"
			aria-modal="true"
			aria-label="Настройки"
			tabindex="-1"
			transition:scale={{ duration: 250, start: 0.96 }}
			onkeydown={onKeydown}
		>
			<header class="header">
				<h2 class="title">Настройки</h2>
				<button class="close" aria-label="Закрыть" onclick={close}
					>✕</button
				>
			</header>

			<div class="controls">
				<SettingsSearch bind:this={searchRef} bind:query />
				<SettingsCategories bind:selected={category} />
			</div>

			<div class="content">
				<SettingsList {category} {query} />
			</div>
		</div>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1002;
	}

	.backdrop {
		position: absolute;
		inset: 0;
		border: none;
		padding: 0;
		background: var(--shadow, rgba(0, 0, 0, 0.5));
		backdrop-filter: blur(4px);
		cursor: pointer;
	}

	.panel {
		position: relative;
		display: flex;
		flex-direction: column;
		width: 92vw;
		height: 92vh;
		height: 92dvh; /* dynamic vh: no iOS URL-bar cut */
		background: var(--bg);
		border: 3px solid var(--accent);
		border-radius: var(--radius-xl, 20px);
		box-shadow: 0 0 60px var(--shadow);
		overflow: hidden;
	}

	.header {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-lg) var(--spacing-xl);
		border-bottom: 3px solid var(--accent);
	}

	.title {
		margin: 0;
		color: var(--accent);
		font-family: var(--font-family-accent);
		font-size: var(--font-size-xxl);
		font-weight: var(--font-weight-bold);
		line-height: var(--line-height-tight);
		letter-spacing: 1px;
		user-select: none;
	}

	.close {
		position: absolute;
		top: 50%;
		right: var(--spacing-lg);
		transform: translateY(-50%);
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bg-card);
		border: 1px solid var(--accent);
		border-radius: 50%;
		color: var(--accent-light);
		cursor: pointer;
		font-size: 1.4rem;
		transition:
			background 0.2s ease,
			transform 0.2s ease;
	}

	.close:hover {
		background: var(--accent);
		color: var(--input-bg);
		transform: translateY(-50%) scale(1.08);
	}

	.controls {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		padding: var(--spacing-lg) var(--spacing-xl) var(--spacing-md);
	}

	.content {
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		padding: var(--spacing-md) var(--spacing-xl) var(--spacing-xl);
		scrollbar-width: thin;
		scrollbar-color: var(--accent-light) transparent;
	}

	.content::-webkit-scrollbar {
		width: 8px;
	}

	.content::-webkit-scrollbar-thumb {
		background-color: var(--accent-light);
		border-radius: var(--radius-sm);
	}

	@media (max-width: 480px) {
		.panel {
			width: 100vw;
			height: 100vh;
			height: 100dvh;
			border: none;
			border-radius: 0;
		}
		.title {
			font-size: var(--font-size-xl);
		}
		.controls,
		.content {
			padding-left: var(--spacing-lg);
			padding-right: var(--spacing-lg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.overlay,
		.panel {
			transition: none;
		}
	}
</style>
