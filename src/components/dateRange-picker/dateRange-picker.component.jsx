import React from "react";
import {dateService} from '../../services/dateService';
import {dateTypes, formats, isBefore, getDiff} from '../../utils/dateUtils';
import {generateArray} from '../../utils/arrayUtils';
import {setProperty, changeClass} from '../../utils/domUtils';
import {CalendarFlicker} from '../calendar-flicker/calendar-flicker.component.jsx';
import {Input} from '../input';

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
const LabelConatiner = ({label, onChange}) =>
    <div className="input-label-container">
        <label>{label}</label>
        <Input type="text" onChange={onChange}/>
    </div>

export class DateRangePicker extends React.Component {

    constructor(props) {
        super(props);
        this.dateService = new dateService();
        this.nextMonth = this.nextMonth.bind(this);
        this.previousMonth = this.previousMonth.bind(this);
        this.state = {
            calendars: [],
            isCalendarOpen: false,
            selectedRange: null
        };
        this.init();
    }

    init = () => {
        this.currentMonth = 0;
        this.standDgree = 1;
        this.currentYear = this.dateService.getCurrentDate().year();
    };

    getProps() {
        const {titleDateFormat, selectedRange} = this.props;
        return {
            titleDateFormat: titleDateFormat || formats.veryShurt,
            selectedRange: selectedRange || this.dateService.getDefaultDateRange()
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
        const {isFullDayFormat, selectedRange} = this.getProps();
        this.daysOfWeekOptions = this.dateService.getDaysOfWeek(isFullDayFormat)
        this.setState({
            calendars: this.dateService.getFullYear(this.currentYear).reverse(),
            selectedRange
        });
    }

    calendarDidOpened = () => {
        const {selectedRange} = this.state;
        this.navigateTo(selectedRange.from.month(), selectedRange.from.year());
    };

    closeCalendar = () => {
        this.setState({isCalendarOpen: false});
        this.init();
    };

    onSelecedDataChanged = (selectedRange) => {
        this.setState({
            selectedRange
        });
    };

    navigateTo(month, year) {
        const navigateDate = {month, year};
        const currentDate = {
            year: this.currentYear,
            month: this.currentMonth
        };
        const flipTypeName = isBefore(currentDate, navigateDate) ? "nextMonth" : "previousMonth";
        const pagesToFlip = Math.abs(getDiff(currentDate, navigateDate, dateTypes.diffMonth));
        if (pagesToFlip <= 16) {
            generateArray(pagesToFlip, (i) =>
                setTimeout(() => this[flipTypeName](), (i + 1) * this.getFlipSpeed(pagesToFlip)));
        }
        else {
            this.currentYear = year;
            this.currentMonth = 0;
            this.setState({
                calendars: this.dateService.getFullYear(year).reverse()
            });
            this.navigateTo(month, year);
        }
    }

    getFlipSpeed = (flipCount) => flipCount
    <= 2 ? 300 : flipCount
    <= 5 ? 200 : 9;

    render() {
        const {titleDateFormat} = this.getProps();

        const {calendars} = this.state;
        return (
            <div className="dateRange-picker">
                <CalendarFlicker didOpen={this.calendarDidOpened}
                                 daysOfWeekOptions={this.daysOfWeekOptions}
                                 onChange={this.onSelecedDataChanged}
                                 onFocusOut={this.closeCalendar}
                                 nextMonth={this.nextMonth}
                                 previousMonth={this.previousMonth}
                                 calendars={calendars}
                                 titleDateFormat={titleDateFormat}>
                    <div className="stand-content">
                        <LabelConatiner label="Satrt Date"/>
                        <LabelConatiner label="End Date"/>
                    </div>
                </CalendarFlicker>
            </div>);
    }
}