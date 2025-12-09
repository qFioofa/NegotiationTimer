<script>
	import { GlobalConfig, IntroGuideVisiable } from "$lib/stores/parameters";
	import { themeManager, csHandler } from "$lib/cssStyles/themeHanager";
	import { shuffleMap, getShuffleNames } from "$lib/components/Shuffle";
	import { isPaused, setPause } from "$lib/components/Pause";
	import DeviderTheme from "./General/DeviderTheme.svelte";
	import { dConfig } from "$lib/stores/defaultConfig";
	import IntroGuide from "./IntroGuide.svelte";

	import OpacityMouse from "./Wrappers/OpacityMouse.svelte";

	import MenuTrigger from "./MenuItems/Wrappers/MenuTrigger.svelte";
	import MenuOptionList from "./MenuItems/MenuOptionList.svelte";
	import SideMenu from "./MenuItems/Wrappers/SideMenu.svelte";
	import MenuDecoder from "./MenuItems/MenuDecoder.svelte";
	import MenuToggle from "./MenuItems/MenuToggle.svelte";
	import MenuCoder from "./MenuItems/MenuCoder.svelte";
	import MenuMedia from "./MenuItems/MenuMedia.svelte";
	import MenuClick from "./MenuItems/MenuClick.svelte";
	import MenuHold from "./MenuItems/MenuHold.svelte";

	let menuOpen = false;
	let triggerRef;

	function handleOpen() {
		menuOpen = !menuOpen;
		if (GlobalConfig.get("menuAutoPause")) setPause(menuOpen);
	}
</script>

<IntroGuide visible={false} />

<OpacityMouse
	bind:isOpen={menuOpen}
	handleTriggerEnter={() => {}}
	handleTriggerLeave={() => {}}
	{handleOpen}
	targetRef={triggerRef}
>
	<MenuTrigger bind:isOpen={menuOpen} bind:ref={triggerRef} {handleOpen} />
</OpacityMouse>

<SideMenu bind:isOpen={menuOpen} title="Меню настроек">
	<MenuToggle
		icon="🖥"
		title="Черный экран"
		tooltipText="При завершении времени появляется черный экран"
		isToggled={GlobalConfig.get("timerBlackOut")}
		onToggle={(v) => {
			GlobalConfig.set("timerBlackOut", v);
		}}
	/>

	<MenuToggle
		icon="🎵"
		title="Звук"
		tooltipText="Воспроизводит звук по завершении времени"
		isToggled={GlobalConfig.get("afterSound")}
		onToggle={(v) => {
			GlobalConfig.set("afterSound", v);
		}}
	/>

	<MenuToggle
		icon="🛠"
		title="Выдвигать панель"
		tooltipText="Автоматически выдвигать панель, когда мышка на иконке панели"
		isToggled={GlobalConfig.get("panelAutoOpen")}
		onToggle={(v) => {
			GlobalConfig.set("panelAutoOpen", v);
		}}
	/>

	<DeviderTheme />

	<MenuToggle
		icon="⏬"
		title="Доп. кнопки: меню"
		tooltipText="Добавляет кнопки 'сбросить таймер до начального значения' и 'пауза'"
		isToggled={GlobalConfig.get("extraButtonsOn")}
		onToggle={(v) => {
			GlobalConfig.set("extraButtonsOn", v);
		}}
	/>

	<MenuToggle
		icon="⏬"
		title="Доп. кнопки: пауза"
		tooltipText="Добавляет кнопки 'сбросить таймер' и 'закрыть паузу'"
		isToggled={GlobalConfig.get("extraButtonsPauseOn")}
		onToggle={(v) => {
			GlobalConfig.set("extraButtonsPauseOn", v);
		}}
	/>

	<DeviderTheme />

	<MenuToggle
		icon="⏸️"
		title="Автопауза: меню"
		tooltipText="Автоматически ставить на паузу, когда меню открыто"
		isToggled={GlobalConfig.get("menuAutoPause")}
		onToggle={(v) => {
			GlobalConfig.set("menuAutoPause", v);
		}}
	/>

	<DeviderTheme />

	<MenuToggle
		icon="🖼️"
		title="Фон игроков"
		tooltipText="Использовать задний фон для игроков"
		isToggled={GlobalConfig.get("playerBackground")}
		onToggle={(v) => {
			GlobalConfig.set("playerBackground", v);
		}}
	/>

	<MenuToggle
		icon="🖼️"
		title="Скрыть элементы интерфейса"
		tooltipText="Скрывает все видимые элементы интерфейса: игроки, таймер и т.д."
		isToggled={GlobalConfig.get("hideAllUI")}
		onToggle={(v) => {
			GlobalConfig.set("hideAllUI", v);
		}}
	/>

	<MenuToggle
		icon="🖼️"
		title="Свой задний фон"
		tooltipText="Использовать свой загружанный задний фон"
		isToggled={GlobalConfig.get("usingBackroundImage")}
		onToggle={(v) => {
			GlobalConfig.set("usingBackroundImage", v);
		}}
	/>

	<MenuOptionList
		icon="🎨"
		title="Тема"
		tooltipText="Выберите визуальную тему"
		options={themeManager.getAvailableThemes()}
		selectedOption={GlobalConfig.get("theme")}
		onOptionSelect={(opt) => {
			GlobalConfig.set("theme", opt);
			themeManager.setTheme(opt);
		}}
	/>

	<MenuOptionList
		icon="🎨"
		title="Готовые конфиги"
		tooltipText="Встроенные конфиги"
		options={csHandler.getAvailableThemes()}
		onOptionSelect={async (opt) => {
			if (await csHandler.setConfigStyle(opt)) {
				await new Promise((resolve) => setTimeout(resolve, 500));
				location.reload();
			} else {
				console.error(`Ошибка в загрузке конфига: ${opt}`);
			}
		}}
	/>

	<MenuOptionList
		icon="🔂"
		title="Анимации режебьевки"
		tooltipText="Устанавливает анимацию игроков при разыгрывании жеребьевки"
		options={getShuffleNames()}
		selectedOption={GlobalConfig.get("shuffleAnimation")}
		onOptionSelect={(opt) => {
			GlobalConfig.set("shuffleAnimation", opt);
		}}
	/>

	<DeviderTheme />

	<MenuMedia
		icon="🎥"
		title="Фоновое медиа"
		tooltipText="Изображение или видео, которое будет использоваться в фоне. Поддерживаются png, jpeg, webp."
		supportedTypes={[
			"image/png",
			"image/jpeg",
			"image/webp",
			"video/mp4",
			"video/webm",
			"video/ogg",
		]}
		configKey="backgroundImage"
	/>

	<MenuMedia
		icon="🔊"
		title="Аудио: загрузить файл"
		tooltipText="Загрузи вступительный звук. Поддержка: mp3, wav, ogg"
		supportedTypes={["audio/mpeg", "audio/ogg", "audio/mp3"]}
		configKey="audioTimerEnd"
	/>

	<DeviderTheme />

	<MenuCoder
		icon="📋"
		title="Сохранить конфиг"
		text="Скачать конфиг"
		tooltipText="Скачивает .cfg файл со всей нужной информацией"
	/>

	<MenuDecoder
		icon="📥"
		title="Загрузить конфиг"
		tooltipText="Преобразовывает входную строку в конфиг"
	/>

	<DeviderTheme />

	<MenuHold
		icon="💾"
		title="Сбросить настройки"
		tooltipText="Сбрасывает текущие настройки и выставлояет стандартные."
		holdDuration={3000}
		onHoldComplete={async () => {
			await GlobalConfig.setConfig(dConfig);
			await GlobalConfig.deleteAllMedia();
			location.reload();
		}}
	/>

	<MenuClick
		icon="📍"
		title="Открыть гайд"
		tooltipText="Открывает гайд по использованию сайта"
		text="Нажми"
		onClick={() => IntroGuideVisiable.set(true)}
	/>
</SideMenu>
