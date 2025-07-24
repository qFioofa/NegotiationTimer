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
				<h3>NegotiationTimer</h3>
				<p><b>Таймер для проведения соревнований по переговорам и конфликтам.</b></p>

				<h4>📦 Функционал</h4>
				<ul>
					<li>Жеребьёвка</li>
					<li>Установка конкретного времени</li>
					<li>Добавление / убавление времени</li>
					<li>Пауза</li>
				</ul>

				<h4>⚙️ Основные функции</h4>
				<ul>
					<li><b>Автопауза: меню / панель</b></li>
					<li><b>Черный экран</b> при завершении таймера</li>
					<li><b>Звук окончания</b></li>
					<li><b>Фон игроков и пользовательский фон</b></li>
					<li><b>Загрузка аудио / фона</b></li>
					<li><b>Копировать / загрузить конфиг</b></li>
					<li><b>Сброс настроек</b></li>
					<li><b>Тема оформления</b></li>
				</ul>

				<h4>🧾 Стандартные настройки</h4>
				<ul>
					<li><b>Стандартное время:</b> <code>60</code> секунд</li>
					<li><b>Установленное время:</b> <code>'01:00'</code></li>
					<li><b>Шаг времени +/-:</b> <code>'00:15'</code></li>
					<li><b>Клавиша жеребьёвки:</b> <code>'R'</code></li>
					<li><b>Клавиша паузы:</b> <code>'Space'</code></li>
					<li><b>Тема:</b> <code>'green'</code></li>
					<li><b>Автопауза (панель):</b> <code>true</code></li>
					<li><b>Автооткрытие панели:</b> <code>true</code></li>
					<li><b>Автопауза (меню):</b> <code>true</code></li>
					<li><b>Черный экран по окончании:</b> <code>true</code></li>
					<li><b>Звук окончания:</b> <code>true</code></li>
					<li><b>Дополнительный звук:</b> <code>true</code></li>
					<li><b>Показать гайд при запуске:</b> <code>true</code></li>
					<li><b>Звук таймера (польз.):</b> <i>не задан</i></li>
					<li><b>Фон игроков:</b> <code>true</code></li>
					<li><b>Пользовательский фон:</b> <code>false</code></li>
					<li><b>Фоновое изображение:</b> <i>не задано</i></li>
				</ul>

				<h4>📍 Советы и примечания</h4>
				<ul>
					<li>Используйте горячие клавиши для ускоренного управления</li>
					<li>Настройки сохраняются автоматически</li>
					<li>Фон и звуки требуют перезагрузки для применения</li>
				</ul>
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
		padding: 2.5rem;
		width: 640px;
		max-width: 90vw;
		max-height: 85vh;
		display: flex;
		flex-direction: column;
		gap: 1.6rem;
		box-shadow: 0 0 24px rgba(0, 0, 0, 0.3);
		overflow: hidden;
	}

	.intro-header h2 {
		color: var(--accent);
		font-size: 2rem;
		margin: 0;
	}

	.intro-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
	}

	button {
		background: var(--accent);
		color: var(--input-bg);
		border: none;
		padding: 0.6rem 1.2rem;
		border-radius: 10px;
		cursor: pointer;
		font-weight: bold;
		font-size: 1rem;
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
		font-size: 1.05rem;
		line-height: 1.6;
	}

	.intro-content h3 {
		font-size: 1.5rem;
		margin-bottom: 0.4rem;
		color: var(--accent);
	}

	.intro-content h4 {
		margin-top: 1.2rem;
		font-size: 1.2rem;
		color: var(--accent-light);
	}

	.intro-content ul {
		margin: 0.5rem 0 1rem 1.2rem;
		padding-left: 1rem;
	}

	.intro-content li {
		margin: 0.3rem 0;
	}
</style>
