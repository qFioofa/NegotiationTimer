import { GlobalConfig } from "$lib/stores/parameters";
import Encoder from "$lib/components/Encoder";

interface DecodedConfigStyle {
	static: Record<string, unknown>;
	media: Record<string, Blob>;
}

export default class ConfigStyleHandler {
	private themes: Map<string, string>;

	constructor() {
		this.themes = new Map();
	}

	registerConfigStyle(name: string, configFileName: string): void {
		if (typeof name !== "string" || !name.trim()) return;
		if (typeof configFileName !== "string" || !configFileName.trim())
			return;

		this.themes.set(name, configFileName);
	}

	async setConfigStyle(name: string): Promise<boolean | undefined> {
		const configFilePath = this.themes.get(name);
		if (configFilePath === undefined) return;

		try {
			const staticUrl = configFilePath.startsWith("/configs/")
				? configFilePath
				: `/configs/${configFilePath}`;

			const response = await fetch(staticUrl);

			if (!response.ok) return;

			const fileText = await response.text();
			if (!fileText.trim()) return;

			const decoded = Encoder.decode(
				fileText.trim(),
			) as DecodedConfigStyle | null;

			if (!decoded || typeof decoded !== "object") return;
			if (!decoded.static || !decoded.media) return;

			await GlobalConfig.setConfig(decoded.static, decoded.media);
			return true;
		} catch (error) {
			console.error(`Error loading theme "${name}":`, error);
			return false;
		}
	}

	getAvailableThemes(): string[] {
		return Array.from(this.themes.keys());
	}
}
