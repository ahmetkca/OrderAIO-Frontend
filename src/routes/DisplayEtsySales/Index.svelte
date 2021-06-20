<script>
    import {onMount} from 'svelte';
    import etsyConnectionsService from '../../services/etsyConnections.service';
    import ReceiptResult from './components/ReceiptResult.svelte';
    import DisplayReceipt from './components/DisplayReceipt.svelte';

    let etsyConnections = {};
    let allReceiptsByConnections = {};
    let searchQuery = '';
    let results = [];
    let selectedReceipt = 0

    onMount(async () => {
        await etsyConnectionsService.get_all_etsy_connections()
            .then(res => {
                res.data.forEach(connection => {
                    if (connection.etsy_shop_name === null) return;
                    etsyConnections[connection.etsy_shop_name] = {
                        connectionId: connection._id,
                        shopIconUrl: connection.shop_icon_url
                    }
                })
            })
        console.log(etsyConnections)
        Object.keys(etsyConnections).forEach(async (shopName) => {
            await etsyConnectionsService.getAllReceipts(etsyConnections[shopName].connectionId)
                .then(res => {
                    allReceiptsByConnections[`${shopName}`] = res.data.results
                    console.log(allReceiptsByConnections)
                })
        })
        
    })

    const search = (searchQuery) => {
        Object.keys(allReceiptsByConnections).forEach(shopName => {
            const receipts = allReceiptsByConnections[shopName]
            receipts.forEach(receipt => {
                console.log(receipt.name)
                if (searchQuery === receipt.name || searchQuery === receipt.receipt_id.toString()) {
                    results = [...results, {
                        receiptId: receipt.receipt_id,
                        buyerName: receipt.name,
                        connectionId: etsyConnections[shopName].connectionId,
                        shopIconUrl: etsyConnections[shopName].shopIconUrl,
                        sellerShopName: shopName,
                        isGift: receipt.is_gift,
                        giftMessage: receipt.gift_message,
                        grandTotal: receipt.grandtotal,
                        buyerEmail: receipt.buyer_email,
                        address: receipt.formatted_address,
                        currencyCode: receipt.currency_code
                    }]
                }
            })
        })
    }

    $: if (searchQuery.length > 0) {
        
        results = []
        console.log(searchQuery)
        // search for receipts
        search(searchQuery);
        console.log(results);
    } else {
        results = []
    }
</script>

<div class="container mx-auto p-5 items-center ">
    <div class="flex flex-col ">

        <div class=" p-2 w-full">
            <input bind:value={searchQuery} type=text placeholder="Search Order number or Buyer's name"
                   class="border rounded border-gray-500 p-2 w-full focus:ring-2 ring-gray-200 outline-none
                        placeholder-opacity-80"/>
        </div>
        <div class="flex flex-row mt-1 ">
            <div class="p-2 overflow-y-auto w-1/4 ">
                {#each results as result, i (result.receiptId)}
                    <ReceiptResult
                            bind:group={selectedReceipt}
                            value={i}
                            receiptId={result.receiptId}
                            buyerName={result.buyerName}
                            sellerShopIcon={result.shopIconUrl}
                            sellerShopName={result.sellerShopName}
                    />
                {/each}
            </div>
            <div class="p-2 w-3/4 ml-1">
                {#if results.length > 0}
                    {#key selectedReceipt}
                        <DisplayReceipt 
                            isGift={results[selectedReceipt].isGift}
                            giftMessage={results[selectedReceipt].giftMessage}
                            address={results[selectedReceipt].address}
                            email={results[selectedReceipt].buyerEmail}
                            buyerName={results[selectedReceipt].buyerName}
                            grandTotal={results[selectedReceipt].grandTotal}
                            currencyCode={results[selectedReceipt].currencyCode}
                            receiptId={results[selectedReceipt].receiptId}
                            sellerShopName={results[selectedReceipt].sellerShopName}
                            etsyConnectionId={results[selectedReceipt].connectionId}
                        />
                    {/key}
                {/if}
            </div>
        </div>

    </div>
</div>

<!--<div class=" mx-auto p-5 items-center ">-->
<!--    <div class="grid grid-rows-2 gap-2 w-full ">-->
<!--        -->
<!--        <div class="col-span-5 border p-2 w-full">-->
<!--            <input bind:value={searchQuery} type=text placeholder="Search Order number or Buyer's name"-->
<!--                class="border rounded border-gray-500 p-2 w-full focus:ring-2 ring-gray-200 outline-none-->
<!--                        placeholder-opacity-80"/>-->
<!--        </div>-->
<!--        <div class="row-span-2 col-span-1 border p-2 overflow-y-auto ">-->
<!--            {#each results as result (result.receiptId)}-->
<!--                <ReceiptResult -->
<!--                    receiptId={result.receiptId}-->
<!--                    buyerName={result.buyerName}-->
<!--                    sellerShopIcon={result.shopIconUrl}-->
<!--                    sellerShopName={result.sellerShopName}-->
<!--                />-->
<!--            {/each}-->
<!--        </div>-->
<!--        <div class="row-span-2 col-span-4 border p-2 border-black ">1</div>-->
<!--      </div>-->
<!--</div>-->
