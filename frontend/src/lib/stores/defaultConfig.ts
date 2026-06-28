export type AppConfig = {
	timerDuration: number;
	setTime: string;
	timeAddSubStep: string;
	shuffleKey: string;
	toggleTimer: string;
	pauseKey: string;
	addTimeKey: string;
	subTimeKey: string;
	theme: string;
	/** Кастомный акцентный цвет поверх пресета. null = использовать цвет темы. */
	accentColor: string | null;
	shuffleAnimation: string;
	hideAllUI: boolean;
	extraButtonsOn: boolean;
	extraButtonsPauseOn: boolean;
	panelAutoPause: boolean;
	/** @deprecated Не влияет ни на что после перехода на выпадающую плашку времени. */
	panelAutoOpen: boolean;
	menuAutoPause: boolean;
	timerBlackOut: boolean;
	timerEndSound: boolean;
	afterSound: boolean;
	introGuide: boolean;
	audioTimerEnd: string | null;
	playerBackground: boolean;
	usingBackroundImage: boolean;
	backgroundImage: string | null;
	/** Реакции в комнате: показывать док с реакциями и принимать чужие. */
	reactionsEnabled: boolean;
	/** Время жизни летящего стикера, секунды (строка-лейбл из optionList). */
	reactionLifetime: string;
	/** Антиспам: минимум между своими отправками, секунды (строка-лейбл). */
	reactionCooldown: string;
	/** Размер летящих стикеров (строка-лейбл из optionList). */
	reactionSize: string;
	/** Показывать вкладку «Цифры» в пикере реакций. */
	reactionNumbersOn: boolean;
	/** Показывать вкладку «Мемы» в пикере реакций. */
	reactionMemesOn: boolean;
};

export const dConfig: AppConfig = {
	timerDuration: 55,
	setTime: "04:00",
	timeAddSubStep: "00:05",
	shuffleKey: "KeyR",
	toggleTimer: "KeyW",
	pauseKey: "Space",
	addTimeKey: "ArrowUp",
	subTimeKey: "ArrowDown",
	theme: "green",
	accentColor: null,
	shuffleAnimation: "Replace",
	hideAllUI: false,
	extraButtonsOn: true,
	extraButtonsPauseOn: true,
	panelAutoPause: true,
	panelAutoOpen: true,
	menuAutoPause: true,
	timerBlackOut: true,
	timerEndSound: true,
	afterSound: true,
	introGuide: true,
	audioTimerEnd: null,
	playerBackground: true,
	usingBackroundImage: false,
	backgroundImage: null,
	reactionsEnabled: true,
	reactionLifetime: "5 сек",
	reactionCooldown: "0.4 сек",
	reactionSize: "Средние",
	reactionNumbersOn: true,
	reactionMemesOn: true,
};
