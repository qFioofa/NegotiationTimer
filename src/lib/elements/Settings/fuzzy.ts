// Rofi-подобный нечёткий матчер: проверяет, что `query` — подпоследовательность
// `text`, и возвращает score (больше = лучше) или null, если совпадения нет.
// Бонусы за начало слова и подряд идущие символы дают «прощающий опечатки» поиск.
export function fuzzyScore(query: string, text: string): number | null {
	if (!query) return 0;
	const q = query.toLowerCase();
	const t = text.toLowerCase();

	let score = 0;
	let qi = 0;
	let prevMatch = -2;

	for (let ti = 0; ti < t.length && qi < q.length; ti++) {
		if (t[ti] !== q[qi]) continue;

		score += 1;
		if (ti === prevMatch + 1) score += 5; // подряд идущие символы
		if (ti === 0 || /[\s\-_/.,:]/.test(t[ti - 1])) score += 10; // начало слова

		prevMatch = ti;
		qi++;
	}

	return qi === q.length ? score : null;
}

// Лучший score настройки по полям с приоритетом title → description → tooltip → keywords.
// Вес поля прибавляется к score, поэтому совпадение в title всегда ранжируется выше.
export function settingScore(
	query: string,
	s: {
		title?: string;
		description?: string;
		tooltip?: string;
		keywords?: string[];
	},
): number | null {
	const fields: [string | undefined, number][] = [
		[s.title, 1000],
		[s.description, 500],
		[s.tooltip, 200],
		[s.keywords?.join(" "), 100],
	];

	let best: number | null = null;
	for (const [text, weight] of fields) {
		if (!text) continue;
		const sc = fuzzyScore(query, text);
		if (sc !== null) best = Math.max(best ?? -Infinity, sc + weight);
	}
	return best;
}
