<script>
    export let receipt = {};

    import TransactionList from './TransactionList.svelte';
</script>

<!--{(typeof receipt)}-->
{#if ((typeof receipt !== 'undefined') && Object.keys(receipt).length > 0)}
    <div class="w-full font-mono">
        <div class="flex w-full justify-between p-2 h-1/4 ">
            <!-- TOP PART -->
            <div class="w-1/3">
                <p class="text-lg font-semibold">{receipt?.receipt_id}</p>
                <!--{receipt?.shop_name}-->
                <p class="text-base">{receipt?.grandtotal} {receipt?.currency_code}</p>
                <p>Gift: {#if receipt?.is_gift}<span style="color: rgba(52, 211, 153, 1);"><i class="fas fa-check-circle"></i></span>{:else}<span style="color: rgba(248, 113, 113, 1);"><i class="fas fa-times-circle"></i></span>{/if}</p>
                {#if receipt?.is_gift}
                    <p class="text-sm font-light">{receipt?.gift_message}</p>
                {/if}
                <p>Note: {#if receipt?.message_from_buyer?.length > 0}<span style="color: rgba(52, 211, 153, 1);"><i
                        class="fas fa-check-circle"></i></span>{:else}<span style="color: rgba(248, 113, 113, 1);"><i class="fas fa-times-circle"></i></span>{/if}</p>
                {#if receipt?.message_from_buyer?.length > 0}
                    <p class="text-sm font-light">{receipt?.message_from_buyer}</p>
                {/if}
            </div>
            <div class="w-1/3 space-y-1">
                {#each receipt?.formatted_address?.split("\n") as l}
                    <p>{l}</p>
                {/each}
                <!--{#each receipt?.formatted_address}-->
    <!--            <p class="text-base">{receipt?.name}</p>-->
    <!--            <p>{#if receipt?.first_line?.length > 0}{receipt?.first_line.toUpperCase()}{/if}</p>-->
    <!--            <p>{#if receipt?.second_line?.length > 0}{receipt?.second_line.toUpperCase()}{/if}</p>-->
    <!--            <p>{receipt?.city?.toUpperCase()}, {receipt?.state?.toUpperCase()} {receipt?.zip?.toUpperCase()}</p>-->
                <p>{receipt?.buyer_email}</p>
            </div>
            <div class="w-1/3">
            </div>
        </div>
        <div class="w-full mt-2 max-h-96 h-3/4">
            <!-- TRANSACTIONS GO HERE -->
            <TransactionList transactions={receipt?.Transactions}/>
        </div>
    </div>
{:else}
    <div class="flex items-center justify-center mt-64">
        <div class="mx-auto">
            <span class="flex items-center justify-center" style="font-size: 4rem; color: rgb(226,123,123);"><i class="fas fa-times-circle"></i></span>
            <p class="text-2xl font-light mt-2">No order found</p>
        </div>
    </div>
{/if}