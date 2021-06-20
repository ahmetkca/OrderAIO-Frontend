import config from '../helpers/config';
import axios from 'axios';
import {bearerToken} from '../stores/user.store';
import {get} from 'svelte/store';

export default {
	/**
	 * @param {String} username
	 * @param {String} password
	 */
	async login(username, password) {
		return await axios.post(`${config.BACKEND_URI}/login`, {
			username: username,
			password: password,
		}, {
			headers: {
				"content-type": "application/json"
			}
		}).then(res => {
			return res;
		}).catch(err => {
			return err;
		})
	},

	/**
	 * @param {String} email
	 * @param {String} username
	 * @param {String} password
	 * @param {String} verification_code
	 */
	async register(email, username, password, verification_code) {
		return await axios.post(`${config.BACKEND_URI}/register` , {
			email: email,
			username: username,
			password: password,
			verification_code: verification_code
		}, {
			headers: {
				"content-type": "application/json"
			}
		}).then(res => {
			return res;
		}).catch(err => {
			return err;
		})
	},

	/**
	 * @param {String} token
	 */
	async authenticate() {
		return await axios.post(`${config.BACKEND_URI}/authenticate`, {}, {
			headers: {
				"Authorization": `Bearer ${get(bearerToken)}`
			}
		}).then(res => {
			return res;
		}).catch(err => {
			return err;
		})
	},
	
	/**
	 * @param {String} email
	 */
	async invite(email) {
		return await axios.post(`${config.BACKEND_URI}/invite`, {
			email: email
		}, {
			headers: {
				"Authorization": `Bearer ${get(bearerToken)}`
			}
		}).then(res => {
			return res;
		}).catch(err => {
			return err;
		})
	}
}