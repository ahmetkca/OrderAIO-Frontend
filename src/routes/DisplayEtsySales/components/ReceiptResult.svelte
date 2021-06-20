<script>
	export let group;
	export let value;
	export let receiptId;
	export let buyerName;
	export let sellerShopIcon;
	export let sellerShopName;

	let cssStyle = `background-image: url('${sellerShopIcon}')`

	let isSelected = false;

	$: if (group === value) {
		isSelected = true;
		console.log(`${receiptId} has been selected`)
	} else {
		isSelected = false;
	}
</script>

<label for={receiptId}
	class={isSelected ? 'flex flex-wrap max-w-md mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 mb-2 ring ring-offset-purple-600' : 'flex flex-wrap max-w-md mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 mb-2'}>
<!-- <div class="flex flex-wrap max-w-md mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 mb-2"> -->
	<input id={receiptId} type=radio bind:group value={value} name="receipt-group" hidden/>
	<div class="w-1/3 bg-cover" style={cssStyle}></div>

	<div class="w-2/3 p-4 md:p-4">
		<h1 class="text-xl font-semibold text-gray-800 dark:text-white">{receiptId}</h1>

		<p class="mt-2 text-base text-gray-600 dark:text-gray-400">{buyerName}</p>

		<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">{sellerShopName}</p>

<!--		<div class="flex mt-2 item-center">-->

<!--		</div>-->

<!--		<div class="flex justify-between mt-3 item-center">-->
<!--			<h1 class="text-lg font-bold text-gray-700 dark:text-gray-200 md:text-xl">$220</h1>-->
<!--			<button class="px-2 py-1 text-xs font-bold text-white uppercase transition-colors duration-200 transform bg-gray-800 rounded dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:bg-gray-700 dark:focus:bg-gray-600">Add to Cart</button>-->
<!--		</div>-->
	</div>
<!-- </div> -->
</label>

<!--<div class="grid grid-rows-3 grid-flow-col gap-1 border border-gray-400 rounded-md shadow-sm p-2 mb-1 bg-gray-50">-->
<!--	<img class="row-span-3 w-16 h-16 rounded-full" src={sellerShopIcon} alt="{sellerShopName}'s Etsy shop icon" />-->
<!--	<div class="col-span-2 ">-->
<!--		{receiptId}-->
<!--	</div>-->
<!--	<div class="row-span-2 col-span-2">-->
<!--		{buyerName}-->
<!--	</div>-->
<!--</div>-->