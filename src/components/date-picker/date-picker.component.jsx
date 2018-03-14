import React from "react";
import {dateService} from '../../services/dateService';
import {CalendarMonth} from './calendar-month';
import {dateTypes, formats} from '../../utils/dateUtils';

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
);

export class DatePicker extends React.Component {

    constructor(props) {
        super(props);
        this.dateService = new dateService();
        this.nextMonth = this.nextMonth.bind(this);
        this.previousMonth = this.previousMonth.bind(this);
        this.state = {
            weeks: [],
            currentDate: null
        }
    }

    getProps() {
        const {isFullDayFormat, titleDateFormat} = this.props;
        return {
            isFullDayFormat: isFullDayFormat === undefined || isFullDayFormat === null ? true : false,
            titleDateFormat: titleDateFormat || formats.veryShurt
        };
    }

    nextMonth() {
        const {currentDate} = this.state;
        const nextMonth = currentDate.month(currentDate.month() + 1).clone();
        const weeks = this.dateService.getCalendar(nextMonth);
        this.setState({
            weeks,
            currentDate: nextMonth
        });
    }

    previousMonth() {
        const {currentDate} = this.state;
        const previousMonth = currentDate.month(currentDate.month() - 1).clone();
        const weeks = this.dateService.getCalendar(previousMonth);
        this.setState({
            weeks,
            currentDate: previousMonth
        });
    }

    componentWillMount() {
        const {isFullDayFormat} = this.getProps();
        this.daysOfWeekOptions = this.dateService.getDaysOfWeek(isFullDayFormat)
        const now = this.dateService.getCurrentDate();
        const weeks = this.dateService.getCalendar(now);
        this.setState({
            weeks,
            currentDate: now
        });
    }

    render() {
        const {titleDateFormat} = this.getProps();

        const {weeks, currentDate} = this.state;

        return (
            <div className="date-picker">
                <CalendarMonth weeks={weeks}
                               daysOfWeek={this.daysOfWeekOptions}
                               nextMonth={this.nextMonth}
                               previousMonth={this.previousMonth}
                               currentDate={currentDate.format(titleDateFormat)}/>
                <CalendarPages/>
            </div>);
    }
}