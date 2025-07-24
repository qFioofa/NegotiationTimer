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

    set(key, value) {
        this._settings[key] = value;
        return this;
    }

    async setConfig(cfg, mediaCfg) {
        if (cfg) this._settings = cfg;

        if (mediaCfg && typeof mediaCfg === 'object') {
            try {
                await this.setAllMedia(mediaCfg);
            } catch (error) {
                console.error('Ошибка при загрузке медиа-файлов в setConfig:', error);
            }
        }
    }

    load() {
        if (typeof window !== 'undefined') {
            this._loadFromStorage();
        }
        return this;
    }

    getConfig() {
        return this._settings;
    }

    get(key) {
        return this._settings[key];
    }

    async getMedia(key) {
        try {
            const media = await this._loadMedia(key);
            if (media) return media;
        } catch (error) {
            console.error(` "${key}":`, error);
        }
    }

    async setMedia(key, fileBlob) {
        try {
            await this._saveMedia(key, fileBlob);
            return true;
        } catch (error) {
            console.error(`Ошибка в загрузке медиа "${key}":`, error);
            return false;
        }
    }

    async deleteMedia(key) {
        try {
            await this._deleteMedia(key);
            return true;
        } catch (error) {
            console.error(`Ошибка в удалении медиа "${key}":`, error);
            return false;
        }
    }

    async hasMedia(key) {
        const media = await this._loadMedia(key);
        return !!media;
    }

    _openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('AppMediaStore', 1);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('media')) {
                    db.createObjectStore('media');
                }
            };

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async _saveMedia(key, blob) {
        const db = await this._openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('media', 'readwrite');
            const store = tx.objectStore('media');
            const request = store.put(blob, key);

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }

    async _loadMedia(key) {
        const db = await this._openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('media', 'readonly');
            const store = tx.objectStore('media');
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async _deleteMedia(key) {
        const db = await this._openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('media', 'readwrite');
            const store = tx.objectStore('media');
            const request = store.delete(key);

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllMedia() {
        const db = await this._openDB();

        return new Promise((resolve, reject) => {
            const tx = db.transaction('media', 'readonly');
            const store = tx.objectStore('media');
            const request = store.getAllKeys();

            request.onsuccess = async () => {
                const keys = request.result;
                const result = {};

                const valueTx = db.transaction('media', 'readonly');
                const valueStore = valueTx.objectStore('media');

                let pending = keys.length;
                if (pending === 0) return resolve(result);

                for (const key of keys) {
                    const getReq = valueStore.get(key);
                    getReq.onsuccess = () => {
                        result[key] = getReq.result;
                        if (--pending === 0) resolve(result);
                    };
                    getReq.onerror = () => {
                        reject(getReq.error);
                    };
                }
            };

            request.onerror = () => reject(request.error);
        });
    }

    async setAllMedia(mediaMap) {
        const db = await this._openDB();

        return new Promise((resolve, reject) => {
            const tx = db.transaction('media', 'readwrite');
            const store = tx.objectStore('media');

            try {
                for (const [key, blob] of Object.entries(mediaMap)) {
                    store.put(blob, key);
                }

                tx.oncomplete = () => resolve(true);
                tx.onerror = () => reject(tx.error);
            } catch (err) {
                reject(err);
            }
        });
    }

    async deleteAllMedia() {
        const db = await this._openDB();

        return new Promise((resolve, reject) => {
            const tx = db.transaction('media', 'readwrite');
            const store = tx.objectStore('media');
            const clearRequest = store.clear();

            clearRequest.onsuccess = () => resolve(true);
            clearRequest.onerror = () => reject(clearRequest.error);
        });
    }

}
