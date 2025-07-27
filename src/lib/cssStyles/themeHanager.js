import configStyleHandler from './configStyleHandler';
import StyleHandler from './styleHandler';

const themeManager = new StyleHandler();
const csHandler = new configStyleHandler();

const themeArray = [
    "green",
    "brown",
    "red",
    "blue",
    "cyan",
    "pink",
    "grey"
]

const configFileNameArray = [
    {
        name: "SSL",
        fileName: "ssl.cfg"
    },
    {
        name: "SSL Online",
        fileName: "sslOnline.cfg"
    }
]

themeArray.forEach(
    item => themeManager.registerTheme(item)
);

configFileNameArray.forEach(
    item => csHandler.registerConfigStyle(item.name, item.fileName)
);

export { themeManager, csHandler }