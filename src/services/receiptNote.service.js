import config from '../helpers/config';
const axios = config.myAxios;


export default {
    async createNote(receiptId, note, status) {
        return await axios.post(`/user/note`, {
            receipt_id: receiptId,
            note: note,
            status: status
        }).then(res => {
            return res;
        }).catch(err => {
            return err
        })
    },

    async updateNote(receiptId, note=  null, status = null) {
        return await axios.put(`/user/note/${receiptId}`, {
            note: note,
            status: status
        }).then(res => {
            return res;
        }).catch(err => {
            return err
        })
    },

    async getNote(receiptId) {
        return await axios.get(`/user/note/${receiptId}`)
            .then(res => {
                return res;
            }).catch(err => {
                return err
            })
    },
}