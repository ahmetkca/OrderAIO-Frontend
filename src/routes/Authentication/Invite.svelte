<script>
	import authService from '../../services/auth.service';

	let email;

	const invite = async () => {
		if (email.length === 0) {
			return;
		}
		await authService.invite(email)
			.then(res => {
				console.log(res);
			})

	}
</script>

<div class="bg-gray-50 min-h-screen flex flex-col">
	<div class="container max-w-sm mx-auto flex-1 flex flex-col items-baseline justify-center px-2 mb-56">
		<div class="bg-white px-6 py-8 rounded shadow-md text-black w-full">
			<h1 class="mb-8 text-3xl text-center">Invite</h1>
			<input
				bind:value={email}
				type="text"
				class="block border border-gray-300 w-full p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
				name="email"
				placeholder="Username" />

			<button
				on:click|preventDefault={invite}
				type="submit"
				class="w-full text-center py-3 rounded bg-green-600 text-white hover:bg-green-800 focus:outline-none my-1"
			>Invite</button>
		</div>
	</div>
</div>