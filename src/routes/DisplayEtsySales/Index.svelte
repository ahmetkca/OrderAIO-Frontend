<script>
    import {onMount} from 'svelte';
    import ReceiptResult from './components/ReceiptResult.svelte';
    import DisplayReceipt from './components/DisplayReceipt.svelte';
    import {
        etsyConnections,
        receiptsByShopNames,
        isFetchingReceipts,
        minCreated,
        maxCreated,
        receiptDateRange
    } from "../../stores/etsyConnection.store";
    import DatePicker from "@beyonk/svelte-datepicker/src/components/DatePicker.svelte";
    import { Circle } from 'svelte-loading-spinners';
    import * as dayjs from 'dayjs';
    import { CalendarStyle } from '../../lib/calendar-style.js';

    let searchQuery = '';
    let results = [];
    let selectedReceipt = 0
    // let fetchingOrders = false;
    let isSearching = false;
    let selectedDate = {
        from: '',
        to: ''
    };
    // let startDate = dayjs().subtract(1, "week");
    // let endDate = dayjs().add(1, "days");
    let minStartDate = dayjs().subtract(2, "year");
    let maxEndDate = dayjs().add(6, "days");

    onMount(async () => {
        // fetchingOrders = true
        if (!$isFetchingReceipts) {
            if (Object.keys($receiptsByShopNames).length === 0) {
                console.log("Fetching orders...")
                await receiptsByShopNames.reload();
            }
        }
        // fetchingOrders = false;
    })

    const handleDateRange = async () => {
        if (!$isFetchingReceipts) {
            await receiptsByShopNames.reload();
        }
    }

    const search = (searchQuery) => {
        isSearching = true;
        Object.keys($receiptsByShopNames).forEach(shopName => {
            console.trace($receiptsByShopNames[shopName][searchQuery]);
            if ($receiptsByShopNames[shopName][searchQuery] !== undefined) {
                results = [...results, {
                    ...$receiptsByShopNames[shopName][searchQuery],
                    shop_icon_url: $etsyConnections[shopName].shop_icon_url,
                    seller_shop_name: shopName,
                    etsy_connection_id: $etsyConnections[shopName]._id
                }];
            }
            Object.keys($receiptsByShopNames[shopName]).forEach(receipt_id => {
                if (
                    $receiptsByShopNames[shopName][receipt_id].name.toUpperCase() === searchQuery.toUpperCase()
                    || $receiptsByShopNames[shopName][receipt_id].name.toUpperCase().includes(searchQuery.toUpperCase())
                ) {
                    results = [...results, {
                        ...$receiptsByShopNames[shopName][receipt_id],
                        shop_icon_url: $etsyConnections[shopName].shop_icon_url,
                        seller_shop_name: shopName,
                        etsy_connection_id: $etsyConnections[shopName]._id
                    }]
                }
            })
        })
        if (results.length === 0) {
            // could not find receipt by order id or name
            // go through every shopname and try to fetch by orderid or name
            // and return the result
        }
        isSearching = false;
    }

    $: if (searchQuery.length > 0) {
        results = []
        selectedReceipt = 0
        console.log(searchQuery)
        // search for receipts
        search(searchQuery);
    } else {
        selectedReceipt = 0
        results = []
    }
    // console.log(startDate);
    // console.log(endDate);
    $: console.log(selectedDate);
</script>

<div class="container mx-auto p-5 items-center ">
    {#if $isFetchingReceipts}
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Circle size="48" color="#7DF9FF" unit="px" duration="1s"/>
        </div>
    {/if}
    <div class="flex flex-col ">

        <div class=" p-2 w-full">

            <input disabled={$isFetchingReceipts} bind:value={searchQuery} type=text placeholder="Search Order number or Buyer's name"
                   class=" border rounded border-gray-400 p-2 w-1/2 focus:ring-2 ring-offset-1 ring-gray-200 outline-none
                        placeholder-opacity-80"/>
            <DatePicker
                    selected={[$minCreated, $maxCreated]}
                    start={minStartDate}
                    end={maxEndDate}
                    range={true}
                    on:range-selected={(e) => {
                        console.trace(e.detail);
                        minCreated.set(dayjs(e.detail.from));
                        maxCreated.set(dayjs(e.detail.to));
                    }}
                    styling={new CalendarStyle()}>
            </DatePicker>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={handleDateRange}>
                apply
            </button>
        </div>
        <div class="flex flex-row mt-1 ">
            <div class="p-2 overflow-y-auto w-1/4 result-container">
                {#each results as result, i (result.receipt_id)}
                    <ReceiptResult
                            bind:group={selectedReceipt}
                            value={i}
                            receiptId={result.receipt_id}
                            buyerName={result.name}
                            sellerShopIcon={result.shop_icon_url}
                            sellerShopName={result.seller_shop_name}
                    />
                {/each}
            </div>
            <div class="p-2 w-3/4 ml-1">
                {#if results.length > 0}
                    {#key results[selectedReceipt].receipt_id}
                        <DisplayReceipt
                            isGift={results[selectedReceipt].is_gift}
                            giftMessage={results[selectedReceipt].gift_message}
                            address={results[selectedReceipt].formatted_address}
                            email={results[selectedReceipt].buyer_email}
                            buyerName={results[selectedReceipt].name}
                            grandTotal={results[selectedReceipt].grandtotal}
                            currencyCode={results[selectedReceipt].currency_code}
                            receiptId={results[selectedReceipt].receipt_id}
                            sellerShopName={results[selectedReceipt].seller_shop_name}
                            etsyConnectionId={results[selectedReceipt].etsy_connection_id}
                        />
                    {/key}
                {/if}
            </div>
        </div>

    </div>
</div>

<style>
    .result-container {
        max-height: 780px;
    }
</style>