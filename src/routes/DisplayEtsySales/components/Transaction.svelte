<script>
	import {onMount} from 'svelte';
	import etsyConnectionsService from '../../../services/etsyConnections.service';

	export let etsyConnectionId;
	export let transaction = {};
	let imageUrl = '';

	onMount(async () => {
		await etsyConnectionsService.getImagesOfTransaction(transaction.listing_id, transaction.image_listing_id, etsyConnectionId)
			.then(res => {
				imageUrl = res.data.results[0].url_170x135
				console.log(res.data.results[0].url_170x135)
			})
	})

</script>

<div class="flex w-full font-mono mt-2">
	<div class="w-1/3 border-r border-gray-300 p-1">
		<p class="subpixel-antialiased break-words">
			{transaction.title}
		</p>
		<div class="">
			<img src={imageUrl} alt="{transaction.transaction_id}'s listing image" />
		</div>
	</div>
	
	<div class="w-2/3 ml-2 p-2">
		<div class="grid grid-rows-5 gap-2">
			{#each transaction.variations as variation (variation.property_id)}
				<div class="border border-gray-300 p-1 min-w-max">
					{variation.formatted_name}
					<br>
					<p class="font-semibold">{variation.formatted_value}</p>
				</div>
			{/each}
			<div class="border border-gray-300 p-1">
				Quantity
				<br>
				<p class="font-semibold">{transaction.quantity}</p>
			</div>
		</div>
	</div>
</div>