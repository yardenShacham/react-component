import React from "react";
import {dateService} from '../../services/dateService';
import {Input} from '../input';
import {dateTypes, formats, isBefore, getDiff} from '../../utils/dateUtils';
import {generateArray} from '../../utils/arrayUtils';
import {setProperty, changeClass} from '../../utils/domUtils';
import {CalendarFlicker} from '../calendar-flicker/calendar-flicker.component.jsx';

const ResultContainer = ({icon, selectedDate, onClick}) =>
    <div onClick={onClick} className="result-conatiner">
        <div className="icon-container">
            {icon || <i style={{fontSize: '22px'}} className="icon-calendar"></i>}
        </div>
        <div className="selected-date-container">
            {selectedDate && selectedDate.format(formats.default)}
        </div>
    </div>

export class DatePicker extends React.Component {

    constructor(props) {
        super(props);
        this.dateService = new dateService();
        this.nextMonth = this.nextMonth.bind(this);
        this.previousMonth = this.previousMonth.bind(this);
        this.state = {
            calendars: [],
            isCalendarOpen: false,
            selectedDate: null
        };
        this.init();
    }

    init = () => {
        this.currentMonth = 0;
        this.standDgree = 1;
        this.currentYear = this.dateService.getCurrentDate().year();
    };

    getProps() {
        const {titleDateFormat, selectedDate} = this.props;
        return {
            titleDateFormat: titleDateFormat || formats.veryShurt,
            selectedDate: selectedDate || this.dateService.getCurrentDate()
        };
    }

    getDegreeSpace = () => this.standDgree + (this.currentMonth <= 4 ? this.currentMonth / 2 : this.currentMonth / 6);

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
        const {isFullDayFormat, selectedDate} = this.getProps();
        this.daysOfWeekOptions = this.dateService.getDaysOfWeek(isFullDayFormat);
        this.setState({
            selectedDate,
            calendars: this.dateService.getFullYear(this.currentYear).reverse()
        });

    }

    calendarDidOpened = () => {
        const {selectedDate} = this.state;
        this.navigateTo(selectedDate.month(), selectedDate.year());
    };

    closeCalendar = () => {
        this.setState({isCalendarOpen: false});
        this.init();
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

    onSelecedDataChanged = (selectedDate) => {
        this.setState({
            selectedDate
        });
    };

    getFlipSpeed = (flipCount) => flipCount
    <= 2 ? 300 : flipCount
    <= 5 ? 200 : 9;

    render() {
        const {titleDateFormat} = this.getProps();
        const {calendars, isCalendarOpen, selectedDate} = this.state;

        return (
            <div className="date-picker">
                <ResultContainer
                    selectedDate={selectedDate}
                    onClick={() => this.setState({isCalendarOpen: true})}/>
                {isCalendarOpen &&
                <CalendarFlicker didOpen={this.calendarDidOpened}
                                 daysOfWeekOptions={this.daysOfWeekOptions}
                                 onChange={this.onSelecedDataChanged}
                                 onFocusOut={this.closeCalendar}
                                 nextMonth={this.nextMonth}
                                 previousMonth={this.previousMonth}
                                 calendars={calendars}
                                 titleDateFormat={titleDateFormat}/>}
            </div>);
    }
}