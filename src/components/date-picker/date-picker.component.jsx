import React from "react";
import {dateService} from '../../services/dateService';
import {CalendarMonth} from './calendar-month';
import {formats} from '../../utils/dateUtils';

const CalendarPages = () => (
    <div className="calendar-pages">
        <div className="page"></div>
        <div className="page"></div>
        <div className="page"></div>
        <div className="page"></div>
        <div className="page"></div>
        <div className="page"></div>
        <div className="page"></div>
        <div className="page"></div>
        <div className="page"></div>
        <div className="page"></div>
        <div className="page"></div>
        <div className="page"></div>
    </div>
)

export class DatePicker extends React.Component {

    constructor(props) {
        super(props);
        this.dateService = new dateService();
    }

    getProps() {
        const {isFullDayFormat, titleDateMonthFormat, titleDateYearFormat} = this.props;
        return {
            isFullDayFormat: isFullDayFormat || formats.fullDay,
            titleDateMonthFormat: titleDateMonthFormat || formats.shurtMonth,
            titleDateYearFormat: titleDateYearFormat || formats.shurtYear
        };
    }

    render() {
        const {isFullDayFormat, titleDateMonthFormat, titleDateYearFormat} = this.getProps();
        const now = this.dateService.getCurrentDate();
        const daysOfWeek = this.dateService.getDaysOfWeek(isFullDayFormat)
        const {currentDate, calendar} = this.dateService.getCalendar(now);
        return (
            <div className="date-picker">
                <CalendarMonth weeks={calendar}
                               daysOfWeek={daysOfWeek}
                               currentDate={{
                                   month: currentDate.format(titleDateMonthFormat),
                                   year: currentDate.format(titleDateYearFormat)
                               }}/>
                <CalendarPages/>
            </div>);
    }
}