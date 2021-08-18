<script>
    export let transactions;

    import Transaction from './Transaction.svelte';
    import {onMount} from "svelte";
    import {getContext} from 'svelte';

    let isInModal = getContext('isInModal')

    let totalQuantity = 0;

    onMount(() => {
        if (transactions !== undefined) {
            for (let i = 0; i < transactions.length; i++) {
                totalQuantity = totalQuantity + transactions[i]?.quantity
            }
        }
    })
</script>

<div class="overflow-y-auto mx-2" style={isInModal ? "max-height: 26rem;" : "max-height: 37.25rem;"}>
    {isInModal}
    {#if transactions !== undefined}
        <div class="flex align-middle items-start">
            <p class="my-1 self-center text-lg font-semibold underline">{transactions.length} jewelry type</p>
            <p class="ml-8 my-1 self-center">Total Quantity: {totalQuantity}</p>
        </div>

        {#each transactions as transaction (transaction?.transaction_id)}
            <Transaction {transaction}/>
        {/each}
    {/if}
</div>

<style>
    /*// scroll bar*/
        /* width */
    ::-webkit-scrollbar{
        width: 4px;
        height: 16px;
    }
    ::-webkit-scrollbar-track{
        background-color: transparent;
        border-radius: 4px;
        height: 1rem;
    }
    ::-webkit-scrollbar-thumb{
        background: rgba(105, 105, 105, 0.75);
        border-radius: 4px;
        height: 1rem;
    }
    ::-webkit-scrollbar-thumb:hover{
        background: rgba(70, 70, 70, 0.75);
    }
</style>