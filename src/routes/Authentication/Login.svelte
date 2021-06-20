<script>
	import oauth2Service from '../../services/oauth2.service';
	import {oauth2_user} from '../../stores/user.store';

	import {link, push} from 'svelte-spa-router';
	import authService from '../../services/auth.service';
	import { isAuthenticated, user, bearerToken } from '../../stores/user.store';
	import { Jumper, Circle } from 'svelte-loading-spinners'
	import { toast } from '@zerodevx/svelte-toast';
	import config from '../../helpers/config';
	import axios from 'axios';

	let username;
	let password;
	let isSubmitting = false;

	const login = async () => {
		if (username.length === 0 || password.length === 0) {
			return;
		}
		isSubmitting = true;
		await oauth2Service.authenticate(username, password)
			.then(async res => {
				await oauth2Service.authMe()
					.then(res => {
						console.log(res);
						oauth2_user.set(res.data.user)
						isAuthenticated.set(true);
						toast.push('Success!', {
							theme: {
								'--toastBackground': '#48BB78',
								'--toastProgressBackground': '#2F855A'
							}
						})
					})
					push('/connections')
				
			})
			.catch(err => {
				console.log(err);
				isSubmitting = false;
				toast.push('Danger!', {
					theme: {
						'--toastBackground': '#F56565',
						'--toastProgressBackground': '#C53030'
					}
				})
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