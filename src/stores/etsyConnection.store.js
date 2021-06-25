import {get, writable} from 'svelte/store';

import etsyConnectionsService from '../services/etsyConnections.service';

// export const currentEtsyConnectionId = writable(null);

const reloadEtsyConnections = async () => {
    return await etsyConnectionsService.get_all_etsy_connections()
        .then(res => {
            let etsyConnectionsByShopNames = {}
            for (let i = 0; i < res.data.length; i++) {
                etsyConnectionsByShopNames[res.data[i].etsy_shop_name] = res.data[i];
            }
            return etsyConnectionsByShopNames;
        })
        .catch(err => {
            console.error(err);
            return {};
        });
}

const createEtsyConnectionsStore = () => {
    // const etsyConnections = await reloadEtsyConnections();
    const { subscribe, set, update } = writable({});

    return {
        subscribe,
        set,
        addConnection: (etsyConnectionId) => update(async etsyConnections => {
            const etsyConnection = await etsyConnectionsService.getEtsyConnection(etsyConnectionId)
                .then(res => {
                    return res.data;
                })
                .catch(err => {
                    console.error(err);
                    return {};
                });
            etsyConnections[etsyConnection.etsy_shop_name] = etsyConnection;
            return etsyConnections;
        }),
        deleteConnection: (etsyShopName) => update( etsyConnections => {
            delete etsyConnections[etsyShopName];
            return etsyConnections;
        }),
        reload: async () => set(await reloadEtsyConnections()),
        reset: () => set({})
    }
}
const etsyConnections = createEtsyConnectionsStore();
etsyConnections.set(await reloadEtsyConnections())


const reloadReceiptsStore = async () => {
    if (Object.keys(get(etsyConnections)).length === 0) {
        await etsyConnections.reload();
    }
    const receiptsByShopNames = {};
    for (const etsyConnection in get(etsyConnections)) {
        const etsy_shop_name = get(etsyConnections)[etsyConnection].etsy_shop_name;
        const _id = get(etsyConnections)[etsyConnection]._id;
        await etsyConnectionsService.getAllReceipts(_id)
            .then(res => {
                receiptsByShopNames[etsy_shop_name] = {};
                const receipts = res.data.results;
                for (let i = 0; i < receipts.length; i++) {
                    receiptsByShopNames[etsy_shop_name][receipts[i].receipt_id] = receipts[i];
                }
            })
    }
    return receiptsByShopNames;
}

const createReceiptsStore = () => {
    // console.trace(get(etsyConnections));
    // const receiptsByShopNames = await reloadReceiptsStore();
    const { subscribe, set, update } = writable({});

    return {
        subscribe,
        set,
        update,
        reload: async () => set(await reloadReceiptsStore()),
        reset: () => set({})
    }
}
const receiptsByShopNames = createReceiptsStore();
receiptsByShopNames.set(await reloadReceiptsStore());

export {etsyConnections, receiptsByShopNames}