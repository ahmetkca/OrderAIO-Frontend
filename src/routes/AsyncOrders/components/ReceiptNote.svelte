<script>
    import {onMount} from 'svelte';
    import receiptNoteService from '../../../services/receiptNote.service';
    import usersService from '../../../services/users.service';
    import {toasts} from "../../../stores/toast.store";
    import Success from "../../../components/Success.svelte";
    import Danger from '../../../components/Danger.svelte';


    import {Pulse} from 'svelte-loading-spinners';
    import {orders} from "../../../stores/orders.store";
    import {users} from "../../../stores/users.store";


    export let receipt_id;

    let buttonClicked = false;
    let noteLoading = false;
    let doesExists = false;
    // let users = $users;
    let note = '';
    let status = '';
    let assigned_to = 'nobody';
    let created_by = '';
    let updated_by = undefined;
    onMount(async () => {
        console.trace($users)
        await getReceiptNote(receipt_id)
    })
    const updateOrCreateNote = async (statusx) => {
        buttonClicked = true;
        if (assigned_to !== 'nobody' && assigned_to !== null) {
            console.log(assigned_to);
            statusx = 'PROBLEM'
        }
        // console.log(assigned_to);
        if (doesExists) {
            console.log("UPDATE")

            await receiptNoteService.updateNote(Object.assign({},
                {receipt_id},
                {note},
                {status: statusx},
                assigned_to === "nobody" ? null : {assigned_to}))
                .then(res => {
                    // res.data = res?.data[0];
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
                    // res.data = res?.data[0];
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
        buttonClicked = false;
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
                console.log(res?.data);

                if (res?.status === 200) {
                    res.data = res?.data[0];
                    doesExists = true;
                    note = res.data?.note;
                    status = res.data?.status;
                    assigned_to = res.data?.assigned_to === undefined ? "nobody" : res.data?.assigned_to;
                    created_by = res.data?.created_by === undefined ? '' : res.data?.created_by;
                    updated_by = res.data?.updated_by;
                } else if (res?.response?.status === 404) {
                    doesExists = false;
                }
                // console.log(Object.entries(res));
                // setTimeout(() => {
                //
                // }, 1000000)
                noteLoading = false;
            })
            .catch(err => {
                console.error(err);
                noteLoading = false;
            })
    }
    // $: console.log(receiptNote);
</script>

<!--{doesExists}-->
<!--{JSON.stringify($users)}-->
{#if noteLoading}
    <div class="flex flex-wrap items-center align-middle content-center h-1/2 w-1/2 px-auto mx-auto">
        <div>
            <Pulse size="48" color="#000000" unit="px" duration="1s"/>
        </div>
        <p>Receipt Note Loading...</p>
    </div>
<!--    -->
{:else}
    <div class="w-full flex-none image-fit mr-1 relative">
        <textarea class="resize-none w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none" rows="2" bind:value={note}></textarea>
<!--        <i class="fas fa-tag"></i> LABEL YOK STATUSU -->
<!--        <i class="fas fa-globe-europe"></i>-->
        <div class="absolute -top-2 -left-2 w-4 h-4 animate-bounce opacity-75">
            {#if status === "COMPLETED"}
                <i style="color: green; font-size: 24px;" class="fas fas fa-check"></i>
            {:else if status === "PROBLEM"}
                <i style="color: #FF6405; font-size: 24px;" class="fas fa-exclamation-circle"></i>
            {:else if status === "UNCOMPLETED" || doesExists === false}
                <i style="color: red; font-size: 24px;" class="fas fa-times"></i>
            {/if}
        </div>
    </div>
    <select bind:value={assigned_to} class="w-full border bg-white rounded px-3 py-2 outline-none">
        <option value="nobody" class="py-1" selected={assigned_to === "nobody"}>Nobody assigned</option>
        {#each $users as user (user?._id)}
            <option value={user?.username} class="py-1" selected={assigned_to === user?.username}>{user?.username}</option>
        {/each}
    </select>
    <div class="flex flex-wrap mt-2 justify-between">
        <div class="flex justify-center rounded-lg text-lg mb-4">
            <button disabled={buttonClicked} class:opacity-50={buttonClicked} on:click={() => updateOrCreateNote("COMPLETED")} class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-l">
                Complete {#if buttonClicked}<i class="fas fa-spinner fa-pulse"></i>{:else}<i class="fas fa-check"></i>{/if}
            </button>
            <button disabled={buttonClicked} class:opacity-50={buttonClicked} on:click={() => updateOrCreateNote("UNCOMPLETED")} class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-l-0 border-gray-400 rounded-r">
                {#if buttonClicked}
                    <i class="fas fa-spinner fa-pulse"></i>
                {:else}
                    <i class="fas fa-times"></i>
                {/if}

            </button>
        </div>
        <div class="flex flex-col space-y-1 items-end align-middle justify-between font-light">
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