export const formats = {
    default: "YYYY-MM-DD",
    veryShurt: "MMMM, YYYY",
    fullDay: "dddd",
    shurtDay: "ddd"
};
export const dateTypes = {
    day: "day",
    addDay: "d",
    addWeek: "w"
};

export const removeTime = (date) => date.day(0).hour(0).minute(0).second(0).millisecond(0);

export const isToday = (date) => date.isSame(new Date(), dateTypes.day);