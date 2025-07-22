export default class TimerLogic {
    constructor() {
        this.time = 0;
        this.isRunning = false;
        this.intervalId = null;
        this.updateCallbacks = [];
        this.runningCallbacks = [];

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

    notifyUpdate() {
        this.updateCallbacks.forEach(cb => cb(this.time));
    }

    notifyRunningChange() {
        this.runningCallbacks.forEach(cb => cb(this.isRunning));
    }

    launch() {
        if (this.isRunning || this.time <= 0) return;

        this.isRunning = true;
        this.notifyRunningChange();

        this.intervalId = setInterval(() => {
            this.time = Math.max(0, this.time - 1000);
            this.notifyUpdate();

            if (this.time === 0) {
                this.pause();
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
        this.notifyUpdate();
    }

    timeSubtract(seconds) {
        const reduction = seconds * 1000;
        this.time = Math.max(0, this.time - reduction);
        this.notifyUpdate();

        if (this.isRunning && this.time === 0) {
            this.pause();
        }
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