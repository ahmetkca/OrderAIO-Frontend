<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import VirtualList from "svelte-tiny-virtual-list";
    import {fade} from 'svelte/transition';
    import {etsyConnections} from "../../../stores/etsyConnection.store";
    import dayjs from "dayjs";
    import relativeTime from 'dayjs/plugin/relativeTime';
    import {orders} from "../../../stores/orders.store";
    import Icon from '@iconify/svelte';
    // import receiptNoteService from "../../../services/receiptNote.service";

    // import receiptNoteService from '../../../services/receiptNote.service';
    dayjs.extend(relativeTime);
    let innerWidth = 0;
    let innerHeight = 0;
    // let $orders = $orders;
    const dispatch = createEventDispatcher();
    export let searchData = "";
    let filteredData = [];
    export let isSearching = false;
    let searchBarInputTag;
    let isMounted = false;
    // $: {
    //     filteredData = $orders.filter(receipt => receipt?.name.toLowerCase().indexOf(searchData.toLowerCase()) !== -1 || receipt?.receipt_id.toString().indexOf(searchData) !== -1);
    //     if (filteredData.length === 0) {
    //         console.log(`Make a request for ${searchData} to an API.`)
    //         if (searchData.length > 0) {
    //             dispatch("notInCurrentData", {query: searchData});
    //         }
    //     }
    // }
    export let group = $orders.length > 0 ? 0 : 0;
    let value = $orders.length > 0 ? 0 : 0;

    // $: isSearching,

    onMount(async () => {
        isMounted = true;
        searchBarInputTag.focus()
        filteredData = $orders.filter(receipt => receipt?.name.toLowerCase().indexOf(searchData.toLowerCase()) !== -1 || receipt?.receipt_id.toString().indexOf(searchData) !== -1);
        // await getReceiptStatus();
        // console.info(filteredData);
    })
    // $: console.log($orders)
    // $: $orders.forEach(async (receipt, index) => {
    //     await receiptNoteService.getNote(receipt.receipt_id)
    //         .then(res => {
    //             if (res?.status === 200) {
    //                 receipt.status = res?.data?.status;
    //                 // return {...el, 'status': res?.data?.status}
    //             } else if (res?.response?.status === 404) {
    //                 // return {...el, 'status': 'UNCOMPLETED'}
    //                 receipt.status = 'UNCOMPLETED';
    //             }
    //         })
    // })
    $: filteredData = $orders.filter(receipt => receipt?.name.toLowerCase().indexOf(searchData.toLowerCase()) !== -1 || receipt?.receipt_id.toString().indexOf(searchData) !== -1);
    const search = () => {
        filteredData = $orders.filter(receipt => receipt?.name.toLowerCase().indexOf(searchData.toLowerCase()) !== -1 || receipt?.receipt_id.toString().indexOf(searchData) !== -1);
        if (filteredData.length === 0) {
            if (searchData.length > 0) {
                console.log(`Make a request for ${searchData} to an API.`)
                dispatch("notInCurrentData", {query: searchData});
            }
        }
        searchBarInputTag.focus()
    }

    const handleKeyPress = (e) => {
        if (e.charCode === 13) search();
    }

    $: if (searchData.length > 0) {
        group = 0
    }

    $: dispatch("selectedReceipt", {
        receipt: filteredData[group]
    })

    // const getReceiptStatus = async () => {
    //     setTimeout(async () => {
    //         for (let i = 0; i < $orders.length; i++) {
    //             await receiptNoteService.getNote( $orders[i].receipt_id)
    //                 .then(res => {
    //                     if (res?.status === 200) {
    //                         $orders[i].status = res?.data?.status;
    //                         // receipt.status = res?.data?.status;
    //                         // return {...el, 'status': res?.data?.status}
    //                     } else if (res?.response?.status === 404) {
    //                         $orders[i].status = "UNCOMPLETED"
    //                         // return {...el, 'status': 'UNCOMPLETED'}
    //                         // receipt.status = 'UNCOMPLETED';
    //                     }
    //                 })
    //         }
    //     },250);
    //
    // }


    // const checkNoteStatus = async (receipt_id) => {
    //     await receiptNoteService.getNote(receipt_id)
    //         .then(res => {
    //             if (res?.status === 200 && res?.statusText === "OK") {
    //                 return res?.$orders?.status
    //             } else if (res?.response?.status === 404) {
    //                 throw new Error("Not Found 404");
    //             }
    //         })
    //         .catch(err => {
    //             console.error(err);
    //             throw new Error("Something went wrong. Try again later.");
    //         })
    // }
</script>
<!--<svelte:window-->
<!--        bind:innerWidth={innerWidth}-->
<!--        bind:innerHeight={innerHeight}-->
<!--/>-->
<VirtualList
        width="24%"
        height={825}
        itemCount={filteredData.length}
        itemSize={125}>

    <div slot="header" class="px-1 mb-2 mx-1">
        <!--{JSON.stringify(filteredData)}-->
        <div class="shadow flex border border">
            <input bind:this={searchBarInputTag} on:keypress={handleKeyPress} class="w-full rounded p-2 focus:outline-none" type="text" bind:value={searchData} placeholder="Search...">
            <button on:click={() => {searchData = ""; dispatch('reloadFilter')}} class="focus:outline-none w-auto flex justify-end items-center text-gray-500 p-2 hover:text-gray-400">
                <i class="fas fa-times"></i>
            </button>
            <button on:click={search} class="focus:outline-none w-auto flex justify-end items-center text-blue-500 p-2 hover:text-blue-400">
                <i class="fas fa-search"></i>
            </button>
            <button on:click={() => dispatch("openModal")} class="focus:outline-none w-auto flex justify-end items-center text-blue-500 p-2 hover:text-blue-400">
                <i class="fas fa-filter"></i>
            </button>
        </div>
    </div>
    <div  slot="item" let:index let:style {style}>
        <!--{filteredData[index]?.status}-->
<!--        <span title="{JSON.stringify(filteredData)}">asdasd</span>-->
        <div in:fade class={group === index ? "relative border-2 border-blue-300 pt-2 pb-2 pr-2 card mx-2 mt-0 mb-1 whitespace-nowrap bg-gray-50" : "bg-gray-50 border border-gray-200 pt-2 pb-2 pr-2 card mx-2 mt-0 mb-1 whitespace-nowrap"}>
            
            {#if filteredData[index].status === undefined}
                <div class="opacity-75 absolute -top-2.5 -left-1.5 w-4 h-4 animate-bounce ">
                    <i class="fas fa-spinner fa-pulse"></i>
                </div>
            {:else if filteredData[index].status === "COMPLETED"}
                <div class="opacity-75 absolute -top-2.5 -left-1.5 w-4 h-4 animate-bounce ">
                    <i style="color: green; font-size: 24px;" class="fas fas fa-check"></i>
                </div>
            {:else if filteredData[index].status === "PROBLEM"}
                <div class="opacity-75 absolute -top-2.5 -left-1.5 w-4 h-4 animate-bounce ">
                    <i style="color: #FF6405; font-size: 24px;" class="fas fa-exclamation-circle"></i>
                </div>
            {:else if filteredData[index].status === "HOLD"}
                <div class="opacity-75 absolute -top-2.5 -left-1.5 w-4 h-4 animate-bounce ">
                    <i style="color: #FF6405; font-size: 24px;" class="fas fa-pause-circle"></i>
                </div>
            {:else if filteredData[index].status === "SENT"}
                <div class="opacity-75 absolute -top-2.5 -left-1.5 w-4 h-4 animate-bounce ">
                    <Icon class="self-center" icon="mdi:cube-send" align="center" color="purple"  width="20" height="20" />
                </div>
            {:else if filteredData[index].status === "NOTSEEN"}
                <div class="opacity-75 absolute -top-2.5 -left-1.5 w-4 h-4 animate-bounce ">
                    <i style="color: red; font-size: 24px;" class="fas fa-store-slash"></i>
                </div>
            {:else}
                <div class="opacity-75 absolute -top-2.5 -left-1.5 w-4 h-4 animate-bounce ">
                    <i style="color: red; font-size: 24px;" class="fas fa-times"></i>
                </div>
            {/if}
            <!--{#await checkNoteStatus(filteredData[index]?.receipt_id)}-->
            <!--    <div class="absolute -top-2.5 -left-2 w-4 h-4 animate-bounce opacity-75">-->
            <!--        <i class="fas fa-spinner fa-pulse"></i>-->
            <!--    </div>-->
            <!--{:then status}-->
            <!--    {#if status === "COMPLETED" }-->
            <!--        <div class="absolute -top-2.5 -left-2 w-4 h-4 animate-bounce opacity-75">-->
            <!--            <i style="color: green; font-size: 24px;" class="fas fas fa-check"></i>-->
            <!--        </div>-->
            <!--    {:else if status === "UNCOMPLETED"}-->
            <!--        <div class="absolute -top-2.5 -left-2 w-4 h-4 animate-bounce opacity-75">-->
            <!--            <i style="color: red; font-size: 24px;" class="fas fa-times"></i>-->
            <!--        </div>-->
            <!--    {/if}-->
            <!--{:catch error}-->
            <!--    <div class="absolute -top-2.5 -left-2 w-4 h-4 animate-bounce opacity-75">-->
            <!--        <i style="color: red; font-size: 24px;" class="fas fa-times"></i>-->
            <!--    </div>-->
            <!--{/await}-->
            <input id="toggle-{index}" type=radio bind:group value={index} class="hidden"/>

            <label for="toggle-{index}" class={group === index ? 'rounded bg-blue-100 flex flex-col cursor-pointer select-none p-1' : 'flex flex-col cursor-pointer select-none p-1'}>
                <span class='avatar ' style='background-image: url({$etsyConnections[filteredData[index]?.shop_name]?.shop_icon_url})'></span>
                <h2 class="font-semibold mb-0.5">{filteredData[index]?.receipt_id}</h2>
                <p class="text-base">{filteredData[index]?.name}</p>
                <p class="text-sm font-light">{dayjs(filteredData[index]?.max_due_date).format("MMM DD, YYYY (ddd)")}</p>
                <p class="text-xs font-light">{dayjs(filteredData[index]?.max_due_date).add(17, "h").fromNow()}</p>

<!--                dateTimeFormat.format(new Date(filteredData[index]?.max_due_date))-->
            </label>
        </div>
    </div>

</VirtualList>


<style>

    /*input:checked + label {*/
    /*    !*border-color: black;*!*/
    /*    background-color: #ececec;*/
    /*    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);*/
    /*}*/

    .card {
        position: relative;
        /*margin: 0.5em;*/
        padding-left: 6em;
        /*border: 1px solid;*/
        border-radius: 4px;
        box-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        min-height: 5em;
        min-width: min-content;
    }

    .card::after {
        clear: both;
        display: block;
    }

    .avatar {
        position: absolute;
        width: 5em;
        height: 5em;
        left: 0.5em;
        top: 1em;
        border-radius: 50%;
        background: no-repeat 50% 50%;
        background-size: cover;
    }

    p {
        margin: 0;
        padding: 0;
        /*font-size: 14px;*/
    }
</style>