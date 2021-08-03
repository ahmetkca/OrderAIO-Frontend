import config from '../helpers/config';
const axios = config.myAxios;


export default {
    async getLabelPdfByReceiptId(receipt_id) {
        return await axios.get(`/receipt/label/${receipt_id}`, {
            headers: { "accept": "application/pdf" }
        })
            .then(res => {
                return res;
            }).catch(err => {
                return err
            })
    },
}