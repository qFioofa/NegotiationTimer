class Bind {
    constructor(key, func) {
        this.key = key;
        this.func = func;
    }
}

export default class BindManager {
    constructor() {
        this.binds = new Map();
        this.enabled = true;
        this.activeKeys = new Set();
    }

    addBind(key, func) {
        const bind = new Bind(key, func);
        if (!this.binds.has(key)) {
            this.binds.set(key, []);
        }
        this.binds.get(key).push(bind);
        return bind;
    }

    removeBind(bind) {
        const bindArray = this.binds.get(bind.key);
        if (!bindArray) return false;
        const index = bindArray.indexOf(bind);
        if (index !== -1) {
            bindArray.splice(index, 1);
            if (bindArray.length === 0) {
                this.binds.delete(bind.key);
            }
            return true;
        }
        return false;
    }

    apply() {
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    handleKeyDown(event) {
        if (!this.enabled) return;
        this.activeKeys.add(event.key);
        if (this.binds.has(event.key)) {
            this.binds.get(event.key).forEach(bind => bind.func(event));
        }
    }

    handleKeyUp(event) {
        this.activeKeys.delete(event.key);
    }

    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
    }

    isKeyActive(key) {
        return this.activeKeys.has(key);
    }

    destroy() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        this.binds.clear();
        this.activeKeys.clear();
    }
}