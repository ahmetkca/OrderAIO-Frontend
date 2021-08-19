<script>
    // import {push} from 'svelte-spa-router';
    import {onMount} from 'svelte';
    import MyModal, {getModal} from '../../../lib/MyModal.svelte';
    import checkSameAddressSameNameService from '../../../services/check_same_address_same_name.service';
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();
    import {setContext} from 'svelte';

    export let isInModal = false;
    export let receipt = {};
    setContext('isInModal', isInModal);

    import {toasts} from "../../../stores/toast.store";
    import Success from "../../../components/Success.svelte";
    import Danger from '../../../components/Danger.svelte';
    import Info from "../../../components/Info.svelte"
    import Warning from '../../../components/Warning.svelte';
    import TransactionList from './TransactionList.svelte';
    import ReceiptNote from './ReceiptNote.svelte'
    import receiptLabelPrintService from '../../../services/receiptLabelPrint.service';
    import print from 'print-js';
    import shipmentsService from '../../../services/shipments.service';
    import Icon from '@iconify/svelte';
    import dayjs from "dayjs";
    import relativeTime from 'dayjs/plugin/relativeTime';
    // import SelectedReceipt from "./SelectedReceipt.svelte";

    dayjs.extend(relativeTime);

    let isLabelLoading = false;
    let possibleSameNameSameAddressOrders = [];
    let isLoadingCheckSameAddressSameName = false;
    let isStallionStatusLoading = false;
    let labelStatus = 'No label'

    onMount(async () => {
        isLoadingCheckSameAddressSameName = true;
        isStallionStatusLoading = true;
        await shipmentsService.getStallionLabelStatusByOrderId(receipt?.receipt_id)
            .then(res => {
                if (res?.status === 200) {
                    labelStatus = res?.data ? res.data : "No label"
                    // console.log(res?.data)
                    // console.log(labelStatus)
                    // toasts.push(Info, 4000, {message: `Label found for ${receipt?.name} with the ${receipt?.receipt_id} order id.`})
                } else if (res?.response?.status === 404) {
                    toasts.push(Danger, 3500, {message: res?.response?.data?.detail})
                }
            })
            .catch(err => {
                toasts.push(Danger, 3500, {message: err})
            })
        isStallionStatusLoading = false;

        await checkSameAddressSameNameService.checkSameAddressSameName({
            receipt_id_to_exclude: receipt?.receipt_id,
            name: receipt?.name,
            first_line: receipt?.first_line,
            second_line: receipt?.second_line,
            city: receipt?.city,
            state: receipt?.state,
            zip: receipt?.zip
        })
            .then(res => {
                if (res?.status === 200) {
                    possibleSameNameSameAddressOrders = res?.data;
                } else if (res?.response?.status === 404) {
                    // console.error(res?.response?.data?.detail)
                }
                // console.log(res);
            })
        isLoadingCheckSameAddressSameName = false;
        // console.log(receipt?.first_line)
    })

    const getLabelPdf = async () => {
        isLabelLoading = true;
        toasts.push(Info, 3500, {message: "Label loading. Please wait..."});
        if (receipt?.receipt_id) {
            await receiptLabelPrintService.getLabelPdfByReceiptId(receipt?.receipt_id)
                .then(res => {
                    if (res?.response?.status === 404 && res?.response?.statusText === "Not Found") {
                        console.log(res?.response?.data)
                        const enc = new TextDecoder("utf-8");
                        const detail_json = JSON.parse(enc.decode(res?.response?.data));
                        // `No Label found for ${receipt?.receipt_id}.`
                        toasts.push(Warning, 3500, {message: detail_json.detail});
                    } else if (res?.status === 200 && res?.statusText === "OK") {

                        const myblob = new Blob([res?.data], {type: 'application/pdf'});
                        const labelPdfUrl = window.URL.createObjectURL(myblob);
                        print({
                            printable: labelPdfUrl,
                            type: 'pdf',
                            showModal: true,
                            modalMessage: "Label Loading...",
                            // onLoadingStart: () => {toasts.push(Warning, 3500, {message: `No Label found for ${receipt?.receipt_id}.`});}
                        });
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
        isLabelLoading = false;
    }
</script>

<!--{}-->
<!--{receipt}-->
<!--{#if receipt}-->
<!--    <MyModal size="large" id="transactions_display_from_selected_receipt">-->
<!--        <div slot="header">-->
<!--            Transactions-->
<!--        </div>-->
<!--        <div slot="body" class="">-->
<!--            <TransactionList transactions={receipt?.Transactions}/>-->
<!--        </div>-->
<!--        <div slot="footer">-->
<!--            <div class="flex justify-between">-->
<!--                <button on:click={() => getModal('transactions_display_from_selected_receipt').close()} type="button" class="block px-4 py-2 text-white transition duration-100 ease-in-out bg-blue-500 border border-transparent rounded shadow-sm hover:bg-blue-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50  disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>-->
<!--                <button on:click={() => getModal('transactions_display_from_selected_receipt').close()} type="button" class="block px-4 py-2 text-white transition duration-100 ease-in-out bg-blue-500 border border-transparent rounded shadow-sm hover:bg-blue-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50  disabled:opacity-50 disabled:cursor-not-allowed">Ok</button>-->
<!--            </div>-->
<!--        </div>-->
<!--    </MyModal>-->
<!--{/if}-->

<MyModal id="address_display_selected_receipt">
    <div slot="header">
        Recipient name, address and email
    </div>
    <div slot="body" class="">
        {#if typeof receipt?.formatted_address === "string" }
            {#each receipt?.formatted_address?.split("\n") as l}
                <p class="text-lg">{l}</p>
            {/each}
            <p>{receipt?.buyer_email}</p>
        {/if}
    </div>
    <div slot="footer">
        <div class="flex justify-between">
            <button on:click={() => getModal('address_display_selected_receipt').close()} type="button" class="block px-4 py-2 text-white transition duration-100 ease-in-out bg-blue-500 border border-transparent rounded shadow-sm hover:bg-blue-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50  disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
            <button on:click={() => getModal('address_display_selected_receipt').close()} type="button" class="block px-4 py-2 text-white transition duration-100 ease-in-out bg-blue-500 border border-transparent rounded shadow-sm hover:bg-blue-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50  disabled:opacity-50 disabled:cursor-not-allowed">Ok</button>
        </div>
    </div>
</MyModal>

<MyModal id="same_address_same_name">
    <div slot="header">
        Orders with the same address and name
    </div>
    <div slot="body">
        {#if possibleSameNameSameAddressOrders.length === 0}
            <p>No order found with the same address and name</p>
        {:else}
            <ul class="my-1 py-1">
                {#each possibleSameNameSameAddressOrders as sameNameSameOrder (sameNameSameOrder.receipt_id)}
                    <li class="border-b-2 border-black">
                        <p class="underline italic font-semibold">{sameNameSameOrder.receipt_id}</p>
                        <p class="text-sm font-light">{dayjs(sameNameSameOrder?.max_due_date).format("MMM DD, YYYY (ddd)")}</p>
                        <p class="text-xs font-light">{dayjs(sameNameSameOrder?.max_due_date).add(17, "h").fromNow()}</p>
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
    <div slot="footer">
        <div class="flex justify-between">
            <button on:click={() => getModal('same_address_same_name').close()} type="button" class="block px-4 py-2 text-white transition duration-100 ease-in-out bg-blue-500 border border-transparent rounded shadow-sm hover:bg-blue-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50  disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
            <button on:click={() => getModal('same_address_same_name').close()} type="button" class="block px-4 py-2 text-white transition duration-100 ease-in-out bg-blue-500 border border-transparent rounded shadow-sm hover:bg-blue-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50  disabled:opacity-50 disabled:cursor-not-allowed">Ok</button>
        </div>
    </div>
</MyModal>

<MyModal id="gift_and_note">
    <div slot="header">
        Gift and Note
    </div>
    <div slot="body">
        <p><span class="underline">Gift:</span> {#if receipt?.is_gift}<span style="color: rgba(52, 211, 153, 1);"><i class="fas fa-check-circle"></i></span>{:else}<span style="color: rgba(248, 113, 113, 1);"><i class="fas fa-times-circle"></i></span>{/if}</p>
        {#if receipt?.is_gift}
            <p class="px-1 py-0.5 text-sm font-light">{receipt?.gift_message}</p>
        {/if}
        <p><span class="underline">Note:</span> {#if receipt?.message_from_buyer?.length > 0}<span style="color: rgba(52, 211, 153, 1);"><i
                class="fas fa-check-circle"></i></span>{:else}<span style="color: rgba(248, 113, 113, 1);"><i class="fas fa-times-circle"></i></span>{/if}</p>
        {#if receipt?.message_from_buyer?.length > 0}
            <p class="px-1 py-0.5  text-sm font-light">{receipt?.message_from_buyer}</p>
        {/if}
    </div>
    <div slot="footer">
        <div class="flex justify-between">
            <button on:click={() => getModal('gift_and_note').close()} type="button" class="block px-4 py-2 text-white transition duration-100 ease-in-out bg-blue-500 border border-transparent rounded shadow-sm hover:bg-blue-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50  disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
            <button on:click={() => getModal('gift_and_note').close()} type="button" class="block px-4 py-2 text-white transition duration-100 ease-in-out bg-blue-500 border border-transparent rounded shadow-sm hover:bg-blue-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50  disabled:opacity-50 disabled:cursor-not-allowed">Ok</button>
        </div>
    </div>
</MyModal>
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
<!--    <div class="w-full font-mono p-1.5">-->
        <div class="flex w-full justify-between p-2 h-1/4 ">
            <!-- TOP PART -->
            <div class="w-2/5">
                <div class="flex flex-row justify-between align-middle">
                    <p class="text-md font-semibold">{receipt?.receipt_id}</p>
                    {#if isStallionStatusLoading}
                        <p class="self-center text-sm font-light">Label status loading <i class="fas fa-spinner fa-pulse"></i></p>
                    {:else}
                        <div class="flex justify-between align-middle items-center">
                            <p class=" self-center text-sm font-light mr-1">{labelStatus}</p>
                            {#if labelStatus === "Ready"}
                                <Icon class=" self-center" icon="mdi:cube-outline" align="center" color="green"  width="20" height="20" />
                            {:else if labelStatus === "Processing"}
                                <Icon class="self-center" icon="mdi:marker-check"  align="center" color="cyan"  width="20" height="20"/>
                            {:else if labelStatus === "In Transit"}
                                <Icon class="self-center" icon="mdi:cube-send" align="center" color="purple"  width="20" height="20" />
                            {:else if labelStatus === "Delivered"}
                                <Icon class="self-center" icon="mdi:check" align="center" color="blue"  width="20" height="20" />
                            {:else if labelStatus === "Incomplete"}
                                <Icon class="self-center" icon="mdi:circle-edit-outline" align="center" color="red"  width="20" height="20" />
                            {:else if labelStatus === "Pending"}
                                <Icon class="self-center" icon="mdi:pause-circle-outline" align="center" color="orange"  width="20" height="20" />
                            {:else if labelStatus === "Void Requested"}
                                <Icon class="self-center" icon="mdi:select" align="center" color="red"  width="20" height="20" />
                            {:else if labelStatus === "Voided"}
                                <Icon class="self-center" icon="mdi:select-off" align="center" color="red"  width="20" height="20" />
                            {:else if labelStatus === "No label"}
                                <Icon class="self-center" icon="ic:baseline-do-not-disturb" hAlign={true} inline={true} color="red"  width="20" height="20" />
                            {:else if labelStatus === "Expired"}
                                <Icon class="self-center" icon="mdi:alert-outline" hAlign={true} inline={true} color="orange"  width="20" height="20" />
                            {:else}
                                <Icon icon="ic:baseline-do-not-disturb" class="ml-2 self-center"  align="center" inline={true} color="red"  width="20" height="20"/>
                            {/if}
                        </div>

                    {/if}
                    <button disabled={isLabelLoading} class:opacity-50={isLabelLoading} on:click={getLabelPdf} class="focus:outline-none transition-colors bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 w-24 items-center rounded-lg mr-6">
                        {#if isLabelLoading}
                            <i class="fas fa-spinner fa-pulse"></i>
                        {:else}
                            <span class="mr-2">Print</span><i class="fas fa-print"></i>
                        {/if}
                    </button>
<!--                    <a bind:this={labelPdf} hidden></a>-->
                </div>

                <!--{receipt?.shop_name}-->
                <div class="flex flex-row justify-between align-middle mt-1">
                    <p class="text-base">{receipt?.grandtotal} {receipt?.currency_code}</p>
                    <button disabled="{isLoadingCheckSameAddressSameName}" class:opacity-50={isLoadingCheckSameAddressSameName} on:click={() => getModal('same_address_same_name').open()} title="There are {possibleSameNameSameAddressOrders ? possibleSameNameSameAddressOrders?.length: '0'} more receipts with the same address same name. Click to see more." class="text-sm font-light focus:outline-none transition-all border border-blue-600 bg-transparent hover:bg-blue-600 hover:text-white text-blue-600 font-bold py-0.5 px-1 w-24 items-center rounded-lg mr-6 w-1/2">
                        {#if isLoadingCheckSameAddressSameName}
                            <i class="fas fa-spinner fa-pulse"></i> Checking orders...
                        {:else}
                            See {possibleSameNameSameAddressOrders ? possibleSameNameSameAddressOrders?.length: '0'} more orders
                        {/if}
                    </button>
                </div>
                <div class="flex flex-col max-w-sm" on:click={() => getModal('gift_and_note').open()}>
                    <p><span class="underline">Gift:</span> {#if receipt?.is_gift}<span style="color: rgba(52, 211, 153, 1);"><i class="fas fa-check-circle"></i></span>{:else}<span style="color: rgba(248, 113, 113, 1);"><i class="fas fa-times-circle"></i></span>{/if}</p>
                    {#if receipt?.is_gift}
                        <p class="px-1 py-0.5 truncate text-xm font-light">{receipt?.gift_message}</p>
                    {/if}
                    <p><span class="underline">Note:</span> {#if receipt?.message_from_buyer?.length > 0}<span style="color: rgba(52, 211, 153, 1);"><i
                            class="fas fa-check-circle"></i></span>{:else}<span style="color: rgba(248, 113, 113, 1);"><i class="fas fa-times-circle"></i></span>{/if}</p>
                    {#if receipt?.message_from_buyer?.length > 0}
                        <p class="px-1 py-0.5 truncate text-xm font-light">{receipt?.message_from_buyer}</p>
                    {/if}
                </div>

            </div>
            <div class="w-1/5 space-y-1 text-sm" on:click={() => getModal('address_display_selected_receipt').open()}>
                {#each receipt?.formatted_address?.split("\n") as l}
                    <p class="truncate">{l}</p>
                {/each}
                <!--{#each receipt?.formatted_address}-->
    <!--            <p class="text-base">{receipt?.name}</p>-->
    <!--            <p>{#if receipt?.first_line?.length > 0}{receipt?.first_line.toUpperCase()}{/if}</p>-->
    <!--            <p>{#if receipt?.second_line?.length > 0}{receipt?.second_line.toUpperCase()}{/if}</p>-->
    <!--            <p>{receipt?.city?.toUpperCase()}, {receipt?.state?.toUpperCase()} {receipt?.zip?.toUpperCase()}</p>-->
                <p class="truncate">{receipt?.buyer_email}</p>
            </div>
            <div class="w-1/2">
                {#key receipt?.receipt_id}
                    <ReceiptNote receipt_id={receipt?.receipt_id}/>
                {/key}
            </div>
        </div>
        <div class="w-full h-3/4" ><!--on:click={() => getModal('transactions_display_from_selected_receipt').open()}-->
            <!-- TRANSACTIONS GO HERE -->
            <TransactionList transactions={receipt?.Transactions}/>
        </div>
<!--    </div>-->
{:else}
    <div class="flex items-center justify-center mt-64">
        <div class="mx-auto">
            <span class="flex items-center justify-center" style="font-size: 4rem; color: rgb(226,123,123);"><i class="fas fa-times-circle"></i></span>
            <p class="text-2xl font-light mt-2">No order found</p>
        </div>
    </div>
{/if}

<style>
    .w-45 {
        width: 45%;
    }
</style>