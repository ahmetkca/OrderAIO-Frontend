<script>
	export let shopName;
	export let etsyConnectionId;
	export let shopPicUrl;
	export let shopUrl;

	import {onMount} from 'svelte';
	onMount(() => {
		console.log(etsyConnectionId)
	})
</script>

<div class="xl:w-1/3 md:w-1/2 p-4">
	<div class="border border-gray-200 p-6 rounded-lg bg-gray-100 shadow-md">
		<div class="flex items-center">
			<a href={shopUrl}>
				<img  class="w-16 h-16 rounded-full mr-4" src={shopPicUrl} alt="Shop icon of {shopName}">
			</a>
<!--			<div class="text-sm">-->
<!--				<p class="text-black leading-none">Jonathan Reinink</p>-->
<!--				<p class="text-grey-dark">Aug 18</p>-->
<!--			</div>-->
			<div>
				<a class="text-lg text-gray-600 font-bold title-font mb-2" href={shopUrl} target="_blank">
					{shopName}
				</a>
			</div>
		</div>

<!--		<p class="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waist co, subway tile poke farm.</p>-->
	</div>
</div>