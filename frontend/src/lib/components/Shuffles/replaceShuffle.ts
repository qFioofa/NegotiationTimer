interface ReplaceShuffleOptions {
	initialDelay?: number;
	maxDelay?: number;
}

export function replaceShuffle(
	element1: HTMLElement,
	element2: HTMLElement,
	options: ReplaceShuffleOptions = {},
): Promise<number> {
	const { initialDelay = 15, maxDelay = 400 } = options;

	return new Promise((resolve) => {
		let delay = initialDelay;
		let active = true;

		function togglePlayers() {
			const val = element1.textContent?.trim();
			element1.textContent = val === "1" ? "2" : "1";
			element2.textContent = element1.textContent === "1" ? "2" : "1";
		}

		function applyFinalResult(resultIndex: number) {
			element1.textContent = resultIndex === 0 ? "1" : "2";
			element2.textContent = resultIndex === 0 ? "2" : "1";
		}

		function shuffle() {
			if (!active) return;

			if (delay > maxDelay) {
				const result = Math.round(Math.random());
				applyFinalResult(result);
				active = false;
				resolve(result);
				return;
			}

			togglePlayers();

			setTimeout(
				() => {
					delay *= 1.2;
					shuffle();
				},
				Math.max(delay, 50),
			);
		}

		shuffle();
	});
}
