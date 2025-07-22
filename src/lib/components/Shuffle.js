export default class ElementShuffler {
    constructor(playerElements, delayStart = 15, maxDelay = 400) {
        this.playerElements = playerElements;
        this.initialDelay = delayStart;
        this.maxDelay = maxDelay;

        this.timeoutId = null;
        this.delay = delayStart;
        this.active = false;
    }

    launch() {
        this.stop();
        this.delay = this.initialDelay;
        this.active = true;
        this._shuffle();
    }

    _shuffle() {
        if (!this.active) return;

        if (this.delay > this.maxDelay) {
            const result = Math.round(Math.random());
            this._applyFinalResult(result);
            this.active = false;
            return;
        }

        this._togglePlayers();

        this.timeoutId = setTimeout(() => {
            this.delay *= 1.2;
            this._shuffle();
        }, Math.max(this.delay, 50));
    }

    _togglePlayers() {
        if (this.playerElements.length < 2) return;
        const [p1, p2] = this.playerElements;

        const val = p1.textContent.trim();
        p1.textContent = val === "1" ? "2" : "1";
        p2.textContent = p1.textContent === "1" ? "2" : "1";
    }

    _applyFinalResult(resultIndex) {
        const [p1, p2] = this.playerElements;
        p1.textContent = resultIndex === 0 ? "1" : "2";
        p2.textContent = resultIndex === 0 ? "2" : "1";
    }

    stop() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        this.active = false;
    }
}
