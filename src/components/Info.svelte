<script>
    export let message;

    import {fade, fly} from "svelte/transition";
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    const dismiss = () => {
        dispatch("dismiss");
    }
</script>

<!--<div class="flex items-center bg-blue-400 border-l-4 border-blue-700 py-2 px-3 shadow-md mb-2" in:fade={{duration: 300}} out:fly={{x: -100, duration: 275, opacity: 0.5, delay: 100}}>-->
<!--    &lt;!&ndash; icons &ndash;&gt;-->
<!--    <div class="text-blue-500 rounded-full bg-white mr-3">-->
<!--        <svg width="1.8em" height="1.8em" viewBox="0 0 16 16" class="bi bi-info" fill="currentColor" xmlns="http://www.w3.org/2000/svg">-->
<!--            <path d="M8.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588z"/>-->
<!--            <circle cx="8" cy="4.5" r="1"/>-->
<!--        </svg>-->
<!--    </div>-->
<!--    &lt;!&ndash; message &ndash;&gt;-->
<!--    <div class="text-white max-w-xs ">-->
<!--        {message}-->
<!--    </div>-->
<!--    &lt;!&ndash; dismiss/close button &ndash;&gt;-->
<!--    <button on:click={dismiss} class="outline-none focus:outline-none ml-2 ">-->
<!--        <span style="color: rgba(29, 78, 216, 1)">-->
<!--            <i class="fas fa-times"></i>-->
<!--        </span>-->
<!--    </button>-->
<!--</div>-->


<div class={"flex w-full visible flex-row shadow-lg border-l-4 rounded-md duration-100 cursor-pointer transform transition-all hover:scale-105 bg-white border-blue-500 max-h-40"}>
    <div class="flex flex-row p-2 flex-no-wrap w-full">
        <div class={"flex items-center h-12 w-12 mx-auto text-xl select-none"}>
            <i class="fas fa-info-circle mx-auto text-blue-500"></i>
        </div>

        <div class="flex flex-col flex-no-wrap px-1 w-full">
            <div class="flex my-auto font-bold select-none">Info</div>
            <p class="-mt-0.5 my-auto break-all flex text-gray-600 text-sm">
                {message}
            </p>
        </div>

        <div class="w-10 h-12 mr-2 items-center mx-auto text-center leading-none text-lg">
            <i on:click={dismiss} class="fas fa-times mx-auto my-auto h-full text-center text-gray-600 cursor-pointer hover:scale-105 transform "></i>
        </div>
    </div>
</div>