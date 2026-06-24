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
};
