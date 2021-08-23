import { writable } from 'svelte/store';
import usersService from "../services/users.service";

const reloadUsers = async () => {
    let myUsers = [];
    await usersService.getAllUsers()
        .then(res => {
            myUsers = res.data

            // return res.data
        })
    console.trace(myUsers);
    return myUsers;
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
        reset: () => set([])
    }
}
export const users = createUsersStore();