// #rgb / #rrggbb -> [h(0-360), s(0-100), l(0-100)]. Вход — всегда hex из <input type="color">.
export function hexToHsl(hex: string): [number, number, number] {
	let c = hex.replace("#", "");
	if (c.length === 3)
		c = c
			.split("")
			.map((x) => x + x)
			.join("");
	const r = parseInt(c.slice(0, 2), 16) / 255;
	const g = parseInt(c.slice(2, 4), 16) / 255;
	const b = parseInt(c.slice(4, 6), 16) / 255;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const d = max - min;
	const l = (max + min) / 2;
	let h = 0;
	let s = 0;
	if (d) {
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			default:
				h = (r - g) / d + 4;
		}
		h *= 60;
	}
	return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

export default class StyleHandler {
	private themes: Map<string, string>;
	private currentTheme: string;

	constructor(defaultTheme = "green") {
		this.themes = new Map();
		this.currentTheme = defaultTheme;
	}

	registerTheme(name: string, className?: string): void {
		this.themes.set(name, className || `theme-${name}`);
	}

	setTheme(name: string): void {
		const className = this.themes.get(name);
		if (className === undefined) return;
		if (typeof document === "undefined") return;

		this.removeAllThemeClasses();
		document.documentElement.classList.add(className);
		this.currentTheme = name;
	}

	// Все переменные, которые перекрывает кастомный цвет (для снятия при сбросе).
	private static readonly ACCENT_VARS = [
		"--accent",
		"--accent-light",
		"--accent-dark",
		"--accent-muted",
		"--fg",
		"--fg-muted",
		"--fg-subtle",
		"--fg-disabled",
		"--fg-heading",
		"--bg",
		"--bg-muted",
		"--bg-subtle",
		"--bg-overlay",
		"--bg-card",
		"--bg-hover",
		"--panel",
		"--input-bg",
		"--input-fg",
		"--input-border",
		"--input-placeholder",
		"--shadow",
	];

	// Целая палитра из одного цвета: инлайн-override на <html> бьёт переменные класса темы.
	// null/сброс — снимаем override, возвращается родная палитра пресета.
	setAccent(color: string | null): void {
		if (typeof document === "undefined") return;
		const root = document.documentElement.style;

		if (!color) {
			StyleHandler.ACCENT_VARS.forEach((v) => root.removeProperty(v));
			return;
		}

		const [h, s, l] = hexToHsl(color);
		const clamp = (n: number) => Math.max(0, Math.min(100, n));
		// hsl-строки: тон фиксируем, насыщенность/светлоту выводим из входного цвета.
		const set = (name: string, sat: number, light: number, alpha?: number) =>
			root.setProperty(
				name,
				alpha == null
					? `hsl(${h} ${clamp(sat)}% ${clamp(light)}%)`
					: `hsl(${h} ${clamp(sat)}% ${clamp(light)}% / ${alpha})`,
			);

		set("--accent", s, l);
		set("--accent-light", s * 0.7, l + 22);
		set("--accent-dark", s, l - 15);
		set("--accent-muted", s * 0.8, l + 8);

		set("--fg", s * 0.25, 92);
		set("--fg-muted", s * 0.2, 70);
		set("--fg-subtle", s * 0.18, 50);
		set("--fg-disabled", s * 0.15, 34);
		set("--fg-heading", s * 0.1, 100);

		set("--bg", s * 0.12, 12);
		set("--bg-muted", s * 0.12, 17);
		set("--bg-subtle", s * 0.12, 21);
		set("--bg-overlay", s * 0.12, 12, 0.8);
		set("--bg-card", s * 0.12, 14);
		set("--bg-hover", s * 0.14, 24);

		set("--panel", s * 0.12, 17);
		set("--input-bg", s * 0.12, 17);
		set("--input-fg", s * 0.25, 92);
		set("--input-border", s, l);
		set("--input-placeholder", s * 0.18, 50);

		root.setProperty("--shadow", `0 0 20px hsl(${h} ${s}% ${l}% / 0.4)`);
	}

	removeAllThemeClasses(): void {
		if (typeof document === "undefined") return;

		for (const className of this.themes.values()) {
			document.documentElement.classList.remove(className);
		}
	}

	getCurrentTheme(): string {
		return this.currentTheme;
	}

	getAvailableThemes(): string[] {
		return Array.from(this.themes.keys());
	}
}
