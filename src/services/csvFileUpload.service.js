import config from '../helpers/config';
const axios = config.myAxios;


export default {
    async uploadStallionCsvFile(formData) {
        console.log(formData)
        return await axios.post(`/uploadstallioncsvfile`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        })
            .then(res => {
                return res;
            }).catch(err => {
                return err
            })
    },
}