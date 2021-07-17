<script>
	import oauth2Service from '../../services/oauth2.service';
	import { oauth2_user, isAuthenticated } from '../../stores/user.store';

	import {link, push} from 'svelte-spa-router';
	import { Circle } from 'svelte-loading-spinners'
	import { querystring } from 'svelte-spa-router';
	import { onMount } from 'svelte';
	import {toasts} from "../../stores/toast.store";
	import Success from "../../components/Success.svelte";
	import Danger from '../../components/Danger.svelte';
	import Warning from '../../components/Warning.svelte';


	let username;
	let password;
	let isSubmitting = false;
	let myParams = new URLSearchParams($querystring);

	$: if (myParams.has("error")) {
		// toast for querystring
		toasts.push(Warning, 3500, {message: myParams.get("error")});
	}

	onMount(() => {
		if (myParams.has("error")) {
			// toast for querystring
			toasts.push(Warning, 3500, {message: myParams.get("error")});
		}
	})

	const login = async () => {
		if (username.length === 0 || password.length === 0) {
			return;
		}
		isSubmitting = true;
		await oauth2Service.authenticate(username, password)
			.then(async res => {
				// console.trace(Object.entries(res));
				if (res?.response?.status === 401 || res?.response?.status === 403) {
					toasts.push(Danger, 3500, {message: res?.response?.data?.detail});
					return;
				}
				// 	console.
				// }
				// console.trace(res?.response.data.detail);
				if (res?.data?.status === "authenticated" && res?.status === 200) {
					console.log(`Login.svelte > login() > authenticate is successful.`)
					await oauth2Service.authMe()
							.then(res => {
								if (res?.response?.status === 403 || res?.response?.status === 401) {
									push(`/login?error=${res?.response?.data?.detail}`);
									return;
								}
								if (res?.data?.status === "ok") {
									console.log(`Login.svelte > login() > authMe is successful > ${res?.data?.user}`);
									oauth2_user.set(res?.data?.user)
									if ($oauth2_user?.user.length > 0 && $oauth2_user?.user_id.length > 0) {
										isAuthenticated.set(true);
									}
									if ($isAuthenticated) {
										toasts.push(Success, 3500, {message: "Successfully logged in."});
										push('/connections')
									} else {
										toasts.push(Danger, 3500, {message: "Something went wrong! Try again later."});
									}
								}

								isSubmitting = false;
							})
				} else {
					toasts.push(Danger, 3500, {message: "Something went wrong! Try again later."});
				}
			})
			.catch(err => {
				console.error(err);
				isSubmitting = false;
				// toast for error
				toasts.push(Danger, 3500, {message: err})
			})
		
		isSubmitting = false;
	}

	// const login = async () => {
	// 	if (username.length === 0 || password.length === 0) {
	// 		return;
	// 	}
	// 	isSubmitting = true;
	// 	await authService.login(username, password)
	// 		.then(res =>{
				
	// 			bearerToken.set(res.data.token);
	// 		})
	// 	await authService.authenticate()
	// 		.then(res => {
	// 			isAuthenticated.set(true);
	// 			user.set(res.data.payload);
	// 			push('/');
	// 		})
	// 		toast.push('Success!', {
	// 			theme: {
	// 				'--toastBackground': '#48BB78',
	// 				'--toastProgressBackground': '#2F855A'
	// 			}
	// 		})
	// 	isSubmitting = false;
	// }
</script>

<div class="bg-gray-50 min-h-screen flex flex-col">
	<div class="container max-w-sm mx-auto flex-1 flex flex-col items-baseline justify-center px-2 mb-56">
		<div class="bg-white px-6 py-8 rounded shadow-md text-black w-full">
			<h1 class="mb-8 text-3xl text-center">Sign in</h1>
			<input
				bind:value={username}
				type="text"
				class="block border border-gray-300 w-full p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
				name="fullname"
				placeholder="Username" />

			<input 
				bind:value={password}
				type="password"
				class="block border border-gray-300 w-full p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
				name="password"
				placeholder="Password" />

			<button
				on:click|preventDefault={login}
				type="submit"
				class="w-full flex align-center justify-center text-center py-3 rounded bg-green-600 text-white hover:bg-green-800 focus:outline-none my-1"
				disabled={isSubmitting}
			>
				{#if isSubmitting}
					<!-- #065F46 -->
					 <Circle size="24" color="#FFFFFF" unit="px" duration="1s"></Circle>
				{:else}
					Sign in
				{/if}
			</button>

			<div class="text-center text-sm text-gray-500 mt-4">
				By signing up, you agree to the 
				<a class="no-underline border-b border-gray-700 text-gray-500" href="#">
					Terms of Service
				</a> and 
				<a class="no-underline border-b border-gray-700 text-gray-500" href="#">
					Privacy Policy
				</a>
			</div>
		</div>

		<div class="text-gray-500 mt-6 flex flex-col mx-auto justify-center text-center">
			<p>You don't have an account?</p>
			<a class="underline" href="/request/invite" use:link>
				Request an account
			</a>.
		</div>
	</div>
</div>