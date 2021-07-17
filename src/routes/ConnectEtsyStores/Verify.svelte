<script>

	import { onMount } from 'svelte';
	import {location, querystring, push } from 'svelte-spa-router';
	import etsyConnectionsService from '../../services/etsyConnections.service';
    import {toasts} from "../../stores/toast.store";
    import Success from "../../components/Success.svelte";
    import Danger from '../../components/Danger.svelte';
    import Warning from '../../components/Warning.svelte';
	
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
			await push("/connections");
			toasts.push(Warning, 3500, {message: "Something went wrong! Unable to connect to Etsy."});
			return;
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
			if (res?.status === 200 && res?.statusText === "OK") {
			    toasts.push(Success, 3500, {message: res?.data?.detail});
                // push("/connections");
            } else if (res?.response?.status === 400 && res?.response?.statusText === "Bad Request") {
                toasts.push(Danger, 3500, {message: res?.response?.data?.detail});
            }

		})
        .catch(err => {
            console.error(err);
            toasts.push(Danger, 3500, {message: err});
        })
        await push("/connections");
	})
	
</script>