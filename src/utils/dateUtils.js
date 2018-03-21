import moment from 'moment';
import {isEqual} from "./objectUtils";

export const formats = {
    default: "YYYY-MM-DD",
    veryShurt: "MMMM, YYYY",
    fullDay: "dddd",
    shurtDay: "ddd",
    superShurtDay: "dd",
    shurtMonth: "MMMM",
    superShurtMonth: "MM",
    shurtYear: "YYYY"
};
export const dateTypes = {
    day: "day",
    addDay: "d",
    addWeek: "w",
    addMonth: 'm',
    diffMonth: "months"
};
const getDate = ({month, year}) => moment(`${month + 1}-01-${year}`);

export const getDiff = (date1, date2, diffType) => getDate(date1).diff(getDate(date2), diffType);

export const isBefore = (date1, date2) => getDate(date1).isSameOrBefore(getDate(date2));

export const removeTime = (date) => date.day(0).hour(0).minute(0).second(0).millisecond(0);

export const isDateEqual = (date1, date2) => date1.format(formats.default) === date2.format(formats.default);

export const isToday = (date) => date.isSame(new Date(), dateTypes.day);