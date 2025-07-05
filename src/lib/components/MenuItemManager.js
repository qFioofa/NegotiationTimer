export default class MenuItemManager {
    constructor() {
        this.items = [];
        this.handlers = new Map();
    }

    addItem(item) {
        if (!item.id) {
            throw new Error("MenuItem must have an id");
        }

        if (this.items.some(i => i.id === item.id)) {
            console.warn(`MenuItem with id "${item.id}" already exists`);
            return;
        }

        this.items.push({
            id: item.id,
            text: item.text || "",
            icon: item.icon || "",
            badge: item.badge || "",
            action: item.action || (() => { })
        });

        if (item.handler) {
            this.handlers.set(item.id, item.handler);
        }
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.handlers.delete(id);
    }

    getItems() {
        return [...this.items];
    }

    executeItem(id) {
        const item = this.items.find(i => i.id === id);
        if (item) {
            item.action();

            const handler = this.handlers.get(id);
            if (handler) {
                handler.execute();
            }
        }
    }

    highlightItem(id) {
        const handler = this.handlers.get(id);
        if (handler && handler.highlight) {
            handler.highlight();
        }
    }

    destroy() {
        this.items = [];
        this.handlers.clear();
    }
}