import { get, writable } from 'svelte/store';

type BindCallback = (event: KeyboardEvent) => void;

export const isListeningBind = writable(false);
const bindMap = new Map<string, BindCallback>();

function bindHandler(event: KeyboardEvent): void {
    const callback = bindMap.get(event.code);
    if (callback) {
        event.preventDefault();
        callback(event);
    }
}

export function setBindListener(code: string, callback: BindCallback): void {
    if (typeof window === "undefined" || typeof code !== "string" || typeof callback !== "function") return;

    if (bindMap.size === 0) {
        window.addEventListener("keydown", bindHandler);
    }
    bindMap.set(code, callback);
}

export function removeBindListener(code: string): void {
    if (typeof window === "undefined") return;

    bindMap.delete(code);
    if (bindMap.size === 0) {
        window.removeEventListener("keydown", bindHandler);
    }
}

export function clearAllBindListeners(): void {
    if (typeof window === "undefined") return;

    bindMap.clear();
    window.removeEventListener("keydown", bindHandler);
}

function handleSingleKey(event: KeyboardEvent, callback?: BindCallback): void {
    isListeningBind.set(false);
    callback?.(event);
}

export function startListeningForKey(callback?: BindCallback): void {
    if (typeof window === "undefined" || get(isListeningBind)) return;

    isListeningBind.set(true);
    window.addEventListener("keydown", (e) => handleSingleKey(e, callback), { once: true });
}

export function codeToLabel(code: string): string {
    const keyMap: Record<string, string> = {
        Space: 'Space',
        Enter: 'Enter',
        Escape: 'Esc',
        ArrowUp: '↑',
        ArrowDown: '↓',
        ArrowLeft: '←',
        ArrowRight: '→',
        ShiftLeft: 'Shift',
        ShiftRight: 'Shift',
        ControlLeft: 'Ctrl',
        ControlRight: 'Ctrl',
        AltLeft: 'Alt',
        AltRight: 'Alt',
        Backspace: 'Backspace',
        Delete: 'Del',
        Tab: 'Tab',
        CapsLock: 'CapsLock'
    };

    if (keyMap[code]) return keyMap[code];
    if (/^Key[A-Z]$/.test(code)) return code.slice(3);
    if (/^Digit[0-9]$/.test(code)) return code.slice(5);
    if (/^Numpad[0-9]$/.test(code)) return 'Num' + code.slice(6);

    return code;
}
