<script>
    import {onMount} from 'svelte';
    import {push} from 'svelte-spa-router';
    import receiptNoteService from "../../../services/receiptNote.service";
    import {toasts} from "../../../stores/toast.store";
    import Success from "../../../components/Success.svelte";
    import Warning from "../../../components/Warning.svelte";
    import {createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher();

    export let assigned_receipt_note = {};
    let note = '';

    onMount(() => {
        if (assigned_receipt_note?.note) {
            note = assigned_receipt_note.note
        }
    })

    const goToReceiptInOrdersTab = async (receipt_id) => {
        if (receipt_id) {
            await push(`/orders?query=${receipt_id}`)
        }
    }

    const resolve = async (receipt_id) => {
        note = `RESOLVED.\n${note}`;
        await receiptNoteService.updateNote(Object.assign({},
            {receipt_id},
            {status: 'UNCOMPLETED'},
            {note: note}
            )
        )
            .then(res => {
                if (res?.status === 200) {
                    dispatch('resolve', {resolved_receipt_id: receipt_id});
                    toasts.push(Success, 3500, {message: `${receipt_id} Successfully resolved.`});
                    // assigned_notes = assigned_notes.filter(assigned_note => assigned_note?.receipt_id !== receipt_id);
                }
                if (res?.response?.status === 404) {
                    toasts.push(Warning, 3500, {message: `Something went wrong! Failed to resolve.`});
                }
            })
            .catch(err => {
                toasts.push(Warning, 3500, {message: `${err}`});
            })
    }
</script>

<div class="border border-gray-200 rounded bg-gray-50 px-2 mb-1">
    <div class="mx-0.5 flex flex-row">
        <p class="w-1/2 text-lg sm:text-sm md:text-base sm:font-light font-semibold">{assigned_receipt_note?.receipt_id}</p>
<!--        <div class="absolute -top-2 -left-2 w-4 h-4 animate-bounce opacity-75">-->
        <div class="w-1/2 align-middle items-center animate-pulse">
            {#if assigned_receipt_note?.status === "COMPLETED"}
                <i style="color: green; font-size: 24px;" class="fas fas fa-check"></i>
            {:else if assigned_receipt_note?.status === "PROBLEM"}
                <i style="color: #FF6405; font-size: 24px;" class="fas fa-exclamation-circle"></i>
            {:else if assigned_receipt_note?.status === "UNCOMPLETED"}
                <i style="color: red; font-size: 24px;" class="fas fa-times"></i>
            {/if}
        </div>
<!--        </div>-->
    </div>

    <textarea class="mx-0.5 resize-none w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none" rows="2" bind:value={note}></textarea>
<!--    <a href="/orders?query={assigned_receipt_note?.receipt_id}" target="_blank" >open receipt in a new tab</a>-->
    <div class="flex flex-row  flex-shrink my-1">
        <button class="transition-all mx-0.5 bg-white hover:bg-gray-300 text-gray-800 font-semibold py-1 px-3 border border-gray-400 rounded" on:click={() => goToReceiptInOrdersTab(assigned_receipt_note?.receipt_id)}>Open</button>
        <button on:click={() => resolve(assigned_receipt_note?.receipt_id)} class="transition-all bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-3 border border-blue-500 hover:border-transparent rounded">
            Resolve
        </button>
        <div class="ml-2 flex flex-col align-middle justify-between items-center text-xs font-light space-x-4">
            {#if assigned_receipt_note?.created_by}
                <p>Created by {assigned_receipt_note?.created_by}</p>
            {/if}
            {#if assigned_receipt_note?.updated_by}
                <p>Last seen by {assigned_receipt_note?.updated_by}</p>
            {/if}
        </div>
    </div>

</div>