import config from '../helpers/config';
const axios = config.myAxios;


export default {
    async getStallionLabelStatusByOrderId(order_id) {
        return await axios.get(`/shipments/status/${order_id}`).then(res => {
            return res;
        }).catch(err => {
            return err
        })
    }
}