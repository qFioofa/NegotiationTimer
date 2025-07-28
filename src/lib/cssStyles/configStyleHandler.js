import { GlobalConfig } from "$lib/stores/parameters";
import Encoder from "$lib/components/Encoder";

export default class ConfigStyleHandler {
    constructor() {
        this.themes = new Map();
    }

    registerConfigStyle(name, configFileName) {
        if (typeof name !== 'string' || !name.trim()) return;
        if (typeof configFileName !== 'string' || !configFileName.trim()) return;

        this.themes.set(name, configFileName);
    }

    async setConfigStyle(name) {
        if (!this.themes.has(name)) return;

        const configFilePath = this.themes.get(name);
        let response;

        try {
            const staticUrl = configFilePath.startsWith('/configs/')
                ? configFilePath
                : `/configs/${configFilePath}`;

            response = await fetch(staticUrl);

            if (!response.ok) return;

            const fileText = await response.text();
            if (!fileText.trim()) return;

            const decoded = await Encoder.decode(fileText.trim());

            if (!decoded || typeof decoded !== 'object') return;
            if (!decoded.static || !decoded.media) return;

            await GlobalConfig.setConfig(decoded.static, decoded.media);
            return true;
        } catch (error) {
            console.error(`Error loading theme "${name}":`, error);
            return false;
        }
    }

    getAvailableThemes() {
        return Array.from(this.themes.keys());
    }
}