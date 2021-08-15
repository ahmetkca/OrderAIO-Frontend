import {io} from 'socket.io-client';
import {writable} from "svelte/store";
import {BACKEND_URI} from '../helpers/config';

export const socket = writable(io(BACKEND_URI))