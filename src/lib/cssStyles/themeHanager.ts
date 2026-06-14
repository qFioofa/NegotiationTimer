import ConfigStyleHandler from "./configStyleHandler";
import StyleHandler from "./styleHandler";

const themeManager = new StyleHandler();
const csHandler = new ConfigStyleHandler();

const themeArray: string[] = [
	"green",
	"brown",
	"red",
	"blue",
	"cyan",
	"pink",
	"grey",
	"yellow",
	"yugen",
];

interface ConfigFileEntry {
	name: string;
	fileName: string;
}

const configFileNameArray: ConfigFileEntry[] = [
	{
		name: "SSL",
		fileName: "ssl.cfg",
	},
	{
		name: "Minecraft Parkour",
		fileName: "minecraftParkour.cfg",
	},
];

themeArray.forEach((item) => themeManager.registerTheme(item));

configFileNameArray.forEach((item) =>
	csHandler.registerConfigStyle(item.name, item.fileName),
);

export { themeManager, csHandler };
