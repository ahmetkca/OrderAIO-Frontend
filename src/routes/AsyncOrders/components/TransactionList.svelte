<script>
    export let transactions;

    import Transaction from './Transaction.svelte';
    import {onMount} from "svelte";

    let totalQuantity = 0;

    onMount(() => {
        if (transactions !== undefined) {
            for (let i = 0; i < transactions.length; i++) {
                totalQuantity = totalQuantity + transactions[i]?.quantity
            }
        }
    })
</script>

<div class="overflow-y-auto mx-2" style="max-height: 37.25rem;">
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