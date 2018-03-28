import React from "react";
import {dateService} from '../../services/dateService';
import {dateTypes, formats, isBefore, getDiff} from '../../utils/dateUtils';
import {generateArray} from '../../utils/arrayUtils';
import {setProperty, changeClass} from '../../utils/domUtils';
import {CalendarFlicker} from '../calendar-flicker/calendar-flicker.component.jsx';

const ResultContainer = ({icon, selectedDate, onClick, onRemove}) =>
    <div className="result-conatiner">
        <div onClick={onClick} className={`${selectedDate ? 'icon-container-small' : 'icon-container'}`}>
            {icon || <i style={{fontSize: '22px'}} className="icon-calendar"></i>}
        </div>
        {
            selectedDate ? [
                    <div key="1" onClick={onClick} className="selected-date-container">
                        {selectedDate.format(formats.default)}
                    </div>,
                    <div key="2" onClick={onRemove} className="icon-container-small">
                        {icon || <i style={{fontSize: '18px'}} className="icon-cancel"></i>}
                    </div>
                ] :
                <div onClick={onClick} className="selected-date-container empty">Select date...</div>

        }

    </div>

class DatePicker extends React.Component {

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
    }

    init = (selectedDate) => {
        selectedDate = selectedDate === undefined ? this.state.selectedDate : selectedDate;
        this.currentMonth = 0;
        this.standDgree = 1;
        this.currentYear = selectedDate && selectedDate.year() || this.dateService.getCurrentDate().year();
        this.setState({
            selectedDate,
            calendars: this.dateService.getFullYear(this.currentYear).reverse()
        });
    };

    getProps() {
        const {titleDateFormat, selectedDate, isDateDisable, isCloseAfterSelect, showNotRelatedMonthDates} = this.props;
        return {
            showNotRelatedMonthDates: showNotRelatedMonthDates || false,
            isCloseAfterSelect: isCloseAfterSelect || true,
            isDateDisable: isDateDisable,
            titleDateFormat: titleDateFormat || formats.veryShurt,
            selectedDate: selectedDate || null
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
            this.currentMonth = 11;
            const nextCalendars = this.dateService.getFullYear(this.currentYear);
            const merged = this.state.calendars.concat(nextCalendars.reverse());
            this.setState({
                calendars: merged
            }, () => changeClass(this.generateCurrentId(), "fliped-front", "fliped-back"));
        }
    }

    componentWillMount() {
        const {isFullDayFormat, selectedDate} = this.getProps();
        this.daysOfWeekOptions = this.dateService.getDaysOfWeek(isFullDayFormat);
        this.init(selectedDate);
    }

    calendarDidOpened = () => {
        const {selectedDate} = this.state;
        let selectedNav = selectedDate || this.dateService.getCurrentDate();
        this.navigateTo(selectedNav.month(), selectedNav.year());
    };

    closeCalendar = (selectedDate) => {
        this.init(selectedDate);
        this.setState({isCalendarOpen: false});
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
        const {isCloseAfterSelect} = this.getProps();
        this.setState({
            selectedDate,
        }, () => isCloseAfterSelect && this.closeCalendar());
    };

    getFlipSpeed = (flipCount) => flipCount
    <= 2 ? 300 : flipCount
    <= 5 ? 200 : 9;

    clearSelectedDate = () => this.closeCalendar(null);

    render() {
        const {titleDateFormat, isDateDisable, showNotRelatedMonthDates} = this.getProps();
        const {calendars, isCalendarOpen, selectedDate} = this.state;

        return (
            <div className="date-picker">
                <ResultContainer
                    selectedDate={selectedDate}
                    onRemove={this.clearSelectedDate}
                    onClick={() => this.setState({isCalendarOpen: true})}/>
                {isCalendarOpen &&
                <CalendarFlicker didOpen={this.calendarDidOpened}
                                 daysOfWeekOptions={this.daysOfWeekOptions}
                                 onChange={this.onSelecedDataChanged}
                                 onFocusOut={this.closeCalendar.bind(this, undefined)}
                                 nextMonth={this.nextMonth}
                                 isDateDisable={isDateDisable}
                                 previousMonth={this.previousMonth}
                                 showNotRelatedMonthDates={showNotRelatedMonthDates}
                                 calendars={calendars}
                                 selectedDate={selectedDate}
                                 titleDateFormat={titleDateFormat}/>}
            </div>);
    }
}

export  default DatePicker;