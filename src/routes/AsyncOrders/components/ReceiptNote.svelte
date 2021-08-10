<script>
    import {onMount} from 'svelte';
    import receiptNoteService from '../../../services/receiptNote.service';
    import usersService from '../../../services/users.service';
    import {toasts} from "../../../stores/toast.store";
    import Success from "../../../components/Success.svelte";
    import Danger from '../../../components/Danger.svelte';


    // import { Pulse } from 'svelte-loading-spinners'
    import {orders} from "../../../stores/orders.store";

    export let receipt_id;
    let noteLoading = false;
    let doesExists = false;
    let users = [];
    let note = '';
    let status = '';
    let assigned_to = 'nobody';
    let created_by = '';
    let updated_by = undefined;
    onMount(async () => {
        await usersService.getAllUsers()
            .then(res => {
                users = res.data;
            })
    })
    const updateOrCreateNote = async (statusx) => {
        if (doesExists) {
            console.log("UPDATE")
            await receiptNoteService.updateNote(Object.assign({},
                {receipt_id},
                {note},
                {status: statusx},
                assigned_to === "nobody" ? null : {assigned_to}))
                .then(res => {
                    console.log(res.data)
                    note = res?.data?.note;
                    status = res?.data?.status
                    orders.update(orders => {
                        const orderIndex = orders.findIndex(order => order.receipt_id === receipt_id);
                        console.log(orderIndex);

                        orders[orderIndex].status = status;
                        return orders;
                    })
                    assigned_to = res?.data?.assigned_to
                    created_by = res?.data?.created_by
                    updated_by = res?.data?.updated_by
                })
        } else {
            console.log("CREATE")
            await receiptNoteService.createNote(Object.assign({},
                {receipt_id},
                {note},
                {status: statusx},
                assigned_to === "nobody" ? null : {assigned_to}))
                .then(res => {
                    console.log(res.data)
                    note = res?.data?.note;
                    status = res?.data?.status
                    orders.update(orders => {
                        const orderIndex = orders.findIndex(order => order.receipt_id === receipt_id);
                        console.log(orderIndex);

                        orders[orderIndex].status = status;
                        return orders;
                    })
                    assigned_to = res?.data?.assigned_to
                    created_by = res?.data?.created_by
                    updated_by = res?.data?.updated_at
                })
            doesExists = true;
        }
    }

    const getReceiptNote = async (receiptId) => {
        noteLoading = true;
        doesExists = false;
        note = '';
        status = '';
        assigned_to = 'nobody';
        created_by = '';
        updated_by = undefined;
        await receiptNoteService.getNote(receiptId)
            .then(res => {
                // console.log(res);
                if (res?.status === 200) {
                    doesExists = true;
                    note = res.data?.note;
                    status = res.data?.status;
                    assigned_to = res.data?.assigned_to === undefined ? "nobody" : res.data?.assigned_to;
                    created_by = res.data?.created_by === undefined ? '': res.data?.created_by;
                    updated_by = res.data?.updated_by;
                } else if (res?.response?.status === 404) {
                    doesExists = false;
                }
                // console.log(Object.entries(res));
                noteLoading = false;
            })
            .catch(err => {
                console.error(err);
                noteLoading = false;
            })
    }
    // $: console.log(receiptNote);
    $: {
        getReceiptNote(receipt_id)
            .then(res => {
                // console.trace(res)
            })
    }
</script>

{#if noteLoading}
<!--    <Pulse size="60" color="#FF3E00" unit="px" duration="1s"></Pulse>-->
{:else}
    <div class="w-full flex-none image-fit mr-1 relative">
        <textarea class="resize-none w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none" rows="2" bind:value={note}></textarea>
        <div class="absolute -top-2 -left-2 w-4 h-4 animate-bounce opacity-75">
            {#if status === "COMPLETED"}
                <i style="color: green; font-size: 24px;" class="fas fas fa-check"></i>
            {:else if status === "UNCOMPLETED" || doesExists === false}
                <i style="color: red; font-size: 24px;" class="fas fa-times"></i>
            {/if}
        </div>
    </div>
    <select bind:value={assigned_to} class="w-full border bg-white rounded px-3 py-2 outline-none">
        <option value="nobody" class="py-1" selected={assigned_to === "nobody"}>Nobody assigned</option>
        {#each users as user (user?._id)}
            <option value={user?.username} class="py-1" selected={assigned_to === user?.username}>{user?.username}</option>
        {/each}
    </select>
    <div class="flex flex-wrap mt-2 justify-between">
        <div class="flex flex-row space-x-4">
            <button on:click={() => updateOrCreateNote("COMPLETED")} class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Complete <i class="fas fa-check"></i>
            </button>
            <button on:click={() => updateOrCreateNote("UNCOMPLETED")} class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="flex flex-col space-y-1 items-end align-middle justify-between">
            {#if status === "COMPLETED"}
                <p class="text-xs align-middle">Completed by {created_by || updated_by}</p>
            {:else if status === "UNCOMPLETED" || doesExists === false}
                {#if (typeof created_by === "string" && created_by.length > 0)}
                    <p class="text-xs align-middle">Seen by {created_by || updated_by}</p>
                {/if}
            {/if}
            <!--{(typeof  updated_by)}-->
            {#if (typeof  updated_by === "string" && updated_by !== '') || updated_by !== undefined}
                <!--{(typeof  updated_by === "string" && updated_by !== '')}-->
                <p class="text-xs align-middle">Last seen by {updated_by}</p>
            {/if}
        </div>
    </div>
{/if}