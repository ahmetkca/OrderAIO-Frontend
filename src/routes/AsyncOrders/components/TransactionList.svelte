<script>
    export let transactions;

    import Transaction from './Transaction.svelte';
</script>

<div class="overflow-y-auto mx-2" style="max-height: 37.25rem;">
    {#if transactions !== undefined}
        <p class="my-1 text-lg font-semibold underline">{transactions.length} jewelry</p>
        {#each transactions as transaction (transaction?.transaction_id)}
            <Transaction {transaction}/>
        {/each}
    {/if}
</div>