<script>
    // import {onMount} from 'svelte';
    // import { Circle } from 'svelte-loading-spinners';
    import { blur } from 'svelte/transition';
    import ImageModal from '../../../components/ImageModal.svelte';

    export let transaction;

    let isFullImageOpen = false;

    const handleImageClick = () => {
        isFullImageOpen = !isFullImageOpen;
    }
    // onMount(() => {
    //
    // });

</script>

<ImageModal imageSrc={transaction?.MainImage?.url_fullxfull} caption={transaction?.title} bind:isOpen={isFullImageOpen} />
<div class="flex w-full font-mono mt-3 shadow-md rounded-md border border-gray-200 " >
    <div class=" w-1/3 p-1">
        <div>
            <img on:click={handleImageClick} in:blur class="w-48 h-48 object-left mx-auto" src={transaction?.MainImage?.url_170x135} alt="{transaction?.transaction_id}'s listing image"/>

        </div>
    </div>

    <div class="w-2/3 ml-2 p-2">
        <div class="grid grid-rows gap-2">
            {#each transaction?.variations as variation (variation?.property_id)}
                <div class="border border-gray-400 rounded-lg p-1 min-w-max">
                    {variation?.formatted_name}
                    <br>
                    <p class="font-semibold">{variation?.formatted_value}</p>
                </div>
            {/each}
            <div class="border border-gray-400 rounded-lg p-1">
                Quantity
                <br>
                <p class="font-semibold">{transaction?.quantity}</p>
            </div>
        </div>
    </div>
</div>