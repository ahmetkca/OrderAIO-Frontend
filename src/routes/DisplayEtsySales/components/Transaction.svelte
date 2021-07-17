<script>
	import {onMount} from 'svelte';
	import etsyConnectionsService from '../../../services/etsyConnections.service';
	import { Circle } from 'svelte-loading-spinners';
	import { fade } from 'svelte/transition';

	export let etsyConnectionId;
	export let transaction = {};
	let imageUrl = '';
	let thisImg;
	let loaded = false;

	onMount(async () => {
		thisImg.onload = () => {
			loaded = true;
		};
		await etsyConnectionsService.getImagesOfTransaction(transaction.listing_id, transaction.image_listing_id, etsyConnectionId)
			.then(res => {
				imageUrl = res.data.results[0].url_170x135
				console.log(res.data.results[0].url_170x135)
			})
	})

</script>

<div class="flex w-full font-mono mt-2 bg-gray-50 shadow-xl  rounded-lg border border-gray-100">
	<div class=" w-1/3 p-1">
		<p class="subpixel-antialiased break-words">
			{transaction.title}
		</p>
		<div class="">

			{#if !loaded}
				<div class="spinner-item">
					<Circle size="48" color="#808080" unit="px" duration="1s"/>
				</div>
			{/if}
			<img in:fade bind:this={thisImg} class="w-48 h-48 mx-auto" class:loaded src={imageUrl} alt="{transaction.transaction_id}'s listing image"/>


		</div>
	</div>
	
	<div class="w-2/3 ml-2 p-2">
		<div class="grid grid-rows-5 gap-2">
			{#each transaction.variations as variation (variation.property_id)}
				<div class="border border-gray-400 rounded-lg p-1 min-w-max">
					{variation.formatted_name}
					<br>
					<p class="font-semibold">{variation.formatted_value}</p>
				</div>
			{/each}
			<div class="border border-gray-400 rounded-lg p-1">
				Quantity
				<br>
				<p class="font-semibold">{transaction.quantity}</p>
			</div>
		</div>
	</div>
</div>

<style>
	img {
		display: none;
	}
	img.loaded {
		display: block;
	}
	.spinner-item {
		min-width: 192px;
		min-height: 192px;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		/*box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);*/
	}
</style>