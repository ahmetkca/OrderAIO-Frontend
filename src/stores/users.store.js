import { writable } from 'svelte/store';
import usersService from "../services/users.service";

const reloadUsers = async () => {
    await usersService.getAllUsers()
        .then(res => {
            console.trace(res.data)
            return res.data
        })
}

const createUsersStore = () => {
    // console.trace(get(etsyConnections));
    // const receiptsByShopNames = await reloadReceiptsStore();
    const { subscribe, set, update } = writable([]);

    return {
        subscribe,
        set,
        update,
        reload: async () => set(await reloadUsers()),
        reset: () => set({})
    }
}
export const users = createUsersStore();