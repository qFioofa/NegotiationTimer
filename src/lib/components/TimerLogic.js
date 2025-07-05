export class TimerLogic {
    constructor() {
        this.time = 0;
        this.isRunning = false;
        this.intervalId = NaN;
    }

    async launch() {
        if (this.isRunning || this.time <= 0) return;

        this.isRunning = true;
        this.intervalId = setInterval(() => {
            this.time = Math.max(0, this.time - 1000);
            if (this.time === 0) this.pause();
        }, 1000);
    }

    async pause() {
        if (!this.isRunning) return;

        clearInterval(this.intervalId);
        this.isRunning = false;
        this.intervalId = NaN;
    }

    /**
     * @param {number} seconds
     */
    async timeAdd(seconds) {
        this.time += seconds * 1000;
    }

    /**
     * @param {number} seconds
     */
    async timeSubtract(seconds) {
        const reduction = seconds * 1000;
        this.time = Math.max(0, this.time - reduction);

        if (this.isRunning && this.time === 0) {
            this.pause();
        }
    }

    toMs() {
        return this.time;
    }
}