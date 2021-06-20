<script>
	import {onMount} from 'svelte';
	import {querystring} from 'svelte-spa-router';
	import {link, push} from 'svelte-spa-router';
	import authService from '../../services/auth.service';

	var searchParams = new URLSearchParams($querystring);
	let email;
	let username;
	let password;
	let verification_code;

	onMount(async () => {
		if (searchParams.has('email')) {
			email = searchParams.get('email');
		}
		if (searchParams.has('verification_code')) {
			verification_code = searchParams.get('verification_code');
		}
	})

	const register = async () => {
		if (email.length === 0 || username.length === 0 || password.length === 0 || verification_code.length === 0) {
			return;
		}
		await authService.register(email, username, password, verification_code)
			.then(res =>{ 
				console.log(res)
				// push('/login')
			})
	}
</script>

<div class="bg-gray-50 min-h-screen flex flex-col">
	<div class="container max-w-sm mx-auto flex-1 flex flex-col items-baseline justify-center px-2 mb-56">
		<div class="bg-white px-6 py-8 rounded shadow-md text-black w-full">
			<h1 class="mb-8 text-3xl text-center">Sign up</h1>
			<input
				bind:value={username}
				type="text"
				class="block border border-gray-300 w-full p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
				name="fullname"
				placeholder="Username" />

			<input 
				bind:value={email}
				type="text"
				class="block border border-gray-300 w-full p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
				name="email"
				placeholder="Email" />

			<input 
				bind:value={password}
				type="password"
				class="block border border-gray-300 w-full p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
				name="password"
				placeholder="Password" />
			
			<input
				bind:value={verification_code}
				type="text"
				class="block border border-gray-300 w-full p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
				name="verification code"
				placeholder="Verification code" />
			<!-- <input 
				type="password"
				class="block border border-grey-light w-full p-3 rounded mb-4"
				name="confirm_password"
				placeholder="Confirm Password" /> -->

			<button
				on:click|preventDefault={register}
				type="submit"
				class="w-full text-center py-3 rounded bg-green-600 text-white hover:bg-green-800 focus:outline-none my-1"
			>Create Account</button>

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
			<p>Already have an account?</p>
			<a class="underline" href="/login" use:link>
				Log in
			</a>.
		</div>
	</div>
</div>