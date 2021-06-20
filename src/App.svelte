<script>
    import { onMount } from 'svelte';
    import oauth2Service from './services/oauth2.service';
	import {oauth2_user} from './stores/user.store';
    import Navbar from './components/Navbar.svelte';
    import Router, { push } from 'svelte-spa-router';
    import { publicRoutes, routes } from './routes/routes';
    import { isAuthenticated } from "./stores/user.store";
    import { SvelteToast } from '@zerodevx/svelte-toast';

    onMount(async () => {
        await oauth2Service.authMe()
            .then(res => {
                oauth2_user.set(res.data.user)
                isAuthenticated.set(true);
                push('/connections')
            })
            .catch(err => {
                push('/login')
            })
    })

</script>

<SvelteToast/>
<main class="min-h-screen max-h-screen font-mono">
    <Navbar />
    <Router routes={publicRoutes} />
    {#if $isAuthenticated}
        <Router {routes} />
    {/if}
</main>
