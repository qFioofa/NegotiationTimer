import { writable } from "svelte/store";

export const parameters = writable({
    isPaused: false
});
