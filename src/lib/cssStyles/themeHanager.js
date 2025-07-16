import StyleHandler from './StyleHandler';

const themeManager = new StyleHandler();
const themeArray = [
    "green",
    "brown",
    "red",
    "blue",
    "cyan",
    "pink",
    "grey"
]

themeArray.forEach(
    item => themeManager.registerTheme(item)
);

export default themeManager;
