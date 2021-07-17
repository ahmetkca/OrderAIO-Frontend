<script>
    import {toasts} from "../stores/toast.store";
    import Toast from "./Toast.svelte";

    $: console.log($toasts)
</script>

<div class="absolute right-0 top-0 m-5">
    {#each $toasts as toast (toast.id)}
        <Toast {...toast} />
    {/each}
</div>