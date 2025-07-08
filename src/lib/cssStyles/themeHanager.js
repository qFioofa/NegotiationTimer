import StyleHandler from './StyleHandler';

const themeManager = new StyleHandler();

themeManager.registerTheme('green');
themeManager.registerTheme('brown');
themeManager.registerTheme('red');
themeManager.registerTheme('blue');
themeManager.registerTheme('cyan');
themeManager.registerTheme('pink');
themeManager.registerTheme('grey');

export default themeManager;
