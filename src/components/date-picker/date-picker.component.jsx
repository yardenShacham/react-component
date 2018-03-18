import React from "react";
import {dateService} from '../../services/dateService';
import {CalendarMonth} from './calendar-month';
import {dateTypes, formats} from '../../utils/dateUtils';
import {generateArray} from '../../utils/arrayUtils';
import {addClass, setProperty, changeClass} from '../../utils/domUtils';

const CalendarPin = () => (
    <div className="pins">
        {generateArray(10, i =>
            <div key={i} className="pin">
                <div></div>
                <div></div>
            </div>)
        }
    </div>
);

export class DatePicker extends React.Component {

    constructor(props) {
        super(props);
        this.dateService = new dateService();
        this.nextMonth = this.nextMonth.bind(this);
        this.previousMonth = this.previousMonth.bind(this);
        this.state = {
            calendars: []
        };
        this.currentMonth = 0;
        this.currentYear = this.dateService.getCurrentDate().year();
    }

    getProps() {
        const {isFullDayFormat, titleDateFormat} = this.props;
        return {
            isFullDayFormat: isFullDayFormat === undefined || isFullDayFormat === null ? true : false,
            titleDateFormat: titleDateFormat || formats.veryShurt
        };
    }

    getDegreeSpace = () => 4 + (this.currentMonth <= 4 ? this.currentMonth / 2 : this.currentMonth / 6);

    nextMonth() {
        if (this.currentMonth + 1 <= 11) {
            setProperty(this.generateCurrentId(), "lastDegree", () => `${this.getDegreeSpace()}deg`);
            changeClass(this.generateCurrentId(), "fliped-back", "fliped-front");
            this.currentMonth++;
        }
        else {
            setProperty(this.generateCurrentId(), "lastDegree", () => `${this.getDegreeSpace()}deg`);
            changeClass(this.generateCurrentId(), "fliped-back", "fliped-front");
            this.currentYear++;
            this.currentMonth = 0;
            const nextCalendars = this.dateService.getFullYear(this.currentYear);
            const merged = this.state.calendars.concat(nextCalendars.reverse());
            this.setState({
                calendars: merged
            });

        }
    }

    generateCurrentId = () => `${this.currentMonth}-${this.currentYear}`;

    previousMonth() {
        if (this.currentMonth - 1 >= 0) {
            this.currentMonth--;
            changeClass(this.generateCurrentId(), "fliped-front", "fliped-back");
        }
        else {
            this.currentYear--;
            const nextCalendars = this.dateService.getFullYear(this.currentYear);
            const merged = nextCalendars.concat(this.state.calendars);
            this.setState({
                calendars: merged
            });
            this.currentMonth = 11;
            changeClass(this.currentMonth, "fliped-front", "fliped-back");
        }
    }

    componentWillMount() {
        const {isFullDayFormat} = this.getProps();
        this.daysOfWeekOptions = this.dateService.getDaysOfWeek(isFullDayFormat)
        this.setState({
            calendars: this.dateService.getFullYear(this.currentYear).reverse()
        });
    }

    componentDidMount() {
        const now = this.dateService.getCurrentDate();
        this.navigateTo(11, 2019);
    }

    navigateTo(month, year) {
        var i;
        while (!(this.currentYear === year && this.currentMonth === month)) {
            this.currentMonth < month ? this.nextMonth() : this.previousMonth();
            setTimeout(() => i++, (i + 1) * this.getFlipSpeed(month));
        }
    }

    getFlipSpeed = (flipCount) => flipCount <= 2 ? 300 : flipCount <= 5 ? 200 : 20;

    render() {
        const {titleDateFormat} = this.getProps();

        const {calendars} = this.state;

        return (
            <div className="date-picker">
                <div className="stand front"></div>
                {
                    calendars.map((c, i) =>
                        <CalendarMonth weeks={c.weeks}
                                       key={i}
                                       id={`${c.currentMonth.month()}-${c.currentMonth.year()}`}
                                       daysOfWeek={this.daysOfWeekOptions}
                                       nextMonth={this.nextMonth}
                                       previousMonth={this.previousMonth}
                                       currentMonth={c.currentMonth.format(titleDateFormat)}/>)
                }

                <div className="stand back"></div>
                <CalendarPin/>
            </div>);
    }
}