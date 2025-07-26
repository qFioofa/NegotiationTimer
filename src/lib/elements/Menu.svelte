<script>
	import { isPaused, setPause } from "$lib/components/Pause";
	import { GlobalConfig, IntroGuideVisiable } from "$lib/stores/parameters";
	import { dConfig } from "$lib/stores/defaultConfig";
	import IntroGuide from "./IntroGuide.svelte";
	import themeManager from "$lib/cssStyles/themeHanager";

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
		onToggle={v => {
			GlobalConfig.set("timerBlackOut", v);
		}}
	/>

	<MenuToggle
		icon="🛠"
		title="Выдвигать панель"
		tooltipText="Автоматически выдвигать панель, когда мышка на иконке панели"
		isToggled={GlobalConfig.get("panelAutoOpen")}
		onToggle={v => {
			GlobalConfig.set("panelAutoOpen", v);
		}}
	/>

	<MenuToggle
		icon="⏸️"
		title="Автопауза: панель"
		tooltipText="Автоматически ставить на паузу, когда панель открыта"
		isToggled={GlobalConfig.get("panelAutoPause")}
		onToggle={v => {
			GlobalConfig.set("panelAutoPause", v);
		}}
	/>

	<MenuToggle
		icon="⏸️"
		title="Автопауза: меню"
		tooltipText="Автоматически ставить на паузу, когда меню открыто"
		isToggled={GlobalConfig.get("menuAutoPause")}
		onToggle={v => {
			GlobalConfig.set("menuAutoPause", v);
		}}
	/>

	<MenuToggle
		icon="🎵"
		title="Звук"
		tooltipText="Воспроизводит звук по завершении времени"
		isToggled={GlobalConfig.get("afterSound")}
		onToggle={v => {
			GlobalConfig.set("afterSound", v);
		}}
	/>

	<MenuToggle
		icon="🖼️"
		title="Фон игроков"
		tooltipText="Использовать задний фон для игроков (Требует перезагрузки страницы)"
		isToggled={GlobalConfig.get("playerBackground")}
		onToggle={v => {
			GlobalConfig.set("playerBackground", v);
		}}
	/>

	<MenuToggle
		icon="🖼️"
		title="Свой задний фон"
		tooltipText="Использовать свой загружанный задний фон (Требует перезагрузки страницы)"
		isToggled={GlobalConfig.get("usingBackroundImage")}
		onToggle={v => {
			GlobalConfig.set("usingBackroundImage", v);
		}}
	/>

	<MenuOptionList
		icon="🎨"
		title="Тема"
		tooltipText="Выберите визуальную тему"
		options={themeManager.getAvailableThemes()}
		selectedOption={GlobalConfig.get("theme")}
		onOptionSelect={opt => {
			GlobalConfig.set("theme", opt);
			themeManager.setTheme(opt);
		}}
	/>

	<MenuMedia
		icon="🎥"
		title="Фоновое медиа"
		tooltipText="Изображение или видео, которое будет использоваться в фоне. Поддерживаются PNG, JPEG, WEBP, MP4, WebM и OGG."
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
