<script context="module" lang="ts">
    // let onTop   //keeping track of which open modal is on top
    const modals={}  //all modals get registered here for easy future access

    // 	returns an object for the modal specified by `id`, which contains the API functions (`open` and `close` )
    export function getModal(id){
        return modals[id]
    }
</script>

<script>
    import {onDestroy} from 'svelte';
    export let isHidden = true;
    export let id;
    export let size = 'normal'
    export let closeCallback = undefined;

    export const close = async (callback = undefined) => {
        // console.trace(typeof callback)
        // console.trace(callback)
        if (callback) {
            // console.log('waiting for callback')
            await callback();
        }
        isHidden = true;
    }

    export const open = () => {
        isHidden = false;
    }

    // export const toggleModal = () => {
    //     isHidden = !isHidden;
    // }

    modals[id] = {open, close}

    onDestroy(() => {
        delete modals[id]
    })
</script>

<div class:hidden={isHidden} class="z-40 overflow-auto scrolling-touch left-0 top-0 bottom-0 right-0 w-full h-full fixed bg-opacity-50 bg-black">
    <div class={size === 'normal' ? "max-w-lg relative mx-auto z-50 px-3 py-12" : "max-w-6xl relative mx-auto z-50 px-3 py-12" } >
        <div class="overflow-visible relative  rounded bg-white shadow">
            <button on:click={() => close(closeCallback)} class="flex items-center justify-center rounded-full absolute right-0 top-0 -m-3 h-8 w-8 transition duration-100 ease-in-out focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 bg-gray-100 text-gray-600 hover:bg-gray-200">
                <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="fill-current h-4 w-4"><path clip-rule="evenodd" fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
            </button>
            <div class="border-b p-3 rounded-t border-gray-100 text-lg">
                <slot name="header"></slot>
            </div>
            <div class="p-3 p-3">
                <slot name="body"></slot>
            </div>
            <div class=" p-3 rounded-b bg-gray-100">
                <slot name="footer"></slot>
            </div>
        </div>
    </div>
</div>