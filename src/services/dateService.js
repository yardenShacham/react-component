import {removeTime, isToday, dateTypes, formats} from '../utils/dateUtils';
import {generateArray} from '../utils/arrayUtils';
import moment from 'moment';

export class dateService {

    getCalendar(startMonth) {
        let currentDate = removeTime(startMonth.clone().date(1));
        return this.buildMonth(currentDate, startMonth.clone());
    }

    buildMonth(startMonth, currentMonth) {
        let weeks = [];
        let done = false;
        let date = startMonth.clone();
        let monthIndex = date.month()
        let count = 0;
        while (!done) {
            weeks.push(this.buildWeek(date.clone(), currentMonth));
            date.add(1, "w");
            done = count++ > 2 && monthIndex !== date.month();
            monthIndex = date.month();
        }
        weeks[weeks.length - 1][0].isLastStartWeek = true;
        return weeks;
    }

    getDaysOfWeek(isFullDayFormat) {
        return generateArray(7, i => moment().day(i).format(isFullDayFormat ? formats.fullDay : formats.shurtDay));
    }

    buildWeek(startDate, currentMonth) {
        return generateArray(7, i => {
            if (i !== 0)
                startDate.add(1, dateTypes.addDay);

            return {
                number: startDate.date(),
                isSelected: false,
                isToday: isToday(startDate),
                isCurrentMonth: startDate.month() === currentMonth.month(),
                date: startDate.clone()
            };
        });
    }

    getCurrentDate() {
        return moment();
    }
}