
<script>
	import {onMount} from 'svelte';
	import etsyConnectionsService from '../../services/etsyConnections.service';
	import ConnectedEtsyShop from './components/ConnectedEtsyShop.svelte';

	let connections = [];

    onMount(async () => {
        // here call all connections (etsy, ebay, amazon etc.)
		await etsyConnectionsService.get_all_etsy_connections()
			.then(res => {
				console.log(res);
				console.log(res.status);
				if (res.status == 200) {
					connections = res.data
				} else {
					console.log(res.data.detail);
				}
				console.log(typeof res);
				console.log(Object.entries(res));
				// connections = res.data
				console.log(typeof connections);
			}).catch(err => {
				console.log(err);
			})
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