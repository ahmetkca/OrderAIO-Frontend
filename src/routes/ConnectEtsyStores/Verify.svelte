<script>

	import { onMount } from 'svelte';
	import {location, querystring, push } from 'svelte-spa-router';
	import etsyConnectionsService from '../../services/etsyConnections.service';
	
	let temp_oauth_token;
	let oauth_verifier;

	onMount(async () => {
		const currentEtsyConnectionId = sessionStorage.getItem("currentEtsyConnectionId");
		const myParams = new URLSearchParams($querystring);
		if (
			currentEtsyConnectionId === null ||
			myParams.has("oauth_token") === false ||
			myParams.has("oauth_verifier") === false
		) {
			push("/");
		}
		
		temp_oauth_token = myParams.get("oauth_token");
		oauth_verifier = myParams.get("oauth_verifier");

		await etsyConnectionsService.getAccessToken(
			currentEtsyConnectionId,
			temp_oauth_token,
			oauth_verifier
		).then(res => {
			console.log(res)
			sessionStorage.removeItem("currentEtsyConnectionId");
			push("/connections");
		});
	})
	
</script>