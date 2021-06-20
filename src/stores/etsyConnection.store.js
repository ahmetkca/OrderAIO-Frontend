import { writable } from 'svelte/store';
import etsyConnectionsService from '../services/etsyConnections.service';

export const currentEtsyConnectionId = writable(null);
export const etsyConnections = writable([]);

const createEtsyConnectionsStore = async () => {

}

const createReceiptsStore = async () => {

}