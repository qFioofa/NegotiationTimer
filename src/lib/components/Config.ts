type ConfigSettings = Record<string, unknown>;
type ConfigSubscriber = (value: unknown) => void;
type MediaMap = Record<string, Blob>;

export default class Config {
	private _storageKey: string;
	private _defaultSettings: ConfigSettings;
	private _settings: ConfigSettings;
	private _subscribers: Record<string, ConfigSubscriber[]>;

	constructor(defaultConfig: ConfigSettings = {}) {
		this._storageKey = "appConfig";
		this._defaultSettings = { ...defaultConfig };
		this._settings = {};
		this._subscribers = {};

		if (typeof window !== "undefined") {
			this._loadFromStorage();
			this._attachAutoSave();
		} else {
			this._settings = { ...this._defaultSettings };
		}
	}

	private _loadFromStorage(): void {
		try {
			const saved = localStorage.getItem(this._storageKey);
			if (saved) {
				const parsed = JSON.parse(saved);
				this._settings = { ...this._defaultSettings, ...parsed };
			} else {
				this.default();
			}
		} catch (error) {
			console.error("Failed to load configuration:", error);
			this.default();
		}
	}

	private _attachAutoSave(): void {
		window.addEventListener("beforeunload", () => {
			this.save();
		});
	}

	subscribe(key: string, callback: ConfigSubscriber): () => void {
		if (!this._subscribers[key]) {
			this._subscribers[key] = [];
		}
		this._subscribers[key].push(callback);
		return () => this.unsubscribe(key, callback);
	}

	unsubscribe(key: string, callback: ConfigSubscriber): void {
		if (this._subscribers[key]) {
			this._subscribers[key] = this._subscribers[key].filter(
				(cb) => cb !== callback,
			);
		}
	}

	private _notify(key: string, value: unknown): void {
		if (this._subscribers[key]) {
			this._subscribers[key].forEach((cb) => cb(value));
		}
	}

	default(): this {
		this._settings = { ...this._defaultSettings };
		return this;
	}

	save(): boolean {
		if (typeof window === "undefined") return false;

		try {
			localStorage.setItem(
				this._storageKey,
				JSON.stringify(this._settings),
			);
			return true;
		} catch (error) {
			console.error("Failed to save configuration:", error);
			return false;
		}
	}

	set(key: string, value: unknown): this {
		this._settings[key] = value;
		this._notify(key, value);
		// ponytail: write-through persist; add debounce if set() ever goes per-keystroke
		this.save();
		return this;
	}

	async setConfig(cfg?: ConfigSettings, mediaCfg?: MediaMap): Promise<void> {
		if (cfg) {
			this._settings = { ...this._defaultSettings, ...cfg };
			for (const [key, value] of Object.entries(this._settings)) {
				this._notify(key, value);
			}
			this.save();
		}

		if (mediaCfg && typeof mediaCfg === "object") {
			try {
				await this.setAllMedia(mediaCfg);
				for (const [key, blob] of Object.entries(mediaCfg)) {
					this._notify(key, blob);
				}
			} catch (error) {
				console.error(
					"Failed to load media files in setConfig:",
					error,
				);
			}
		}
	}

	load(): this {
		if (typeof window !== "undefined") {
			this._loadFromStorage();
		}
		return this;
	}

	getConfig(): ConfigSettings {
		return this._settings;
	}

	get<T = unknown>(key: string): T {
		return this._settings[key] as T;
	}

	async getMedia(key: string): Promise<Blob | undefined> {
		try {
			const media = await this._loadMedia(key);
			if (media) return media;
		} catch (error) {
			console.error(`Failed to load media "${key}":`, error);
		}
		return undefined;
	}

	async setMedia(key: string, fileBlob: Blob): Promise<boolean> {
		try {
			await this._saveMedia(key, fileBlob);
			this._notify(key, fileBlob);
			return true;
		} catch (error) {
			console.error(`Failed to save media "${key}":`, error);
			return false;
		}
	}

	async deleteMedia(key: string): Promise<boolean> {
		try {
			await this._deleteMedia(key);
			return true;
		} catch (error) {
			console.error(`Failed to delete media "${key}":`, error);
			return false;
		}
	}

	async hasMedia(key: string): Promise<boolean> {
		const media = await this._loadMedia(key);
		return !!media;
	}

	private _openDB(): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open("AppMediaStore", 1);

			request.onupgradeneeded = (event) => {
				const db = (event.target as IDBOpenDBRequest).result;
				if (!db.objectStoreNames.contains("media")) {
					db.createObjectStore("media");
				}
			};

			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}

	private async _saveMedia(key: string, blob: Blob): Promise<boolean> {
		const db = await this._openDB();
		return new Promise((resolve, reject) => {
			const tx = db.transaction("media", "readwrite");
			const store = tx.objectStore("media");
			const request = store.put(blob, key);

			request.onsuccess = () => resolve(true);
			request.onerror = () => reject(request.error);
		});
	}

	private async _loadMedia(key: string): Promise<Blob | undefined> {
		const db = await this._openDB();
		return new Promise((resolve, reject) => {
			const tx = db.transaction("media", "readonly");
			const store = tx.objectStore("media");
			const request = store.get(key);

			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}

	private async _deleteMedia(key: string): Promise<boolean> {
		const db = await this._openDB();
		return new Promise((resolve, reject) => {
			const tx = db.transaction("media", "readwrite");
			const store = tx.objectStore("media");
			const request = store.delete(key);

			request.onsuccess = () => resolve(true);
			request.onerror = () => reject(request.error);
		});
	}

	async getAllMedia(): Promise<MediaMap> {
		const db = await this._openDB();

		return new Promise((resolve, reject) => {
			const tx = db.transaction("media", "readonly");
			const store = tx.objectStore("media");
			// getAllKeys() and getAll() iterate in the same key order, so pair by index
			const keysReq = store.getAllKeys();
			const valsReq = store.getAll();

			tx.oncomplete = () => {
				const result: MediaMap = {};
				keysReq.result.forEach((key, i) => {
					result[key as string] = valsReq.result[i] as Blob;
				});
				resolve(result);
			};

			tx.onerror = () => reject(tx.error);
		});
	}

	async setAllMedia(mediaMap: MediaMap): Promise<boolean> {
		const db = await this._openDB();

		return new Promise((resolve, reject) => {
			const tx = db.transaction("media", "readwrite");
			const store = tx.objectStore("media");

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

	async deleteAllMedia(): Promise<boolean> {
		const db = await this._openDB();

		return new Promise((resolve, reject) => {
			const tx = db.transaction("media", "readwrite");
			const store = tx.objectStore("media");
			const clearRequest = store.clear();

			clearRequest.onsuccess = () => resolve(true);
			clearRequest.onerror = () => reject(clearRequest.error);
		});
	}
}
