<script>
    import {onMount} from 'svelte';
    import oauth2Service from './services/oauth2.service';
    import {oauth2_user} from './stores/user.store';
    import Navbar from './components/Navbar.svelte';
    import Router, {push, location} from 'svelte-spa-router';
    import {publicRoutes, routes} from './routes/routes';
    import {isAuthenticated} from "./stores/user.store";
    // import {socket} from "./stores/socket.io.store";
    // import {
    //     etsyConnections,
    //     receiptsByShopNames,
    //     isFetchingEtsyConnections,
    //     isFetchingReceipts
    // } from "./stores/etsyConnection.store";
    import ToastContainer from "./components/ToastContainer.svelte";
    import {etsyConnections} from "./stores/etsyConnection.store";
    import {users} from './stores/users.store';
    import usersService from "./services/users.service";

    // $socket.on('connection', (data) => {
    //     console.log(data);
    // })

    onMount(async () => {

        console.log($location);
        await oauth2Service.authMe()
            .then(res => {
                // console.trace(Object.entries(res));
                console.trace(res);
                if (res?.response?.status === 403 || res?.response?.status === 401) {

                    push(`/login?error=${res?.response?.data?.detail}`);
                    return;
                }
                if (res?.data?.status === "ok" && res?.status === 200) {
                    console.log(`App.svelte > onMount > authMe successful > ${JSON.stringify(res?.data?.user)}`);
                    oauth2_user.set(res?.data?.user)
                    if ($oauth2_user?.user.length > 0 && $oauth2_user?.user_id.length > 0) {
                        isAuthenticated.set(true);
                    }
                }

            })
            .catch(err => {
                console.trace(Object.entries(err));
                push(`/login?error=${err}`)
            })
        if ($isAuthenticated) {
            await etsyConnections.reload();
            // await usersService.getAllUsers()
            //     .then(res => {
            //         console.trace(res.data)
            //         users.set(res.data);
            //         // return res.data
            //     })
            await users.reload()
            await push('/connections')
            // if (!$isFetchingEtsyConnections) {
            //     await etsyConnections.reload();
            // }
            // if (!$isFetchingReceipts) {
            //     await receiptsByShopNames.reload();
            // }
        }

    })

</script>


<ToastContainer />
<main class="min-h-screen max-h-screen font-mono">
    <Navbar />
    <Router routes={publicRoutes} />
    {#if $isAuthenticated}
        <Router {routes} />
    {/if}
</main>
