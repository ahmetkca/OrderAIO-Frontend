<script>
    export let id;
    export let comp;
    export let duration;
    export let props;

    import { onMount, onDestroy } from "svelte";
    import {toasts} from "../stores/toast.store";

    let timeout;
    let isPopped = false;

    const pop = () => {
        if (timeout !== undefined) {
            clearTimeout(timeout);
        }
        if (!isPopped) toasts.pop(id);
        isPopped = true;
    }

    onMount(() => {
        timeout = setTimeout(() => {
            pop();
        }, duration);
    });

    onDestroy(() => {
        pop();
    });

    const handleDismiss = () => {
        pop();
    }
</script>


<svelte:component this={comp} {...props} on:dismiss={handleDismiss}/>


