import {
	LayoutGrid,
	Palette,
	MousePointerClick,
	Film,
	Keyboard,
	Image,
	Volume2,
	User,
	Sparkles,
	MonitorOff,
	Music,
	Wrench,
	ChevronsDown,
	ChevronsUp,
	Pause,
	Play,
	Layers,
	EyeOff,
	Eye,
	Pipette,
	Package,
	Shuffle,
	Video,
	FileAudio,
	ClipboardCopy,
	Upload,
	RotateCcw,
	CircleQuestionMark,
} from "lucide-svelte";
import { themeManager, csHandler } from "$lib/cssStyles/themeHanager";
import {
	GlobalConfig,
	IntroGuideVisiable,
	ShuffleFunction,
} from "$lib/stores/parameters";
import { getShuffleNames } from "$lib/components/Shuffle";
import { togglePause, isPaused } from "$lib/components/Pause";
import { toggleTimer, timeAdd, timeSubtract } from "$lib/stores/timerDown";
import { toggleUpTimer } from "$lib/stores/timerUp";
import { setBindListener } from "$lib/components/utils/BindUtils";
import { mmssToSeconds } from "$lib/components/utils/TimerUtils";
import { get } from "svelte/store";

async function handleShuffle() {
	const shuffle = await get(ShuffleFunction);
	if (shuffle) await shuffle();
}

function anyTimerToggle() {
	if (get(isPaused)) {
		toggleUpTimer();
		return;
	}
	toggleTimer();
}

function stepSeconds(): number {
	return mmssToSeconds(GlobalConfig.get("timeAddSubStep") as string);
}

export const ALL_CATEGORY = "all";

export const categories = [
	{ id: ALL_CATEGORY, label: "Все", icon: LayoutGrid },
	{ id: "appearance", label: "Внешний вид", icon: Palette },
	{ id: "interaction", label: "Взаимодействие", icon: MousePointerClick },
	{ id: "animations", label: "Анимации", icon: Film },
	{ id: "layout", label: "Раскладка", icon: Keyboard },
	{ id: "media", label: "Медиа", icon: Image },
	{ id: "sound", label: "Звук", icon: Volume2 },
	{ id: "profile", label: "Профиль", icon: User },
	{ id: "other", label: "Другое", icon: Sparkles },
];

export const settings = [
	{
		id: "timerBlackOut",
		category: "appearance",
		type: "toggle",
		icon: MonitorOff,
		title: "Чёрный экран",
		description:
			"Когда таймер доходит до нуля, весь экран заливается чёрным цветом. Это резко обозначает конец раунда и переключает внимание участников. Удобно для презентаций и переговоров, где нужен явный сигнал окончания.",
		tooltip: "При завершении времени появляется черный экран",
		keywords: ["затемнение", "blackout", "конец", "финиш"],
		configKey: "timerBlackOut",
	},
	{
		id: "afterSound",
		category: "sound",
		type: "toggle",
		icon: Music,
		title: "Звук",
		description:
			"По окончании отсчёта проигрывается звуковой сигнал. Так о завершении времени можно узнать, даже не глядя на экран. Собственный звук загружается в разделе «Звук».",
		tooltip: "Воспроизводит звук по завершении времени",
		keywords: ["аудио", "sound", "конец", "сигнал"],
		configKey: "afterSound",
	},
	{
		// @deprecated Мёртвая настройка: после перехода на выпадающую плашку времени
		// (иконка-часы) hover-открытие больше не реализовано. Тумблер ни на что не влияет.
		id: "panelAutoOpen",
		category: "interaction",
		type: "toggle",
		icon: Wrench,
		title: "Выдвигать панель",
		description:
			"Боковая панель выезжает сама, как только курсор оказывается над её иконкой. Не нужно кликать — достаточно навести мышь. Если выключено, панель открывается только по клику.",
		tooltip: "Автоматически выдвигать панель, когда мышка на иконке панели",
		keywords: ["панель", "автооткрытие", "наведение", "hover"],
		configKey: "panelAutoOpen",
	},
	{
		id: "extraButtonsOn",
		category: "interaction",
		type: "toggle",
		icon: ChevronsDown,
		title: "Доп. кнопки: меню",
		description:
			"Показывает в меню дополнительные кнопки: сброс таймера до начального значения и постановку на паузу. Это ускоряет управление во время сессии без захода в настройки. Полезно, когда нужно часто перезапускать или приостанавливать отсчёт.",
		tooltip:
			"Добавляет кнопки 'сбросить таймер до начального значения' и 'пауза'",
		keywords: ["кнопки", "сброс", "пауза", "меню"],
		configKey: "extraButtonsOn",
	},
	{
		id: "extraButtonsPauseOn",
		category: "interaction",
		type: "toggle",
		icon: ChevronsDown,
		title: "Доп. кнопки: пауза",
		description:
			"Добавляет на экран паузы кнопки сброса таймера и закрытия паузы. Так отсчётом можно управлять прямо из режима паузы. Удобно для быстрого возврата к работе или перезапуска раунда.",
		tooltip: "Добавляет кнопки 'сбросить таймер' и 'закрыть паузу'",
		keywords: ["кнопки", "сброс", "пауза"],
		configKey: "extraButtonsPauseOn",
	},
	{
		id: "menuAutoPause",
		category: "interaction",
		type: "toggle",
		icon: Pause,
		title: "Автопауза: меню",
		description:
			"Пока открыто меню настроек, таймер автоматически приостанавливается. Время не расходуется, пока вы что-то настраиваете. При закрытии меню отсчёт продолжается с того же места.",
		tooltip: "Автоматически ставить на паузу, когда меню открыто",
		keywords: ["пауза", "меню", "авто"],
		configKey: "menuAutoPause",
	},
	{
		id: "proximityTabs",
		category: "interaction",
		type: "multiOption",
		icon: Eye,
		title: "Проявление при наведении",
		description:
			"Выбранные кнопки в правом верхнем углу прячутся и плавно проявляются, когда курсор приближается к ним. Это освобождает экран — кнопки не мешают, но всегда под рукой.",
		tooltip: "Скрывать выбранные верхние кнопки до приближения курсора",
		keywords: ["проявление", "наведение", "hover", "кнопки", "угол", "скрыть"],
		configKey: "proximityTabs",
		getOptions: () => [
			{ value: "settings", label: "Настройки" },
			{ value: "timer", label: "Таймер" },
			{ value: "server", label: "Сервер" },
			{ value: "online", label: "В сети" },
		],
	},
	{
		id: "playerBackground",
		category: "appearance",
		type: "toggle",
		icon: Layers,
		title: "Фон игроков",
		description:
			"Включает отдельную подложку под карточками игроков, выделяя их на общем фоне. Это улучшает читаемость имён и результатов. Без неё игроки отображаются прямо поверх основного фона.",
		tooltip: "Использовать задний фон для игроков",
		keywords: ["игроки", "фон", "background"],
		configKey: "playerBackground",
	},
	{
		id: "hideAllUI",
		category: "appearance",
		type: "toggle",
		icon: EyeOff,
		title: "Скрыть элементы интерфейса",
		description:
			"Убирает с экрана все видимые элементы: игроков, таймер и панели управления. Остаётся только чистый фон. Полезно для скриншотов, демонстраций или когда нужен полностью свободный экран.",
		tooltip:
			"Скрывает все видимые элементы интерфейса: игроки, таймер и т.д.",
		keywords: ["скрыть", "интерфейс", "ui", "чисто"],
		configKey: "hideAllUI",
	},
	{
		id: "usingBackroundImage",
		category: "appearance",
		type: "toggle",
		icon: Image,
		title: "Свой задний фон",
		description:
			"Использует загруженное вами изображение или видео в качестве заднего фона. Сам файл задаётся в разделе «Медиа». Если выключено, применяется стандартный фон темы.",
		tooltip: "Использовать свой загружанный задний фон",
		keywords: ["фон", "изображение", "своё", "background"],
		configKey: "usingBackroundImage",
	},
	{
		id: "theme",
		category: "appearance",
		type: "optionList",
		icon: Palette,
		title: "Тема",
		description:
			"Меняет цветовую схему и общий стиль оформления интерфейса. Доступные темы подгружаются автоматически и применяются мгновенно. Выбор сохраняется и восстанавливается при следующем запуске.",
		tooltip: "Выберите визуальную тему",
		keywords: ["тема", "цвет", "оформление", "theme"],
		configKey: "theme",
		getOptions: () => themeManager.getAvailableThemes(),
		onSelect: (opt: string) => themeManager.setTheme(opt),
	},
	{
		id: "accentColor",
		category: "appearance",
		type: "color",
		icon: Pipette,
		title: "Цвет акцента",
		description:
			"Переопределяет акцентный (внутренний) цвет выбранной темы своим цветом. Сам пресет темы остаётся прежним — меняется только основной цвет. «Сброс» возвращает родной цвет темы. Выбор сохраняется между запусками.",
		tooltip: "Свой акцентный цвет поверх текущей темы",
		keywords: ["цвет", "акцент", "color", "тема", "пресет"],
		configKey: "accentColor",
		onSelect: (color: string | null) => themeManager.setAccent(color),
	},
	{
		id: "presetConfig",
		category: "profile",
		type: "optionList",
		icon: Package,
		title: "Готовые конфиги",
		description:
			"Применяет один из встроенных готовых наборов настроек целиком. После выбора страница автоматически перезагружается, чтобы изменения вступили в силу. Это быстрый способ переключаться между заранее подготовленными конфигурациями.",
		tooltip: "Встроенные конфиги",
		keywords: ["конфиг", "пресет", "preset", "готовый"],
		getOptions: () => csHandler.getAvailableThemes(),
		onSelect: async (opt: string) => {
			if (await csHandler.setConfigStyle(opt)) {
				await new Promise((resolve) => setTimeout(resolve, 500));
				location.reload();
			} else {
				console.error(`Ошибка в загрузке конфига: ${opt}`);
			}
		},
	},
	{
		id: "shuffleAnimation",
		category: "animations",
		type: "optionList",
		icon: Shuffle,
		title: "Анимации жеребьёвки",
		description:
			"Задаёт, как именно анимируются игроки во время жеребьёвки. Разные варианты по-разному показывают процесс случайного выбора. Это чисто визуальная настройка — на сам результат жеребьёвки она не влияет.",
		tooltip: "Устанавливает анимацию игроков при разыгрывании жеребьевки",
		keywords: ["жеребьёвка", "анимация", "shuffle", "игроки"],
		configKey: "shuffleAnimation",
		getOptions: () => getShuffleNames(),
	},
	{
		id: "backgroundImage",
		category: "media",
		type: "media",
		icon: Video,
		title: "Фоновое медиа",
		description:
			"Загружает изображение или видео, которое используется как фон приложения. Поддерживаются форматы png, jpeg, webp, а также видео mp4, webm и ogg. Файл сохраняется локально и подгружается при следующем запуске.",
		tooltip:
			"Изображение или видео, которое будет использоваться в фоне. Поддерживаются png, jpeg, webp.",
		keywords: ["фон", "видео", "изображение", "медиа", "background"],
		configKey: "backgroundImage",
		supportedTypes: [
			"image/png",
			"image/jpeg",
			"image/webp",
			"video/mp4",
			"video/webm",
			"video/ogg",
		],
	},
	{
		id: "audioTimerEnd",
		category: "sound",
		type: "media",
		icon: FileAudio,
		title: "Аудио: загрузить файл",
		description:
			"Загружает собственный звук, который проигрывается по окончании отсчёта. Поддерживаются форматы mp3 и ogg. Чтобы звук был слышен, должна быть включена настройка «Звук».",
		tooltip: "Загрузи вступительный звук. Поддержка: mp3, wav, ogg",
		keywords: ["звук", "аудио", "файл", "mp3"],
		configKey: "audioTimerEnd",
		supportedTypes: ["audio/mpeg", "audio/ogg", "audio/mp3"],
	},
	{
		id: "saveConfig",
		category: "profile",
		type: "coder",
		icon: ClipboardCopy,
		title: "Сохранить конфиг",
		description:
			"Сохраняет текущие настройки и загруженные медиа в файл .cfg. Этот файл можно перенести на другое устройство или оставить как резервную копию. Позже его легко загрузить обратно через «Загрузить конфиг».",
		tooltip: "Скачивает .cfg файл со всей нужной информацией",
		keywords: ["сохранить", "экспорт", "конфиг", "скачать"],
		text: "Скачать конфиг",
	},
	{
		id: "loadConfig",
		category: "profile",
		type: "decoder",
		icon: Upload,
		title: "Загрузить конфиг",
		description:
			"Восстанавливает настройки и медиа из ранее сохранённого файла .cfg. После загрузки страница перезагружается, чтобы применить изменения. Подходит для переноса конфигурации между устройствами или отката к резервной копии.",
		tooltip: "Преобразовывает входную строку в конфиг",
		keywords: ["загрузить", "импорт", "конфиг"],
	},
	{
		id: "resetConfig",
		category: "profile",
		type: "hold",
		icon: RotateCcw,
		title: "Сбросить настройки",
		description:
			"Сбрасывает все настройки к значениям по умолчанию и удаляет загруженные медиафайлы. Чтобы случайно ничего не стереть, кнопку нужно удерживать несколько секунд. После сброса страница перезагрузится.",
		tooltip: "Сбрасывает текущие настройки и выставлояет стандартные.",
		keywords: ["сброс", "по умолчанию", "reset", "стандартные"],
		holdDuration: 3000,
		onHoldComplete: async () => {
			// Пишем дефолты без notify — reload всё равно переинициализирует UI,
			// поэтому реактивный каскад по каждому ключу был бы пустой работой.
			GlobalConfig.default().save();
			await GlobalConfig.deleteAllMedia();
			location.reload();
		},
	},
	{
		id: "openGuide",
		category: "other",
		type: "click",
		icon: CircleQuestionMark,
		title: "Открыть гайд",
		description:
			"Запускает пошаговый гайд по основным возможностям приложения. Он показывает, как пользоваться таймером, панелями и настройками. Полезно при первом знакомстве или чтобы вспомнить забытые функции.",
		tooltip: "Открывает гайд по использованию сайта",
		keywords: ["гайд", "помощь", "guide", "туториал"],
		text: "Нажми",
		onClick: () => IntroGuideVisiable.set(true),
	},
	{
		id: "shuffleKey",
		category: "layout",
		type: "bind",
		icon: Shuffle,
		title: "Жеребьёвка: клавиша",
		description:
			"Назначьте клавишу, по нажатию которой запускается жеребьёвка игроков. Нажмите «Установить клавишу» и затем нужную кнопку на клавиатуре. Бинд работает на любой странице и не требует открытой панели.",
		tooltip: "Назначьте клавишу для перемешивания",
		keywords: ["жеребьёвка", "бинд", "клавиша", "shuffle", "хоткей"],
		configKey: "shuffleKey",
		action: handleShuffle,
	},
	{
		id: "pauseKey",
		category: "layout",
		type: "bind",
		icon: Pause,
		title: "Пауза: клавиша",
		description:
			"Назначьте клавишу для постановки таймера на паузу и снятия с неё. Одно нажатие переключает состояние паузы. Удобно быстро останавливать отсчёт во время переговоров, не отвлекаясь на мышь.",
		tooltip: "Назначьте клавишу для паузы",
		keywords: ["пауза", "бинд", "клавиша", "pause", "хоткей"],
		configKey: "pauseKey",
		action: togglePause,
	},
	{
		id: "toggleTimer",
		category: "layout",
		type: "bind",
		icon: Play,
		title: "Таймер: клавиша",
		description:
			"Назначьте клавишу, которая запускает или останавливает таймер. Если включена пауза, та же клавиша управляет таймером отсчёта вверх. Это основной горячий бинд для управления временем без мыши.",
		tooltip: "Назначьте клавишу для включения любого таймера",
		keywords: ["таймер", "бинд", "клавиша", "старт", "хоткей"],
		configKey: "toggleTimer",
		action: anyTimerToggle,
	},
	{
		id: "addTimeKey",
		category: "layout",
		type: "bind",
		icon: ChevronsUp,
		title: "Добавить время: клавиша",
		description:
			"Назначьте клавишу, по нажатию которой к таймеру прибавляется шаг времени. Размер шага задаётся настройкой «Добавить/убавить время» в плашке времени. Удобно докидывать минуты прямо во время переговоров, не открывая панель.",
		tooltip: "Назначьте клавишу для добавления шага времени",
		keywords: ["время", "бинд", "клавиша", "добавить", "плюс", "хоткей"],
		configKey: "addTimeKey",
		action: () => timeAdd(stepSeconds()),
	},
	{
		id: "subTimeKey",
		category: "layout",
		type: "bind",
		icon: ChevronsDown,
		title: "Убавить время: клавиша",
		description:
			"Назначьте клавишу, по нажатию которой от таймера отнимается шаг времени. Размер шага общий с кнопками «+/−» в плашке времени. Позволяет быстро срезать время без мыши.",
		tooltip: "Назначьте клавишу для вычитания шага времени",
		keywords: ["время", "бинд", "клавиша", "убавить", "минус", "хоткей"],
		configKey: "subTimeKey",
		action: () => timeSubtract(stepSeconds()),
	},
];

// Глобальная регистрация биндов при старте приложения — независимо от того,
// открыта ли модалка настроек. Вызывается из +page.svelte onMount.
export function registerBinds() {
	for (const raw of settings) {
		const s = raw as any;
		if (s.type !== "bind") continue;
		const key = GlobalConfig.get(s.configKey) as string;
		if (key) setBindListener(key, s.action);
	}
}
