import config from '../helpers/config';
const axios = config.myAxios;


export default {
    async getAllAssignedNotes() {
        return await axios.get(`/assignments`)
            .then(res => {
                return res;
            }).catch(err => {
                return err
            })
    }
}