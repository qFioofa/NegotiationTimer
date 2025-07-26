export function mmssToMs(timerStr) {
    if (!timerStr || typeof timerStr !== "string") return 0;

    const parts = timerStr.split(":");
    if (parts.length !== 2) return 0;

    const mm = parseInt(parts[0], 10);
    const ss = parseInt(parts[1], 10);

    if (isNaN(mm) || isNaN(ss)) return 0;

    return mm * 60 + ss;
}

export function validateTimeFormat(timerStr) {
    return typeof timerStr === "string" &&
        /^([0-5][0-9]):([0-5][0-9])$/.test(timerStr);
}

export function onTimerInputChange(timerStr) {
    let _value = timerStr.replace(/[^0-9]/g, "").slice(0, 4);
    if (_value.length > 2) {
        _value = _value.slice(0, 2) + ":" + _value.slice(2)
    };

    if (!validateTimeFormat(_value)) {
        return {
            value: _value,
            error: "Введите время в формате MM:SS"
        }
    }

    return _value
}

export function timerDisplay(timeMs) {
    const totalSec = Math.floor(timeMs / 1000);
    const min = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const sec = (totalSec % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
}