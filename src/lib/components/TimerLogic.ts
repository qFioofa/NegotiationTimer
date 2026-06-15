type TimeListener = (ms: number) => void;
type RunningListener = (running: boolean) => void;
type Unsubscribe = () => void;

const MAX_TIME_MS = 59 * 60_000 + 59 * 1_000;
const TICK_MS = 250;

export default class TimerLogic {
	private time: number;
	private isRunning: boolean;
	private intervalId: ReturnType<typeof setInterval> | null;
	private updateCallbacks: TimeListener[];
	private runningCallbacks: RunningListener[];
	private isInverted: boolean;
	private timerSnap: TimeListener;
	private anchorTimestamp: number;
	private anchorValue: number;

	constructor(isInverted = false) {
		this.time = 0;
		this.isRunning = false;
		this.intervalId = null;
		this.updateCallbacks = [];
		this.runningCallbacks = [];
		this.isInverted = isInverted;
		this.timerSnap = () => {};
		this.anchorTimestamp = 0;
		this.anchorValue = 0;

		this.launch = this.launch.bind(this);
		this.pause = this.pause.bind(this);
		this.toggle = this.toggle.bind(this);
		this.timeAdd = this.timeAdd.bind(this);
		this.timeSubtract = this.timeSubtract.bind(this);
		this.toMs = this.toMs.bind(this);
	}

	addUpdateListener(callback: TimeListener): Unsubscribe {
		this.updateCallbacks.push(callback);
		return () => {
			this.updateCallbacks = this.updateCallbacks.filter(
				(cb) => cb !== callback,
			);
		};
	}

	addRunningListener(callback: RunningListener): Unsubscribe {
		this.runningCallbacks.push(callback);
		return () => {
			this.runningCallbacks = this.runningCallbacks.filter(
				(cb) => cb !== callback,
			);
		};
	}

	addTimerSnap(callback: TimeListener): void {
		this.timerSnap = callback;
	}

	notifyUpdate(): void {
		this.updateCallbacks.forEach((cb) => cb(this.time));
	}

	notifyRunningChange(): void {
		this.runningCallbacks.forEach((cb) => cb(this.isRunning));
	}

	// Snapshot the current value as the wall-clock anchor. The running time is
	// recomputed from this anchor on every tick instead of being decremented,
	// which keeps it accurate regardless of timer jitter or tab throttling.
	private anchor(): void {
		this.anchorTimestamp = Date.now();
		this.anchorValue = this.time;
	}

	private tick(): void {
		const elapsed = Date.now() - this.anchorTimestamp;

		if (this.isInverted) {
			this.time = Math.min(this.anchorValue + elapsed, MAX_TIME_MS);
			this.notifyUpdate();
			if (this.time >= MAX_TIME_MS) this.pause();
		} else {
			this.time = Math.max(0, this.anchorValue - elapsed);
			this.notifyUpdate();
			if (this.time <= 0) this.pause();
		}
	}

	launch(): void {
		if (this.isRunning) return;
		if (!this.isInverted && this.time <= 0) return;

		this.timerSnap(this.time);
		this.isRunning = true;
		this.anchor();
		this.notifyRunningChange();

		this.intervalId = setInterval(() => this.tick(), TICK_MS);
	}

	pause(): void {
		if (!this.isRunning) return;

		if (this.intervalId !== null) {
			clearInterval(this.intervalId);
		}
		this.isRunning = false;
		this.intervalId = null;
		this.notifyRunningChange();
	}

	toggle(): void {
		if (this.isRunning) {
			this.pause();
		} else {
			this.launch();
		}
	}

	timeAdd(seconds: number): void {
		this.time += seconds * 1000;
		if (!this.isInverted) {
			this.time = Math.min(this.time, MAX_TIME_MS);
		}
		if (this.isRunning) this.anchor();
		this.notifyUpdate();
	}

	timeSubtract(seconds: number): void {
		this.time = Math.max(0, this.time - seconds * 1000);
		if (this.isRunning) {
			this.anchor();
			if (!this.isInverted && this.time === 0) {
				this.pause();
			}
		}
		this.notifyUpdate();
	}

	toMs(): number {
		return this.time;
	}

	destroy(): void {
		this.pause();
		this.updateCallbacks = [];
		this.runningCallbacks = [];
	}
}
