import config from '../helpers/config';
const axios = config.myAxios;


export default {
    async createNote({receipt_id, note = null, status, assigned_to = null}) {
        let receiptNote = Object.assign({},
            {receipt_id},
            note === null ? null : {note},
            {status},
            assigned_to === null ? null : {assigned_to},

        );
        // console.trace(receiptNote);
        return await axios.post(`/user/note`, receiptNote).then(res => {
            return res;
        }).catch(err => {
            return err
        })
    },

    async updateNote({receipt_id, note=  null, status = null, assigned_to = null}) {
        let updateReceiptNote = Object.assign({},
            note === null ? null : {note},
            status === null ? null : {status},
            assigned_to === null ? null : {assigned_to},

        );
        return await axios.put(`/user/note/${receipt_id}`, updateReceiptNote).then(res => {
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

    async getMultipleNotes(receipt_ids) {
        return await axios.post('/user/multiple_notes', {
            receipt_ids: receipt_ids
        })
            .then(res => {
                return res;
            }).catch(err => {
                return err
            })
    }
}