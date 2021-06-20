import config from '../helpers/config';
import axios from 'axios';


const qs = obj => {
	return Object.keys(obj)
		.map((key, index) => `${key}=${encodeURIComponent(obj[key])}`)
		.join('&');
}


export default {
	async authenticate(username, password) {
		return await axios.post(`${config.BACKEND_URI}/auth/token`, qs({
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
		return await axios.get(`${config.BACKEND_URI}/auth/test`, {
			withCredentials: true
		}).then(res => {
			return res;
		}).catch(err => {
			return err;
		})
	}
}