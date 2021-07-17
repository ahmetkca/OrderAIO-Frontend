import {writable} from "svelte/store";
import dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
const today = new Date();
today.setHours(0, -today.getTimezoneOffset(), 0, 0);
export const todayIsoFormat = dayjs(today).toISOString();

export const filter = writable({
    from_date: todayIsoFormat,
    to_date: todayIsoFormat,
    is_completed: false,
    shop_name: undefined,
})