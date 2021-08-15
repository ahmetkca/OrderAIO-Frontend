import { oauth2_user, isAuthenticated } from '../stores/user.store';
import { push } from 'svelte-spa-router';
import {toasts} from "../stores/toast.store";
import Success from '../components/Success.svelte';
// import { toast } from '@zerodevx/svelte-toast';
import axios from 'axios';
import Danger from "../components/Danger.svelte";
export const BACKEND_URI = import.meta.env.DEV ? 'https://localhost:8000': 'https://api.orderaio.com';
const myAxios = axios.create({
    baseURL: BACKEND_URI,
    // timeout: 2000,
    withCredentials: true,
    // headers: {
    //     "content-type": "application/json",
    // },
});
myAxios.interceptors.response.use(function (response) {
    return response;
}, async function (error) {
    // console.trace(error);
    if ((401 === error.response.status && "Unauthorized" === error.response.statusText) ||
        (403 === error.response.status && "Forbidden" === error.response.statusText &&
            "Not authenticated" === error.response.data.detail)) {
        oauth2_user.set({});
        isAuthenticated.set(false);
        const errorMessage = error.response.data.detail;

        // await push(`/login?error=${errorMessage}`);
        toasts.push(Danger, 3500, {message: errorMessage});
        // toast.push('Your session has expired', {
        //     theme: {
        //         '--toastBackground': '#F89406',
        //         '--toastProgressBackground': '#7C4A02'
        //     }
        // });
        // console.log(error);
        // console.error("401 ERROR your session is probably expired. OR Not Authorized.");
    } else {
        // console.trace(error);
        return Promise.reject(error);
    }
});


const config = {
    // BACKEND_URI: "https://backend.loca.lt",
    BACKEND_URI: BACKEND_URI,
    AUTH0_DOMAIN: 'dev-5lmhs6gx.us.auth0.com',
    AUTH0_CLIENTID: 'y3DcgeQxYVeWO6uTs2ldq6TswB5XP3u6',
    myAxios: myAxios
}

export default config;