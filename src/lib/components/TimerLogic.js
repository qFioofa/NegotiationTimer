export default class TimerLogic {
    constructor(isInverted = false) {
        this.time = isInverted ? 0 : 0;
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

    addUpdateListener(callback) {
        this.updateCallbacks.push(callback);
        return () => {
            this.updateCallbacks = this.updateCallbacks.filter(cb => cb !== callback);
        };
    }

    addRunningListener(callback) {
        this.runningCallbacks.push(callback);
        return () => {
            this.runningCallbacks = this.runningCallbacks.filter(cb => cb !== callback);
        };
    }

    addTimerSnap(callback) {
        this.timerSpan = callback;
    }

    notifyUpdate() {
        this.updateCallbacks.forEach(cb => cb(this.time));
    }

    notifyRunningChange() {
        this.runningCallbacks.forEach(cb => cb(this.isRunning));
    }

    launch() {
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

    pause() {
        if (!this.isRunning) return;

        clearInterval(this.intervalId);
        this.isRunning = false;
        this.intervalId = null;
        this.notifyRunningChange();
    }

    toggle() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.launch();
        }
    }

    timeAdd(seconds) {
        this.time += seconds * 1000;
        if (!this.isInverted) {
            this.time = Math.min(this.time, 3599000);
        }
        this.notifyUpdate();
    }

    timeSubtract(seconds) {
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

    toMs() {
        return this.time;
    }

    destroy() {
        this.pause();
        this.updateCallbacks = [];
        this.runningCallbacks = [];
    }
}
