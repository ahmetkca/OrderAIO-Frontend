<script>
	export let isGift;
	export let giftMessage;
	export let address;
	export let email;
	export let buyerName;
	export let grandTotal;
	export let currencyCode
	export let receiptId;
	export let sellerShopName;
	export let etsyConnectionId;

	import {onMount} from 'svelte';
	import etsyConnectionsService from '../../../services/etsyConnections.service';
	import Transaction from './Transaction.svelte';
	import ReceiptNote from './ReceiptNote.svelte';
	import { fade } from 'svelte/transition';

	let transactions = [];

	onMount(async () => {
		await etsyConnectionsService.getAllTransactionsByReceiptId(receiptId, etsyConnectionId)
			.then(res => {
				transactions = res.data.results
			})
		console.log(transactions)
	})
</script>

<div class="w-full font-mono" transition:fade>
	<div class="flex w-full justify-between p-2 h-1/4 ">
		<!-- TOP PART -->
		<div class="w-1/3">
			<p class="text-lg font-semibold">{receiptId}</p>
			{sellerShopName}
			<p class="text-base">{grandTotal} {currencyCode}</p>
<!--			❎-->
			<p>Gift: {#if isGift}✅{:else}&#10060;{/if}</p>
			<p class="text-sm font-light">{giftMessage}</p>
		</div>
		<div class="w-1/3 ">
			<p class="whitespace-pre-line">
				<!-- {buyerName}
				<br> -->
				
				{address}
				<br>
				{email}
			</p>
		</div>
		<div class="w-1/3">
			<ReceiptNote/>
		</div>
	</div>
	<div class="w-full mt-2 h-3/4">
		<!-- TRANSACTIONS GO HERE -->
<!--		<hr>-->
		{#each transactions as transaction (transaction.transaction_id)}
			
			<Transaction {transaction} {etsyConnectionId} />
<!--			<hr class="mt-2">-->
		{/each}
	</div>
	<!-- <div class="w-full mt-1 h-1/4">
		GIFT MESSAGE
		
	</div> -->
</div>