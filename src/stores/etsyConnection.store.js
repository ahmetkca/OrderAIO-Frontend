import {get, writable, derived} from 'svelte/store';

import etsyConnectionsService from '../services/etsyConnections.service';
import * as dayjs from "dayjs";

// export const currentEtsyConnectionId = writable(null);
const isFetchingReceipts = writable(false);
const isFetchingEtsyConnections = writable(false);

const minCreated = writable(dayjs().subtract(1, "week"));
const maxCreated = writable(dayjs().add(1, "days"));
const receiptDateRange = derived( [minCreated, maxCreated], ([$minCreated, $maxCreated], set) => {
    console.log($minCreated);
    console.log($maxCreated);
    console.log(typeof $minCreated);
    set({"from": $minCreated.unix(), "to": $maxCreated.unix()})
})

const reloadEtsyConnections = async () => {

    isFetchingEtsyConnections.set(true);
    return await etsyConnectionsService.get_all_etsy_connections()
        .then(res => {
            let etsyConnectionsByShopNames = {}
            for (let i = 0; i < res.data.length; i++) {
                etsyConnectionsByShopNames[res.data[i].etsy_shop_name] = res.data[i];
            }
            isFetchingEtsyConnections.set(false);
            return etsyConnectionsByShopNames;
        })
        .catch(err => {
            console.error(err);
            isFetchingEtsyConnections.set(false);
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
// etsyConnections.set(await reloadEtsyConnections())


const reloadReceiptsStore = async () => {
    if (Object.keys(get(etsyConnections)).length === 0) {
        if (!get(isFetchingEtsyConnections)) {
            await etsyConnections.reload();
        }
    }
    isFetchingReceipts.set(true);
    const receiptsByShopNames = {};
    for (const etsyConnection in get(etsyConnections)) {
        const etsy_shop_name = get(etsyConnections)[etsyConnection].etsy_shop_name;
        const _id = get(etsyConnections)[etsyConnection]._id;
        console.log(get(receiptDateRange));
        await etsyConnectionsService.getAllReceipts(_id, get(receiptDateRange).from, get(receiptDateRange).to)
            .then(res => {
                receiptsByShopNames[etsy_shop_name] = {};
                const receipts = res.data.results;
                for (let i = 0; i < receipts.length; i++) {
                    receiptsByShopNames[etsy_shop_name][receipts[i].receipt_id] = receipts[i];
                }
            })
    }
    isFetchingReceipts.set(false);
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
// receiptsByShopNames.set(await reloadReceiptsStore());


export {
    etsyConnections,
    receiptsByShopNames,
    isFetchingReceipts,
    isFetchingEtsyConnections,
    minCreated,
    maxCreated,
    receiptDateRange
}