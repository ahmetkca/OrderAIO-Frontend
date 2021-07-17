import config from '../helpers/config';
import {get} from "svelte/store";
import {bearerToken} from "../stores/user.store";
const axios = config.myAxios;


const qs = obj => {
	return Object.keys(obj)
		.map((key, index) => `${key}=${encodeURIComponent(obj[key])}`)
		.join('&');
}


export default {
	async authenticate(username, password) {
		return await axios.post(`/auth/token`, qs({
			username: username,
			password: password
		}), {
			headers: { 
				"Content-Type": "application/x-www-form-urlencoded"
			},
			withCredentials: true
		}).then(res => {
			return res;
		}).catch(err => {
			return err;
		})
	},
	
	async authMe() {
		return await axios.get(`/auth/test`, {
			withCredentials: true
		}).then(res => {
			return res;
		}).catch(err => {
			return err;
		})
	},

	async logout() {
		return await axios.post(`/auth/logout`, {}, {
			withCredentials: true
		}).then(res => {
			return res;
		}).catch(err => {
			return err;
		})
	},

	async invite(email) {
		return await axios.post(`/invite`, {
			email: email
		}, {
			headers: {
				"content-type": "application/json"
			},
			withCredentials: true
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
		return await axios.post(`/register` , {
			email: email,
			username: username,
			password: password,
			verification_code: verification_code
		}, {
			headers: {
				"content-type": "application/json"
			},
			withCredentials: true
		}).then(res => {
			return res;
		}).catch(err => {
			return err;
		})
	},
}