import config from '../helpers/config';
import qs from 'qs';

const axios = config.myAxios;

export default {
    async search({query = undefined, from_date = undefined, to_date = undefined, receipt_status=undefined, shop_name= undefined, projection = undefined}) {
        let params = {};
        if (query !== undefined) {
            params.query = query;
        }
        if (from_date !== undefined) {
            params.from_date = from_date;
        }
        if (to_date !== undefined) {
            params.to_date = to_date;
        }
        if (receipt_status !== undefined) {
            params.receipt_status = receipt_status;
        }
        if (shop_name !== undefined) {
            params.shop_name = shop_name;
        }
        if (projection !== undefined) {
            params.projection = projection;
        }
        console.trace(params);
        return await axios.get("/search", {
            params: params,
            paramsSerializer: params => {
                return qs.stringify(params, { arrayFormat: "repeat" })
            }
        },).then(res => {
            return res;
        }).catch(err => {
            return err;
        })
    }
}