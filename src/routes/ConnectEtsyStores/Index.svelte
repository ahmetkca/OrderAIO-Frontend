<script>
    import etsyConnectionsService from '../../services/etsyConnections.service';

    let hiddenLink;
    let useDefaultApp = false;
    let appKey = '';
    let appSecret = '';
    let appKeyError = false;
    let appSecretError = false;
    let isHidden = true;

    const getRequestToken = async (app_key = null, app_secret = null) => {
        await etsyConnectionsService.getRequestToken(app_key, app_secret)
            .then(res => {
                sessionStorage.setItem("currentEtsyConnectionId", res.data.etsy_connection_documentid);
                hiddenLink.href = res.data.login_url;
                // isHidden = false;
                hiddenLink.click();
            })
    }

    const handleSubmit = async () => {
        if (!useDefaultApp) {
            if (appKey.length === 0) {
                appKeyError = true;
            }
            if (appSecret.length === 0) {
                appSecretError = true;
            }
            if (appKeyError || appSecretError) {
                return null;
            }
            console.log(appKey);
            console.log(appSecret);
            appKey = appKey.trim();
            appSecret = appSecret.trim();
            await getRequestToken(appKey, appSecret);
        } else {
            await getRequestToken(null, null);
        }
    }
</script>

<div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
    <form class="mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" on:submit|preventDefault={handleSubmit}>
        <p class="font-bold text-xl text-gray-700 mb-4">Connect to Etsy</p>
        <hr>
        <div class="flex mt-4 mb-4">
            <label class="flex items-center">
                <input type="checkbox" class="form-checkbox" bind:checked={useDefaultApp}>
                <span class="text-gray-700 text-sm font-bold ml-2">Use default app</span>
            </label>
        </div>
        <hr>
        <div class="mb-4 mt-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="app_key">
                Keystring
            </label>
            <input bind:value={appKey} on:focusin={() => { appKeyError = false; }} disabled={useDefaultApp}
                   class={
                        appKeyError ?
                            "shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            : "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"} id="app_key" type="text" placeholder="enter your app's keystring here">
            {#if appKeyError}
                <p class="text-red-500 text-xs italic">Please enter your app's Keystring.</p>
            {/if}
        </div>
        <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="app_secret">
                Shared secret
            </label>
            <input bind:value={appSecret} on:focusin={() => { appSecretError = false; }} disabled={useDefaultApp}
                   class={
                        appSecretError ?
                            "shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            : "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"} id="app_secret" type="text" placeholder="enter your app's shared secret">
            {#if appSecretError}
                <p class="text-red-500 text-xs italic">Please enter your app's Shared secret.</p>
            {/if}
        </div>
        <div class="flex items-center justify-between">
            <button class="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                Connect to Etsy
            </button>
        </div>
    </form>
<!--    <form >-->
<!--        <h2>Etsy App Settings</h2>-->
<!--        <label>-->
<!--            <input type=checkbox bind:checked={useDefaultApp}>-->
<!--            Use default app-->
<!--        </label>-->
<!--        <label>App Key: </label>-->
<!--        <input type="text" bind:value={appKey} disabled={useDefaultApp}/>-->
<!--        <label>App Secret: </label>-->
<!--        <input type="text" bind:value={appSecret} disabled={useDefaultApp}/>-->
<!--    </form>-->
<!--    <button on:click={getRequestToken} class="mx-auto text-yellow-600 inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">-->
<!--        Connect to Etsy-->
<!--    </button>-->
    <a bind:this={hiddenLink} hidden="{isHidden}">Etsy connection url</a>
</div>