<script>
    import assignmentsService from '../../services/assignments.service';
    import receiptNoteService from '../../services/receiptNote.service';
    import VirtualList from "svelte-tiny-virtual-list";
    import {onMount} from 'svelte';
    import AssignedReceipt from "./components/AssignedReceipt.svelte";
    import MyModal, {getModal} from '../../lib/MyModal.svelte';
    import SelectedReceipt from '../AsyncOrders/components/SelectedReceipt.svelte';
    import dayjs from "dayjs";
    import relativeTime from 'dayjs/plugin/relativeTime';
    dayjs.extend(relativeTime);
    // import {toasts} from "../../stores/toast.store";
    // import Success from "../../components/Success.svelte";
    // import Danger from '../../components/Danger.svelte';
    // import Info from '../../components/Info.svelte'
    // import Warning from '../../components/Warning.svelte';


    let assigned_notes = [];
    let searchData = "";
    let filteredData = [];
    // => receipt?.name.toLowerCase().indexOf(searchData.toLowerCase()) !== -1 || receipt?.receipt_id.toString().indexOf(searchData) !== -1);
    $: filteredData = assigned_notes.filter(assigned_note => assigned_note?.receipt_id.toString().indexOf(searchData.toString()) !== -1);
    $: console.log(filteredData);
    onMount(async () => {
        await reloadAllAssignments();
    })

    const reloadAllAssignments = async () => {
        assigned_notes = []
        filteredData = []
        await assignmentsService.getAllAssignedNotes()
            .then(res => {
                if (res?.status === 200) {
                    console.log(res?.data);
                    assigned_notes = res?.data;
                    filteredData = assigned_notes.filter(assigned_note => assigned_note?.receipt_id.toString().indexOf(searchData) !== -1 );
                } else if (res?.response?.status === 404) {
                    console.log(res?.response?.data?.detail);
                }
            })
    }

    const handleKeyPress = async () => {

    }

    const search = async () => {

    }

    const handleResolve = async (event) => {
        assigned_notes = assigned_notes.filter(assigned_note => assigned_note?.receipt_id !== event.detail.resolved_receipt_id);
    }

    let receipt = {}
    const handleOpenInModal = async (event) => {
        receipt = await event.detail.receipt;
        getModal('receipt_from_assigned_note').open()
    }
</script>

<MyModal closeCallback={reloadAllAssignments} size="large" id="receipt_from_assigned_note">
    <div slot="header">
        <p class="text-lg font-semibold">Order# {receipt?.receipt_id}</p>
        <p title="This date means this order should have been sent to shipment provider by this date or before." class="text-sm font-light">Max due date:  {dayjs(receipt?.max_due_date).format("MMM DD, YYYY (ddd)")}</p>
        <p class="text-xs font-light">{dayjs(receipt?.max_due_date).add(17, "h").fromNow()}</p>
    </div>
    <div slot="body">
        {#key receipt?.receipt_id}
            <SelectedReceipt isInModal={true} receipt={receipt}/>
        {/key}
    </div>
    <div slot="footer">
        <div class="flex justify-between">
            <button on:click={() => getModal('receipt_from_assigned_note').close(reloadAllAssignments)} type="button" class="block px-4 py-2 text-white transition duration-100 ease-in-out bg-blue-500 border border-transparent rounded shadow-sm hover:bg-blue-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50  disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
            <button on:click={() => getModal('receipt_from_assigned_note').close(reloadAllAssignments)} type="button" class="block px-4 py-2 text-white transition duration-100 ease-in-out bg-blue-500 border border-transparent rounded shadow-sm hover:bg-blue-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50  disabled:opacity-50 disabled:cursor-not-allowed">Ok</button>
        </div>
    </div>
</MyModal>

<div class="mx-auto px-10">
    <VirtualList
            width="100%"
            height={800}
            itemCount={filteredData.length}
            itemSize={165}>
        <div slot="header" class="px-1 mb-2 mx-1">
            <!--{JSON.stringify(filteredData)}-->
            <div class="shadow flex border border">
                <input on:keypress={handleKeyPress} class="w-full rounded p-2 focus:outline-none" type="text" bind:value={searchData} placeholder="Search...">
                <button on:click={() => {searchData = ""}} class="focus:outline-none w-auto flex justify-end items-center text-gray-500 p-2 hover:text-gray-400">
                    <i class="fas fa-times"></i>
                </button>
                <button on:click={search} class="focus:outline-none w-auto flex justify-end items-center text-blue-500 p-2 hover:text-blue-400">
                    <i class="fas fa-search"></i>
                </button>
<!--                <button on:click={() => dispatch("openModal")} class="focus:outline-none w-auto flex justify-end items-center text-blue-500 p-2 hover:text-blue-400">-->
<!--                    <i class="fas fa-filter"></i>-->
<!--                </button>-->
            </div>
        </div>
        <div slot="item" let:index let:style {style}>
            {#key filteredData[index]?.receipt}
                <AssignedReceipt on:openInModal={handleOpenInModal} on:resolve={handleResolve} assigned_receipt_note={filteredData[index]}/>
            {/key}
        </div>
    </VirtualList>
</div>