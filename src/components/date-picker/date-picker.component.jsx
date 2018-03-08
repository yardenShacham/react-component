import React from "react";
import {dateService} from '../../services/dateService';
import {CalendarMonth} from './calendar-month';
import {formats} from '../../utils/dateUtils';

export class DatePicker extends React.Component {

    constructor(props) {
        super(props);
        this.dateService = new dateService();
    }

    getProps() {
        const {isFullDayFormat, titleDateFormat} = this.props;
        return {
            isFullDayFormat: isFullDayFormat || formats.fullDay,
            titleDateFormat: titleDateFormat || formats.veryShurt
        };
    }

    render() {
        const {isFullDayFormat, titleDateFormat} = this.getProps();
        const now = this.dateService.getCurrentDate();
        const daysOfWeek = this.dateService.getDaysOfWeek(isFullDayFormat)
        const {currentDate, calendar} = this.dateService.getCalendar(now);
        return (
            <div className="date-picker">
                <CalendarMonth weeks={calendar}
                               daysOfWeek={daysOfWeek}
                               currentDate={currentDate.format(titleDateFormat)}/>
            </div>);
    }
}