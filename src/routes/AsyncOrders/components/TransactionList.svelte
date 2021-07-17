<script>
    export let transactions;

    import Transaction from './Transaction.svelte';
</script>

<div class="overflow-y-auto" style="max-height: 37.75rem;">
    {#if transactions !== undefined}
        {#each transactions as transaction (transaction?.transaction_id)}
            <Transaction {transaction}/>
        {/each}
    {/if}
</div>