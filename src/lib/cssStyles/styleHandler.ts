export default class StyleHandler {
    private themes: Map<string, string>;
    private currentTheme: string;

    constructor(defaultTheme = 'green') {
        this.themes = new Map();
        this.currentTheme = defaultTheme;
    }

    registerTheme(name: string, className?: string): void {
        this.themes.set(name, className || `theme-${name}`);
    }

    setTheme(name: string): void {
        const className = this.themes.get(name);
        if (className === undefined) return;
        if (typeof document === 'undefined') return;

        this.removeAllThemeClasses();
        document.documentElement.classList.add(className);
        this.currentTheme = name;
    }

    removeAllThemeClasses(): void {
        if (typeof document === 'undefined') return;

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
