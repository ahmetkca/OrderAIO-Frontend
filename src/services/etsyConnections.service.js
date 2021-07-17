import config from '../helpers/config';
import * as dayjs from "dayjs";
// import axios from 'axios';

const axios = config.myAxios;

export default {
	/**
	 * @param {String} app_key
	 * @param {String} app_secret
	 */
	async getRequestToken(app_key, app_secret) {
		console.log(`${app_key}, ${app_secret}`);
		return await axios.post(`/connect/etsy`, {
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
		return await axios.get(`/images/${listing_id}/${listing_image_id}/${etsyConnectionId}`,{
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

	/**
	 * @param {String} etsyConnectionId
	 * @param min_created
	 * @param max_created
	 */
	async getAllReceipts(etsyConnectionId,
						 min_created = dayjs().subtract(1, "week").unix(),
						 max_created = dayjs().add(1, "days").unix()) {
		return await axios.get(`/receipts/${etsyConnectionId}`,{
			params: {
				min_created: min_created,
				max_created: max_created
			},
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
		return await axios.get(`/transactions/${receiptId}/${etsyConnectionId}`)
		.then(res => {
			return res;
		}).catch(err => {
			return err
		})
	},

	async get_all_etsy_connections() {
		return await axios.get(`/connections/etsy`)
			.then(res => {
				return res;
			}).catch(err => {
				return err
			})
	},

	async searchTest(etsy_connection_id) {
		return await axios.get(`/search/${etsy_connection_id}`)
		.then(res => {
			return res;
		}).catch(err => {
			return err
		})
	},

	/**
	 * @param {String} id
	 */
	async getEtsyConnection(id) {
		return await axios.get(`/connection/etsy/${id}`)
		.then(res => {
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
		return await axios.put(`/verify/etsy`, {
			oauth_verifier: oauth_verifier,
			temp_oauth_token: oauth_token,
			etsy_connection_id: id
		}).then(res => {
			return res;
		}).catch(err => {
			return err
		})

	}
}