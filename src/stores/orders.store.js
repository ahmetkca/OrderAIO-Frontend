import {writable} from 'svelte/store';

const createOrdersStore = (initialValue = []) => {
    const { set, update, subscribe } = writable(initialValue);

    return {
        subscribe,
        update,
        set,
    }
}

export const orders = createOrdersStore();
