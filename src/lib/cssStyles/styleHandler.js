export default class StyleHandler {
    constructor(defaultTheme = 'green') {
        this.themes = new Map();
        this.currentTheme = defaultTheme;
    }

    registerTheme(name, className) {
        this.themes.set(name, className || `theme-${name}`);
    }

    setTheme(name) {
        if (!this.themes.has(name)) return;

        const className = this.themes.get(name);
        this.removeAllThemeClasses();
        document.documentElement.classList.add(className);
        this.currentTheme = name;
    }

    removeAllThemeClasses() {
        for (const className of this.themes.values()) {
            document.documentElement.classList.remove(className);
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getAvailableThemes() {
        return Array.from(this.themes.keys());
    }
}
