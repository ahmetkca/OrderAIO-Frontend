<script>
    import {onMount} from 'svelte';
    import ReceiptResult from './components/ReceiptResult.svelte';
    import DisplayReceipt from './components/DisplayReceipt.svelte';
    import { etsyConnections, receiptsByShopNames} from "../../stores/etsyConnection.store";
    import { Circle } from 'svelte-loading-spinners'

    let searchQuery = '';
    let results = [];
    let selectedReceipt = 0
    let fetchingOrders = false;
    let isSearching = false;

    onMount(async () => {
        fetchingOrders = true
        if (Object.keys($receiptsByShopNames).length === 0) {
            await receiptsByShopNames.reload();
        }
        fetchingOrders = false;
    })

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
                    $receiptsByShopNames[shopName][receipt_id].name.toUpperCase() === searchQuery.toUpperCase() ||
                    $receiptsByShopNames[shopName][receipt_id].name.toUpperCase().includes(searchQuery.toUpperCase())
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
</script>

<div class="container mx-auto p-5 items-center ">
    {#if isSearching}
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Circle size="48" color="#808080" unit="px" duration="1s"/>
        </div>
    {/if}
    <div class="flex flex-col ">

        <div class=" p-2 w-full">
            <input bind:value={searchQuery} type=text placeholder="Search Order number or Buyer's name"
                   class="border rounded border-gray-400 p-2 w-1/2 focus:ring-2 ring-offset-1 ring-gray-200 outline-none
                        placeholder-opacity-80"/>
        </div>
        <div class="flex flex-row mt-1 ">
            <div class="p-2 overflow-y-auto w-1/4 ">
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
