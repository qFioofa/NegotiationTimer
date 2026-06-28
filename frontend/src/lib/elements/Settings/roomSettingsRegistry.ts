import {
	Info,
	Smile,
	Camera,
	MoreHorizontal,
	Timer,
	Hand,
	Maximize2,
	Hash,
	Image,
	UserRound,
	Users,
	RefreshCw,
	Pause,
} from "lucide-svelte";

export const roomCategories = [
	{ id: "info", label: "Информация", icon: Info },
	{ id: "members", label: "Участники", icon: Users },
	{ id: "reactions", label: "Реакции", icon: Smile },
	{ id: "camera", label: "Камера", icon: Camera },
	{ id: "profile", label: "Профиль", icon: UserRound },
	{ id: "other", label: "Другое", icon: MoreHorizontal },
];

export const roomSettings = [
	{
		id: "reactionsEnabled",
		category: "reactions",
		type: "toggle",
		icon: Smile,
		title: "Реакции",
		description:
			"Показывает по краям экрана кнопки реакций и проигрывает летящие эмодзи и стикеры — свои и от других участников комнаты. Если выключено, док с реакциями скрыт и чужие реакции не отображаются.",
		tooltip: "Включает реакции и стикеры в комнате",
		keywords: ["реакции", "стикеры", "эмодзи", "reactions"],
		configKey: "reactionsEnabled",
	},
	{
		id: "reactionLifetime",
		category: "reactions",
		type: "optionList",
		icon: Timer,
		title: "Время жизни стикера",
		description:
			"Сколько секунд летящий стикер виден на экране, прежде чем растворится. Больше значение — реакция держится дольше, но при спаме их накапливается больше одновременно.",
		tooltip: "Длительность анимации летящего стикера",
		keywords: ["время", "длительность", "стикер", "жизнь"],
		configKey: "reactionLifetime",
		getOptions: () => ["2 сек", "5 сек", "8 сек", "12 сек"],
	},
	{
		id: "reactionCooldown",
		category: "reactions",
		type: "optionList",
		icon: Hand,
		title: "Задержка между реакциями",
		description:
			"Минимальный интервал между вашими отправками реакций — защита от спама. Реакции, отправленные чаще, игнорируются. Меньше значение — можно слать чаще.",
		tooltip: "Антиспам: пауза между своими реакциями",
		keywords: ["задержка", "антиспам", "кулдаун", "cooldown"],
		configKey: "reactionCooldown",
		getOptions: () => ["0.2 сек", "0.4 сек", "1 сек", "2 сек"],
	},
	{
		id: "reactionSize",
		category: "reactions",
		type: "optionList",
		icon: Maximize2,
		title: "Размер стикеров",
		description:
			"Насколько крупными летят стикеры и эмодзи у всех в комнате. Больше — заметнее на проекторе, но и сильнее перекрывают экран при спаме.",
		tooltip: "Масштаб летящих реакций",
		keywords: ["размер", "масштаб", "крупные", "size"],
		configKey: "reactionSize",
		getOptions: () => ["Маленькие", "Средние", "Большие"],
	},
	{
		id: "reactionNumbersOn",
		category: "reactions",
		type: "toggle",
		icon: Hash,
		title: "Раздел «Цифры»",
		description:
			"Показывать ли вкладку с цифрами в пикере реакций. Если выключено, вкладка скрыта у всех участников.",
		tooltip: "Вкладка цифр в пикере реакций",
		keywords: ["цифры", "числа", "раздел", "вкладка"],
		configKey: "reactionNumbersOn",
	},
	{
		id: "reactionMemesOn",
		category: "reactions",
		type: "toggle",
		icon: Image,
		title: "Раздел «Мемы»",
		description:
			"Показывать ли вкладку с мем-стикерами в пикере реакций. Удобно отключить на серьёзной встрече.",
		tooltip: "Вкладка мемов в пикере реакций",
		keywords: ["мемы", "стикеры", "раздел", "вкладка"],
		configKey: "reactionMemesOn",
	},
];

export const profileAutoSync = {
	id: "autoSyncHost",
	category: "profile",
	type: "toggle",
	icon: RefreshCw,
	title: "Синхронизировать с хостом",
	description:
		"Когда хост меняет оформление комнаты — тему, цвет, фон или звук — изменения подтянутся к тебе автоматически. Остальные твои настройки не тронутся.",
	tooltip: "Авто-применение стиля хоста",
	configKey: "autoSyncHost",
};

export const profileTimerSync = {
	id: "syncTimerActions",
	category: "profile",
	type: "toggle",
	icon: Pause,
	title: "Синхронизировать паузу и финиш",
	description:
		"Пауза и экран «Время вышло!» синхронизируются со всей комнатой: поставил на паузу или закрыл финиш — то же случится у остальных.",
	tooltip: "Синхронизация паузы и завершения таймера",
	configKey: "syncTimerActions",
};
