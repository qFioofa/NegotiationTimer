<script>
	import { Package, Settings, FileText, MapPin, Hand } from "lucide-svelte";
</script>

<div class="intro-content">
	<h3>NegotiationTimer</h3>
	<p>
		<b>Таймер для проведения соревнований по переговорам и конфликтам.</b>
	</p>

	<h4><Package size={20} /> Функционал</h4>
	<ul>
		<li>Жеребьёвка</li>
		<li>Установка конкретного времени</li>
		<li>Добавление / убавление времени</li>
		<li>Пауза</li>
	</ul>

	<h4><Settings size={20} /> Основные функции</h4>
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

	<h4><FileText size={20} /> Стандартные настройки</h4>
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

	<h4><MapPin size={20} /> Советы и примечания</h4>
	<ul>
		<li>Используйте горячие клавиши для ускоренного управления</li>
		<li>Настройки сохраняются автоматически</li>
		<li>Фон и звуки требуют перезагрузки для применения</li>
	</ul>
	<p class="closing">Хорошей игры <Hand size={18} /></p>
</div>

<style>
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
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 1.2rem;
		font-size: 1.2rem;
		color: var(--accent-light);
	}

	.intro-content .closing {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.intro-content ul {
		margin: 0.5rem 0 1rem 1.2rem;
		padding-left: 1rem;
	}

	.intro-content li {
		margin: 0.3rem 0;
	}
</style>
