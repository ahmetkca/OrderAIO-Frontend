import Home from './Home/Index.svelte';
import ConnectEtsyShop from './ConnectEtsyStores/Index.svelte';
import VerifyEtsyShop from './ConnectEtsyStores/Verify.svelte';
import DisplayEtsySales from './DisplayEtsySales/Index.svelte';
import Connections from './Connections/Index.svelte';
import Login from './Authentication/Login.svelte';
import Register from './Authentication/Register.svelte';
import Invite from './Authentication/Invite.svelte';

export const publicRoutes = {
    '/login': Login,
    '/register': Register,
    '/verify/etsy': VerifyEtsyShop
}

export const routes = {
    '/': Home,
    '/invite': Invite,
    '/connections': Connections,
    '/connect/etsy': ConnectEtsyShop,
    '/verify/etsy': VerifyEtsyShop,
    '/display/sales': DisplayEtsySales
}