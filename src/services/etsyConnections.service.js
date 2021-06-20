import config from '../helpers/config';
import axios from 'axios';
import {bearerToken} from '../stores/user.store';
import {get} from 'svelte/store';

export default {
	async getRequestToken(app_key, app_secret) {
		console.log(`${app_key}, ${app_secret}`);
		return await axios.post(`${config.BACKEND_URI}/connect/etsy`, {
			app_key: app_key,
			app_secret: app_secret
		}, {
			headers: {
				"content-type": "application/json",
				// "Authorization": `Bearer ${get(bearerToken)}`
			},
			withCredentials: true
		}).then(res => {
			return res;
		}).catch(err => {
			return err
		})
	},

	/**
	 * @param {String} listing_id
	 * @param {String} listing_image_id
	 * @param {String} etsyConnectionId
	 */
	async getImagesOfTransaction(listing_id, listing_image_id, etsyConnectionId) {
		return await axios.get(`${config.BACKEND_URI}/images/${listing_id}/${listing_image_id}/${etsyConnectionId}`,{
			headers: {
				"content-type": "application/json",
				// "Authorization": `Bearer ${get(bearerToken)}`
			}
		}).then(res => {
			return res;
		}).catch(err => {
			return err
		})
	},

	async getAllReceipts(etsyConnectionId) {
		return await axios.get(`${config.BACKEND_URI}/receipts/${etsyConnectionId}`,{
			headers: {
				"content-type": "application/json",
				// "Authorization": `Bearer ${get(bearerToken)}`,
			},
			withCredentials: true
		}).then(res => {
			return res;
		}).catch(err => {
			return err
		})
	},

	/**
	 * @param {String} receiptId
	 * @param {String} etsyConnectionId
	 */
	async getAllTransactionsByReceiptId(receiptId, etsyConnectionId,) {
		return await axios.get(`${config.BACKEND_URI}/transactions/${receiptId}/${etsyConnectionId}`, {
			headers: {
				"content-type": "application/json",
				// "Authorization": `Bearer ${get(bearerToken)}`
			},
			withCredentials: true
		}).then(res => {
			return res;
		}).catch(err => {
			return err
		})
	},

	async get_all_etsy_connections() {
		return await axios.get(`${config.BACKEND_URI}/connections/etsy`,{
			headers: {
				"content-type": "application/json",
				// "Authorization": `Bearer ${get(bearerToken)}`
			},
			withCredentials: true
		}).then(res => {
			return res;
		}).catch(err => {
			return err
		})
	},

	async getEtsyConnection(id) {
		return await axios.get(`${config.BACKEND_URI}/connection/etsy/${id}`, {
			headers: {
				"content-type": "application/json",
				// "Authorization": `Bearer ${get(bearerToken)}`
			},
			withCredentials: true
		}).then(res => {
			return res;
		}).catch(err => {
			return err
		})
	},

	/**
	 * @param {String} id
	 * @param {String} oauth_token
	 * @param {String} oauth_verifier
	 */
	async getAccessToken(id, oauth_token, oauth_verifier) {
		return await axios.put(`${config.BACKEND_URI}/verify/etsy`, {
			oauth_verifier: oauth_verifier,
			temp_oauth_token: oauth_token,
			etsy_connection_id: id
		}, {
			headers: {
				'content-type': 'application/json'
			},
			withCredentials: true
		}).then(res => {
			return res;
		}).catch(err => {
			return err
		})

	}
}