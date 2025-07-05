class ConfigFields {
    constructor() {
    }

    default() {
    }
}

export class Config extends ConfigFields {
    constructor() {
        super();
        this._settings = {};
        this._defaultSettings = {};
    }

    default() {
        this._settings = {...this._defaultSettings};
        return this;
    }

    save() {
        try {
            localStorage.setItem('appConfig', JSON.stringify(this._settings));
            return true;
        } catch (error) {
            console.error('Failed to save configuration:', error);
            return false;
        }
    }

    apply() {
        return this;
    }

    get(key) {
        return this._settings[key];
    }

    set(key, value) {
        this._settings[key] = value;
        return this;
    }

    setDefaults(defaults) {
        this._defaultSettings = {...defaults};
        return this;
    }

    load() {
        try {
            const saved = localStorage.getItem('appConfig');
            if (saved) this._settings = JSON.parse(saved);
            return this;
        } catch (error) {
            console.error('Failed to load configuration:', error);
            return this.default();
        }
    }
}