import config from '../helpers/config';
const axios = config.myAxios;


export default {
    async checkSameAddressSameName(
        {
            receipt_id_to_exclude,
            name,
            first_line,
            second_line,
            city,
            state,
            zip
        }) {

        return await axios.get(`/check_same_name_same_address/`, {
            params: {
                receipt_id_to_exclude,
                name,
                first_line,
                second_line,
                city,
                state,
                zip
            }
        })
            .then(res => {
                return res;
            }).catch(err => {
                return err
            })
    }
}