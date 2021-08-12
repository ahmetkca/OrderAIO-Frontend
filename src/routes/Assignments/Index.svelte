<script>
    import assignmentsService from '../../services/assignments.service';
    import receiptNoteService from '../../services/receiptNote.service';
    import VirtualList from "svelte-tiny-virtual-list";
    import {onMount} from 'svelte';
    import AssignedReceipt from "./components/AssignedReceipt.svelte";
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
    onMount(async () => {
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
    })

    const handleKeyPress = async () => {

    }

    const search = async () => {

    }

    const handleResolve = async (event) => {
        assigned_notes = assigned_notes.filter(assigned_note => assigned_note?.receipt_id !== event.detail.resolved_receipt_id);
    }
</script>

<div class="mx-auto w-1/2 px-10">
    <VirtualList
            width="50%"
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
            <AssignedReceipt on:resolve={handleResolve} assigned_receipt_note={filteredData[index]}/>
        </div>
    </VirtualList>
</div>