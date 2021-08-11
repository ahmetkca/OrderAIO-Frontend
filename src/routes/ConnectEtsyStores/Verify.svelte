<script>

	import { onMount } from 'svelte';
	import {location, querystring, push } from 'svelte-spa-router';
	import etsyConnectionsService from '../../services/etsyConnections.service';
    import {toasts} from "../../stores/toast.store";
    import Success from "../../components/Success.svelte";
    import Danger from '../../components/Danger.svelte';
    import Warning from '../../components/Warning.svelte';
    import { Circle } from 'svelte-loading-spinners';
	
	let temp_oauth_token;
	let oauth_verifier;

	onMount(async () => {
	    console.log("VERIFY ETSY CONNECTION CALLBACK")
		const currentEtsyConnectionId = sessionStorage.getItem("currentEtsyConnectionId");
		const myParams = new URLSearchParams($querystring);
		if (
			currentEtsyConnectionId === null ||
			myParams.has("oauth_token") === false ||
			myParams.has("oauth_verifier") === false
		) {
            toasts.push(Warning, 7500, {message: "Something went wrong! Unable to connect to Etsy."});
			await push("/connections");
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
			    toasts.push(Success, 7500, {message: res?.data?.detail});
                // push("/connections");
            } else if (res?.response?.status === 400 && res?.response?.statusText === "Bad Request") {
                toasts.push(Danger, 7500, {message: res?.response?.data?.detail});
            }

		})
        .catch(err => {
            console.error(err);
            toasts.push(Danger, 7500, {message: err});
        })
        await push("/connections");
	})
	
</script>

<div class="w-full h-full fixed block top-0 left-0 bg-white opacity-75 z-50">
      <span class="text-green-500 opacity-75 top-1/2 my-0 mx-auto block relative w-0 h-0" style="
        top: 50%;
    ">
<!--        <i class="fas fa-circle-notch fa-spin fa-5x" style="color: dodgerblue;"></i>-->
          <Circle size="72" color="#FF3E00" unit="px" duration="1s"/>
      </span>
</div>