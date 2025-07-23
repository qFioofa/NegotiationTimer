<script>
	import { fade, scale } from "svelte/transition";
	import { GlobalConfig, IntroGuideVisiable } from "$lib/stores/parameters";
	import { writable } from "svelte/store";

	function close() {
		$IntroGuideVisiable = false;
	}

	function closeForever() {
		$IntroGuideVisiable = false;
		GlobalConfig.set("introGuide", false);
	}
</script>

{#if $IntroGuideVisiable}
	<div class="intro-overlay" transition:fade>
		<div class="intro-modal" transition:scale={{ duration: 200 }}>
			<div class="intro-header">
				<h2>Добро пожаловать!</h2>
			</div>

			<div class="intro-content">
				<p>Это интерактивный таймер для боёв, турниров и кастомных матчей.</p>
				<p>Вы можете:</p>
				<ul>
					<li>Установить время и настроить параметры</li>
					<li>Использовать горячие клавиши для управления</li>
					<li>Выбрать игроков и кастомизировать цвета</li>
					<li>Открыть дополнительное меню снизу и сбоку</li>
				</ul>
				<p>Все настройки сохраняются автоматически!</p>
				<p>Хорошей игры 👊</p>
			</div>
			<div class="intro-actions">
				<button class="secondary" on:click={closeForever}>Не показывать снова</button>
				<button on:click={close}>Закрыть</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.intro-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.65);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		backdrop-filter: blur(6px);
	}

	.intro-modal {
		background: var(--bg);
		border: 1px solid var(--accent);
		border-radius: 16px;
		padding: 2rem;
		width: 480px;
		max-width: 90vw;
		max-height: 80vh;
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
		box-shadow: 0 0 24px rgba(0, 0, 0, 0.3);
		overflow: hidden;
	}

	.intro-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.intro-header h2 {
		color: var(--accent);
		font-size: 1.6rem;
		margin: 0;
	}

	.intro-actions {
		display: flex;
		gap: 0.5rem;
	}

	button {
		background: var(--accent);
		color: var(--input-bg);
		border: none;
		padding: 0.4rem 0.8rem;
		border-radius: 8px;
		cursor: pointer;
		font-weight: bold;
		font-size: 0.9rem;
		transition: background 0.2s;
	}

	button.secondary {
		background: var(--bg-secondary);
		color: var(--fg);
		border: 1px solid var(--accent);
	}

	.intro-content {
		overflow-y: auto;
		scrollbar-width: thin;
		padding-right: 0.5rem;
		color: var(--fg);
		flex: 1;
	}

	.intro-content p,
	.intro-content li {
		margin: 0.3rem 0;
		font-size: 1rem;
		line-height: 1.4;
	}

	.intro-content ul {
		padding-left: 1.4rem;
	}
</style>
