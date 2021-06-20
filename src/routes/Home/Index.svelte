<script>
    import { bearerToken, isAuthenticated, user} from '../../stores/user.store';
    import { onMount } from 'svelte';

    onMount(() => {
        console.log($bearerToken);
        console.log($user);
        console.log($isAuthenticated);
    })
</script>

<div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
    <h1>Home Page</h1>
    {bearerToken}
    {JSON.stringify(user)}
    {isAuthenticated}
</div>
