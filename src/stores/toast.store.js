import {writable} from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';


const createToasts = (initialValue = []) => {
    const { subscribe, set, update } = writable(initialValue);

    const push = (comp, duration = 3500, props = {}) => {
        update(toasts => [ ...toasts, {id: uuidv4(), comp, duration, props}])
    }
    const pop = (id) => {
        update(toasts => toasts.filter(toast => toast.id !== id))
    }
    const clear = () => {
        set([])
    }

    return {
        subscribe,
        push,
        pop,
        clear,
    }
}

export const toasts = createToasts();