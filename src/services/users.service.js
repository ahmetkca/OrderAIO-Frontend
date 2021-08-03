import config from '../helpers/config';
const axios = config.myAxios;


export default {
    async getAllUsers() {
        return await axios.get(`/users`)
            .then(res => {
                return res;
            }).catch(err => {
                return err
            })
    },
}