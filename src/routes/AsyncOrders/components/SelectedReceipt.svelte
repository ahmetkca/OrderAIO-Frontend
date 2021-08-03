<script>
    export let receipt = {};
    import {toasts} from "../../../stores/toast.store";
    import Success from "../../../components/Success.svelte";
    import Danger from '../../../components/Danger.svelte';
    import Warning from '../../../components/Warning.svelte';
    import TransactionList from './TransactionList.svelte';
    import ReceiptNote from './ReceiptNote.svelte'
    import receiptLabelPrintService from '../../../services/receiptLabelPrint.service';
    import print from 'print-js';



    const getLabelPdf = async () => {
        if (receipt?.receipt_id) {
            await receiptLabelPrintService.getLabelPdfByReceiptId(receipt?.receipt_id)
                .then(res => {
                    if (res?.response?.status === 404 && res?.response?.statusText === "Not Found") {
                        toasts.push(Warning, 3500, {message: res?.response?.data?.detail});
                    } else if (res?.status === 200 && res?.statusText === "OK") {
                        const myblob = new Blob([res?.data]);
                        print(window.URL.createObjectURL(myblob));
                        // labelPdf.href = window.URL.createObjectURL(myblob);
                        // labelPdf.download=`${receipt?.receipt_id}.pdf`
                        // labelIframe.src = "data:application/pdf;base64," + Base64.encode(window.URL.createObjectURL(myblob));
                        // labelIframe.contentWindow.print();
                        // labelIframe.
                        // print(res?.data);
                    }
                    console.trace(Object.entries(res))
                    console.trace(res)
                });
        }

    }
</script>
<!--<embed-->
<!--        type="application/pdf"-->
<!--        src={myblob ? window.URL.createObjectURL(myblob) : ''}-->
<!--        id="pdfDocument"-->
<!--        width="100%"-->
<!--        height="100%" />-->
<!--{(typeof receipt)}-->
<!--<iframe bind:this={labelIframe} class="hidden">-->

<!--</iframe>-->
{#if ((typeof receipt !== 'undefined') && Object.keys(receipt).length > 0)}
    <div class="w-full font-mono">
        <div class="flex w-full justify-between p-2 h-1/4 ">
            <!-- TOP PART -->
            <div class="w-1/3">
                <div class="flex flex-row justify-between align-middle">
                    <p class="text-lg font-semibold">{receipt?.receipt_id}</p>
                    <button on:click={getLabelPdf} class="focus:outline-none transition-colors bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 w-auto items-center rounded-lg mr-6">
                        <span class="mr-2">Print</span><i class="fas fa-print"></i>
                    </button>
<!--                    <a bind:this={labelPdf} hidden></a>-->
                </div>

                <!--{receipt?.shop_name}-->
                <p class="text-base">{receipt?.grandtotal} {receipt?.currency_code}</p>
                <p>Gift: {#if receipt?.is_gift}<span style="color: rgba(52, 211, 153, 1);"><i class="fas fa-check-circle"></i></span>{:else}<span style="color: rgba(248, 113, 113, 1);"><i class="fas fa-times-circle"></i></span>{/if}</p>
                {#if receipt?.is_gift}
                    <p class="text-sm font-light">{receipt?.gift_message}</p>
                {/if}
                <p>Note: {#if receipt?.message_from_buyer?.length > 0}<span style="color: rgba(52, 211, 153, 1);"><i
                        class="fas fa-check-circle"></i></span>{:else}<span style="color: rgba(248, 113, 113, 1);"><i class="fas fa-times-circle"></i></span>{/if}</p>
                {#if receipt?.message_from_buyer?.length > 0}
                    <p class="text-sm font-light">{receipt?.message_from_buyer}</p>
                {/if}
            </div>
            <div class="w-1/3 space-y-1">
                {#each receipt?.formatted_address?.split("\n") as l}
                    <p>{l}</p>
                {/each}
                <!--{#each receipt?.formatted_address}-->
    <!--            <p class="text-base">{receipt?.name}</p>-->
    <!--            <p>{#if receipt?.first_line?.length > 0}{receipt?.first_line.toUpperCase()}{/if}</p>-->
    <!--            <p>{#if receipt?.second_line?.length > 0}{receipt?.second_line.toUpperCase()}{/if}</p>-->
    <!--            <p>{receipt?.city?.toUpperCase()}, {receipt?.state?.toUpperCase()} {receipt?.zip?.toUpperCase()}</p>-->
                <p>{receipt?.buyer_email}</p>
            </div>
            <div class="w-1/3">
                <ReceiptNote receipt_id={receipt?.receipt_id}/>
            </div>
        </div>
        <div class="w-full mt-2 max-h-96 h-3/4">
            <!-- TRANSACTIONS GO HERE -->
            <TransactionList transactions={receipt?.Transactions}/>
        </div>
    </div>
{:else}
    <div class="flex items-center justify-center mt-64">
        <div class="mx-auto">
            <span class="flex items-center justify-center" style="font-size: 4rem; color: rgb(226,123,123);"><i class="fas fa-times-circle"></i></span>
            <p class="text-2xl font-light mt-2">No order found</p>
        </div>
    </div>
{/if}