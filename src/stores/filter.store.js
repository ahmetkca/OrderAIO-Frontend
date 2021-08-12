import {writable} from "svelte/store";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
const today = new Date();
today.setHours(0, -today.getTimezoneOffset(), 0, 0);
export const todayIsoFormat = dayjs(today).toISOString();

export const filter = writable({
    from_date: todayIsoFormat,
    to_date: todayIsoFormat,
    receipt_status: undefined,
    shop_name: undefined,
})