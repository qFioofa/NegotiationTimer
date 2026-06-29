<script>
	import { GlobalConfig } from "$lib/stores/parameters";
	import { setPause } from "$lib/components/Pause";
	import { Settings } from "lucide-svelte";
	import SettingsModal from "./SettingsModal.svelte";

	let isOpen = $state(false);
	let triggerRef = $state();

	// Сохраняем сайд-эффект старого меню: автопауза при открытии.
	function syncPause(open) {
		if (GlobalConfig.get("menuAutoPause")) setPause(open);
	}

	function open() {
		isOpen = true;
		syncPause(true);
	}
</script>

<button
	bind:this={triggerRef}
	class="settings-trigger"
	aria-label="Настройки"
	aria-haspopup="dialog"
	aria-expanded={isOpen}
	onclick={open}
>
	<Settings size={28} />
</button>

<SettingsModal
	bind:isOpen
	triggerEl={triggerRef}
	onClose={() => syncPause(false)}
/>

<style>
	/* Стиль кнопок таймера (TimerButton): рамка accent, blur, тень-сдвиг. */
	.settings-trigger {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--trigger-size);
		height: var(--trigger-size);
		padding: 0;
		border-radius: var(--radius-xxl);
		border: 2px solid var(--accent);
		box-shadow: 4px 4px 0 var(--accent-dark);
		background: var(--bg-overlay);
		color: var(--accent-light);
		backdrop-filter: blur(14px);
		cursor: pointer;
		user-select: none;
		font-size: 2rem;
		line-height: 1;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease,
			background 0.3s ease;
	}

	.settings-trigger:hover {
		transform: scale(1.08);
		box-shadow: 6px 6px 0 var(--accent-dark);
	}

	.settings-trigger:active {
		transform: scale(0.95);
		box-shadow: 2px 2px 0 var(--accent-dark);
	}

	@media (max-width: 480px) {
		/* Размер/позиция приходят из --trigger-* (мобильный оверрайд в global.css). */
		.settings-trigger {
			font-size: 1.6rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.settings-trigger {
			transition: none;
		}
	}
</style>
