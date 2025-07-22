export default class Config {
    constructor(defaultConfig = {}) {
        this._storageKey = 'appConfig';
        this._defaultSettings = { ...defaultConfig };
        this._settings = {};

        if (typeof window !== 'undefined') {
            this._loadFromStorage();
            this._attachAutoSave();
        } else {
            this._settings = { ...this._defaultSettings };
        }
    }

    _loadFromStorage() {
        try {
            const saved = localStorage.getItem(this._storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                this._settings = { ...this._defaultSettings, ...parsed };
            } else {
                this.default();
            }
        } catch (error) {
            console.error('Failed to load configuration:', error);
            this.default();
        }
    }

    _attachAutoSave() {
        window.addEventListener('beforeunload', () => {
            this.save();
        });
    }

    default() {
        this._settings = { ...this._defaultSettings };
        return this;
    }

    save() {
        if (typeof window === 'undefined') return false;

        try {
            localStorage.setItem(this._storageKey, JSON.stringify(this._settings));
            return true;
        } catch (error) {
            console.error('Failed to save configuration:', error);
            return false;
        }
    }

    get(key) {
        return this._settings[key];
    }

    set(key, value) {
        this._settings[key] = value;
        return this;
    }

    load() {
        if (typeof window !== 'undefined') {
            this._loadFromStorage();
        }
        return this;
    }
}
