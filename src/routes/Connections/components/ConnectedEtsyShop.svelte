<script>

	export let shopName;
	export let etsyConnectionId;
	export let shopPicUrl;
	export let shopUrl;

	import {onMount} from 'svelte';

	// let cssStyle = `background-image: url('${shopPicUrl}')`;
	onMount(() => {
		console.log(etsyConnectionId)
	})
</script>

<div class="rounded overflow-hidden shadow-lg">
	<img class="mx-auto h-48 w-48" src={shopPicUrl} alt="Shop icon of {shopName}">
	<div class="px-6 py-4">
		<div class="font-bold text-xl mb-2">
			<a class="text-xl text-gray-600 font-bold title-font mb-2 underline italic" href={shopUrl} target="_blank">
				{shopName}
			</a>
		</div>
		<p class="text-gray-700 text-base">
			Number of orders
		</p>
		<p class="text-gray-700 text-base">
			Number of orders due today
		</p>
	</div>
	<div class="flex items-center justify-between px-6 pt-4 pb-2">
<!--		<span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#photography</span>-->
<!--		<span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#travel</span>-->
<!--		<span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#winter</span>-->
		<div class="flex flex-col items-start">
			<button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
				<!--			<svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>-->
				<i class="fas fa-sync"></i>
				<span class="text-base ml-2">Sync</span>
			</button>
		</div>
		<div class="flex flex-col items-end">
			<p>Last synced date </p>
		</div>
	</div>
</div>


<!--<div class="xl:w-1/2 md:w-1/3  p-2">-->
<!--	<div class="border border-gray-100  rounded-lg bg-gray-50 shadow-md">-->
<!--		<div class="flex flex-wrap items-center justify-between">-->
<!--&lt;!&ndash;			<a href={shopUrl}>&ndash;&gt;-->
<!--&lt;!&ndash;			<div class="w-1/3 bg-cover" style={cssStyle}></div>&ndash;&gt;-->
<!--&lt;!&ndash;			w-16 h-16 rounded-full&ndash;&gt;-->
<!--			<img  class="w-1/4 bg-cover p-0 " src={shopPicUrl} alt="Shop icon of {shopName}">-->
<!--&lt;!&ndash;			</a>&ndash;&gt;-->
<!--&lt;!&ndash;			<div class="text-sm">&ndash;&gt;-->
<!--&lt;!&ndash;				<p class="text-black leading-none">Jonathan Reinink</p>&ndash;&gt;-->
<!--&lt;!&ndash;				<p class="text-grey-dark">Aug 18</p>&ndash;&gt;-->
<!--&lt;!&ndash;			</div>&ndash;&gt;-->


<!--			<div class="">-->
<!--				<a class="text-xl text-gray-600 font-bold title-font mb-2 underline italic" href={shopUrl} target="_blank">-->
<!--					{shopName}-->
<!--				</a>-->
<!--			</div>-->
<!--			<div class="mr-4 bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">-->
<!--				<i class="fas fa-sync"></i>-->
<!--				Sync-->
<!--			</div>-->
<!--		</div>-->

<!--&lt;!&ndash;		<p class="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waist co, subway tile poke farm.</p>&ndash;&gt;-->
<!--	</div>-->
<!--</div>-->