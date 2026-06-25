export default class Encoder {
	static encode(obj: unknown): string {
		if (obj === undefined || typeof obj === "function") {
			throw new Error("Cannot encode undefined or functions");
		}

		const data = {
			__class: (obj as object).constructor.name,
			__data: JSON.stringify(obj, (_key, value) => {
				if (typeof value === "bigint") {
					return { __bigint: value.toString() };
				}
				if (value instanceof Map) {
					return { __map: Array.from(value.entries()) };
				}
				if (value instanceof Set) {
					return { __set: Array.from(value) };
				}
				if (value instanceof Date) {
					return { __date: value.toISOString() };
				}
				if (value instanceof RegExp) {
					return { __regex: value.toString() };
				}
				return value;
			}),
		};

		const jsonString = JSON.stringify(data);
		return btoa(unescape(encodeURIComponent(jsonString)));
	}

	static decode(str: string): unknown {
		let decodedString: string;

		try {
			decodedString = decodeURIComponent(escape(atob(str)));
		} catch {
			decodedString = str;
		}

		const parsed = JSON.parse(decodedString);
		if (!parsed.__class || !parsed.__data) {
			return parsed;
		}

		const data = JSON.parse(parsed.__data, (_key, value) => {
			if (value && typeof value === "object") {
				if ("__bigint" in value) {
					return BigInt(value.__bigint);
				}
				if ("__map" in value) {
					return new Map(value.__map);
				}
				if ("__set" in value) {
					return new Set(value.__set);
				}
				if ("__date" in value) {
					return new Date(value.__date);
				}
				if ("__regex" in value) {
					const match = /^\/(.*)\/([dgimsuy]*)$/.exec(value.__regex);
					if (match) {
						return new RegExp(match[1], match[2]);
					}
				}
			}
			return value;
		});
		const registry = globalThis as unknown as Record<

			string,
			{ prototype: object }
		>;
		const ctor = registry[parsed.__class];
		if (ctor) {
			const instance = Object.create(ctor.prototype);
			return Object.assign(instance, data);
		}
		return data;
	}

	static generateRandomId(length = 6): string {
		const chars =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		let result = "";
		for (let i = 0; i < length; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return result;
	}
}
