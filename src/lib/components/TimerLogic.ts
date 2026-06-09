type TimeListener = (ms: number) => void;
type RunningListener = (running: boolean) => void;
type Unsubscribe = () => void;

export default class TimerLogic {
    private time: number;
    private isRunning: boolean;
    private intervalId: ReturnType<typeof setInterval> | null;
    private updateCallbacks: TimeListener[];
    private runningCallbacks: RunningListener[];
    private isInverted: boolean;
    private timerSpan: TimeListener;

    constructor(isInverted = false) {
        this.time = 0;
        this.isRunning = false;
        this.intervalId = null;
        this.updateCallbacks = [];
        this.runningCallbacks = [];
        this.isInverted = isInverted;
        this.timerSpan = () => { };

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
            this.updateCallbacks = this.updateCallbacks.filter(cb => cb !== callback);
        };
    }

    addRunningListener(callback: RunningListener): Unsubscribe {
        this.runningCallbacks.push(callback);
        return () => {
            this.runningCallbacks = this.runningCallbacks.filter(cb => cb !== callback);
        };
    }

    addTimerSnap(callback: TimeListener): void {
        this.timerSpan = callback;
    }

    notifyUpdate(): void {
        this.updateCallbacks.forEach(cb => cb(this.time));
    }

    notifyRunningChange(): void {
        this.runningCallbacks.forEach(cb => cb(this.isRunning));
    }

    launch(): void {
        if (this.isRunning) return;
        if (!this.isInverted && this.time <= 0) return;

        this.timerSpan(this.time);
        this.isRunning = true;
        this.notifyRunningChange();

        this.intervalId = setInterval(() => {
            if (this.isInverted) {
                this.time = Math.min(this.time + 1000, 3599000);
                this.notifyUpdate();

                if (this.time >= 3599000) {
                    this.pause();
                }
            } else {
                this.time = Math.max(0, this.time - 1000);
                this.notifyUpdate();

                if (this.time === 0) {
                    this.pause();
                }
            }
        }, 1000);
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
            this.time = Math.min(this.time, 3599000);
        }
        this.notifyUpdate();
    }

    timeSubtract(seconds: number): void {
        if (this.isInverted) {
            this.time = Math.max(0, this.time - seconds * 1000);
        } else {
            const reduction = seconds * 1000;
            this.time = Math.max(0, this.time - reduction);
            if (this.isRunning && this.time === 0) {
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
