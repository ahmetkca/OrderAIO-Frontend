<script>
    import {toasts} from "../stores/toast.store";
    import Toast from "./Toast.svelte";
    import {fly} from 'svelte/transition';

    $: console.log($toasts)
</script>

<div class={'top-0 right-0 fixed z-50 w-full md:max-w-sm p-4 md:p-4 max-h-screen overflow-hidden pointer-events-none'}>
    <div class="flex-1 flex-col w-full mr-8 justify-end pointer-events-none">
        {#each $toasts as toast (toast.id)}
            <div class="flex py-1 w-full pointer-events-auto"
                 in:fly="{{ x: 250, duration: 1000}}"
                 out:fly="{{ x: 250, duration: 1000}}"

            >
                <Toast {...toast} />
            </div>
        {/each}
    </div>
</div>