<script>
    import { link, push } from 'svelte-spa-router';
    import oauth2Service from '../services/oauth2.service'
    import { onMount } from 'svelte';
    import { isAuthenticated, oauth2_user } from "../stores/user.store";
    import {toasts} from "../stores/toast.store";
    import Success from "./Success.svelte";
    import active from 'svelte-spa-router/active'

    // let auth0Client;

    onMount(async () => {
        // auth0Client = await authService.createClient();
        // isAuthenticated.set(await auth0Client.isAuthenticated());
        // user.set(await auth0Client.getUser());
        // const getIdTokenClaims = await auth0Client.getIdTokenClaims();
        // idTokenClaims.set(getIdTokenClaims);
    })

    const login = async () => {
        // await authService.loginWithPopup(await auth0Client);
        await push('/login')
    }

    const logout = async () => {
        // await authService.logout(await auth0Client);
        await oauth2Service.logout()
            .then(res => {
                if (res.data.status === "logged_out") {
                    toasts.push(Success, 3500, {message: "Successfully logged out."})
                    isAuthenticated.set(false);
                    oauth2_user.set({});
                }
                console.log(res);
                push('/login')
            });
    }
</script>

<header class="text-gray-600 body-font">
    <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0" href="/" use:link>
<!--            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">-->
<!--                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>-->
<!--            </svg>-->
            <i class="fas fa-shipping-fast" style="font-size: 3rem; color: #4addff"></i>
            <span class="ml-3 text-xl">OrderAIO</span>
            {#if $isAuthenticated}
                <span class="border-l-2 pl-2 border-black ml-3 text-xl font-semibold text-lg">{$oauth2_user?.user}</span>
            {/if}
        </a>
        {#if $isAuthenticated}
            <nav class="md:ml-auto flex flex-wrap items-center text-base justify-center">
                <a class="mr-5 hover:text-gray-900" href="/" use:link use:active={{path: '/', className: 'bg-blue-200 border-0 py-1 px-3 focus:outline-none rounded font-semibold'}}>Home</a>
                {#if $oauth2_user?.scopes.includes('admin') }
                    <a class="mr-5 hover:text-gray-900" href="/invite" use:link use:active={{path: '/invite', className: 'bg-blue-200 border-0 py-1 px-3 focus:outline-none rounded font-semibold'}}>Invite</a>
                {/if}
                <a class="mr-5 hover:text-gray-900" href="/connections" use:link use:active={{path: '/connections', className: 'bg-blue-200 border-0 py-1 px-3 focus:outline-none rounded font-semibold'}}>Connections</a>
                <a class="mr-5 hover:text-gray-900" href="/connect/etsy" use:link use:active={{path: '/connect/etsy', className: 'bg-blue-200 border-0 py-1 px-3 focus:outline-none rounded font-semibold'}}>Connect Etsy</a>
                {#if $oauth2_user?.scopes.includes('admin') }
                    <a class="mr-5 hover:text-gray-900" href="/display/sales" use:link use:active={{path: '/display/sales', className: 'bg-blue-200 border-0 py-1 px-3 focus:outline-none rounded font-semibold'}}>Display Sales</a>
                {/if}
                <a class="mr-5 hover:text-gray-900" href="/orders" use:link use:active={{path: '/orders', className: 'bg-blue-200 border-0 py-1 px-3 focus:outline-none rounded font-semibold'}}>Orders</a>
                <a class="mr-5 hover:text-gray-900" href="/assignments" use:link use:active={{path: '/assignments', className: 'bg-blue-200 border-0 py-1 px-3 focus:outline-none rounded font-semibold'}}>Assignments</a>
            </nav>
            <button on:click={logout} class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Logout
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-1" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
            </button>
        {:else}
            <button on:click={login} class="ml-auto inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Login
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-1" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
            </button>
        {/if}


    </div>
</header>