import { writable } from 'svelte/store';

export const isAuthenticated = writable(false);
export const user = writable({});
export const bearerToken = writable('');

export const oauth2_user = writable({});