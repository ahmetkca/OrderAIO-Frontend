<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import VirtualList from "svelte-tiny-virtual-list";
    import {fade} from 'svelte/transition';
    import {etsyConnections} from "../../../stores/etsyConnection.store";
    import dayjs from "dayjs";
    import relativeTime from 'dayjs/plugin/relativeTime';
    dayjs.extend(relativeTime);

    export let data = [];
    const dispatch = createEventDispatcher();
    export let searchData = "";
    let filteredData = [];
    // $: {
    //     filteredData = data.filter(receipt => receipt?.name.toLowerCase().indexOf(searchData.toLowerCase()) !== -1 || receipt?.receipt_id.toString().indexOf(searchData) !== -1);
    //     if (filteredData.length === 0) {
    //         console.log(`Make a request for ${searchData} to an API.`)
    //         if (searchData.length > 0) {
    //             dispatch("notInCurrentData", {query: searchData});
    //         }
    //     }
    // }
    let group = data.length > 0 ? 0 : 0;
    let value = data.length > 0 ? 0 : 0;

    onMount(() => {
        filteredData = data.filter(receipt => receipt?.name.toLowerCase().indexOf(searchData.toLowerCase()) !== -1 || receipt?.receipt_id.toString().indexOf(searchData) !== -1);
    })

    $: filteredData = data.filter(receipt => receipt?.name.toLowerCase().indexOf(searchData.toLowerCase()) !== -1 || receipt?.receipt_id.toString().indexOf(searchData) !== -1);
    const search = () => {
        filteredData = data.filter(receipt => receipt?.name.toLowerCase().indexOf(searchData.toLowerCase()) !== -1 || receipt?.receipt_id.toString().indexOf(searchData) !== -1);
        if (filteredData.length === 0) {
            if (searchData.length > 0) {
                console.log(`Make a request for ${searchData} to an API.`)
                dispatch("notInCurrentData", {query: searchData});
            }
        }
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
</script>

<VirtualList
        width="22%"
        height={800}
        itemCount={filteredData.length}
        itemSize={125}>
    <div slot="header" class="px-1 mb-2 mx-1">

        <div class="shadow flex border border">
            <input on:keypress={handleKeyPress} class="w-full rounded p-2 focus:outline-none" type="text" bind:value={searchData} placeholder="Search...">
            <button on:click={() => {searchData = ""}} class="focus:outline-none w-auto flex justify-end items-center text-gray-500 p-2 hover:text-gray-400">
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
        <div in:fade class={group === index ? "border-2 border-blue-200 pt-2 pb-2 pr-2 card mx-2 mt-0 mb-1 whitespace-nowrap" : "border border-gray-200 pt-2 pb-2 pr-2 card mx-2 mt-0 mb-1 whitespace-nowrap"}>

            <input id="toggle-{index}" type=radio bind:group value={index} class="hidden"/>
            <label for="toggle-{index}" class="flex flex-col cursor-pointer select-none p-1" class:bg-blue-100={group === index} class:rounded={group === index}>
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