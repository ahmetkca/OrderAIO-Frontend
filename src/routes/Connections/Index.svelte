
<script>
	import {onMount} from 'svelte';
	// import etsyConnectionsService from '../../services/etsyConnections.service';
	import ConnectedEtsyShop from './components/ConnectedEtsyShop.svelte';
	import { etsyConnections } from "../../stores/etsyConnection.store";

	let connections = [];

    onMount(async () => {
    	if (Object.keys($etsyConnections).length === 0) {
    		console.log("reloading etsy connections...")
    		await etsyConnections.reload();
		}
		connections = Object.values($etsyConnections)
		console.trace(connections);
		
        // here call all connections (etsy, ebay, amazon etc.)
		// await etsyConnectionsService.get_all_etsy_connections()
		// 	.then(res => {
		// 		if (res.status === 200) {
		// 			connections = res.data
		// 			connections.forEach(async el => {
		// 				await etsyConnectionsService.searchTest(el._id)
		// 					.then(res => {
		// 						console.log(res);
		// 					})
		// 			})
		//
		// 		}
		// 	}).catch(function (error) {
		// 		console.error(error);
		// 	})
    })
</script>

<div class="container px-5 py-24 mx-auto">
	<div class="flex flex-wrap -m-4">
		{#each connections as etsyConnection (etsyConnection._id)}
			<!--{JSON.stringify(etsyConnection)}-->
			<ConnectedEtsyShop
					shopName={etsyConnection.etsy_shop_name}
					etsyConnectionId={etsyConnection._id}
					shopPicUrl={etsyConnection.shop_icon_url}
					shopUrl={etsyConnection.shop_url}
			/>
		{/each}
	</div>
<!--	Display all connections (Etsy, Ebay, Amazon and Shopify etc.)-->
	<!--{JSON.stringify(connections)}-->
</div>
<!-- <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
	
</div> -->