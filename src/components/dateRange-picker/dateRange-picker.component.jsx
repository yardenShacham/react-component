import React from "react";
import onClickOutside from "react-onclickoutside";
import {dateService} from '../../services/dateService';
import {dateTypes, formats, isBefore, getDiff} from '../../utils/dateUtils';
import {generateArray} from '../../utils/arrayUtils';
import {setProperty, changeClass} from '../../utils/domUtils';
import CalendarFlicker from '../calendar-flicker/calendar-flicker.component.jsx';

const DateRangeViewer = ({selectedRange, isFromSelected, onFromClicked, onToClicked, displayFormat}) => (
    <div className="date-range-viewer">
        <div onClick={onFromClicked}
             className={`date-viewer ${isFromSelected ? 'selected' : ''}`}>{selectedRange.from.format(displayFormat)}</div>
        <div className="seprator">
            <i className="icon-right"></i>
        </div>
        <div onClick={onToClicked}
             className={`date-viewer ${isFromSelected === false ? 'selected' : ''}`}>{selectedRange.to.format(displayFormat)}</div>
    </div>
);

const ResultContainer = ({icon, isFromSelected, displayFormat, selectedRange, onFromClicked, onToClicked, onRemove}) =>
    <div className="result-conatiner">
        <div onClick={onFromClicked} className={`${selectedRange ? 'icon-container-small' : 'icon-container'}`}>
            {icon || <i style={{fontSize: '22px'}} className="icon-calendar"></i>}
        </div>
        {
            selectedRange ? [
                    <DateRangeViewer key="1"
                                     selectedRange={selectedRange}
                                     isFromSelected={isFromSelected}
                                     displayFormat={displayFormat}
                                     onFromClicked={onFromClicked}
                                     onToClicked={onToClicked}/>,
                    <div key="2" onClick={onRemove} className="icon-container-small">
                        {icon || <i style={{fontSize: '25px'}} className="icon-cancel"></i>}
                    </div>
                ] :
                <div onClick={onFromClicked} className="date-range-viewer">Select date range...</div>
        }

    </div>

class DateRangePicker extends React.Component {

    constructor(props) {
        super(props);
        this.dateService = new dateService();
        this.nextMonth = this.nextMonth.bind(this);
        this.previousMonth = this.previousMonth.bind(this);
        this.state = {
            calendars: [],
            isCalendarOpen: false,
            isFromSelected: null,
            selectedRange: null,
            rangeResult: null,
            isHoverMode: false
        };
    }

    init = (selectedRange) => {
        const {onChange} = this.props;
        selectedRange = selectedRange === undefined ? this.state.selectedRange : selectedRange;
        this.currentMonth = 0;
        this.standDgree = 1;
        this.currentYear = selectedRange && selectedRange.from && selectedRange.from.year() || this.dateService.getCurrentDate().year();
        this.setState({
            selectedRange,
            rangeResult: selectedRange && Object.assign({}, selectedRange) || null,
            calendars: this.dateService.getFullYear(this.currentYear).reverse()
        }, () => onChange && onChange(selectedRange));
    };

    getProps() {
        const {titleDateFormat, maxPageAnimation, animationSpeed, displayFormat, selectedRange, isDateDisable, isCloseAfterSelect, showNotRelatedMonthDates} = this.props;
        return {
            showNotRelatedMonthDates: showNotRelatedMonthDates || false,
            isCloseAfterSelect: isCloseAfterSelect || true,
            isDateDisable: isDateDisable,
            titleDateFormat: titleDateFormat || formats.veryShurt,
            selectedRange: selectedRange || null,
            displayFormat: displayFormat || 'MMM DD',
            maxPageAnimation: maxPageAnimation || 2,
            animationSpeed: animationSpeed ?
                typeof animationSpeed === "function" ? animationSpeed :
                    () => animationSpeed : this.getFlipSpeed
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
        const {isFullDayFormat, selectedRange} = this.getProps();
        this.daysOfWeekOptions = this.dateService.getDaysOfWeek(isFullDayFormat);
        this.init(selectedRange);
    }

    calendarDidOpened = () => {
        const {selectedRange} = this.state;
        let selectedNav = selectedRange && selectedRange.from || this.dateService.getCurrentDate();
        this.navigateTo(selectedNav.month(), selectedNav.year());
    };

    tryOpenCalendar = (isFromSelected) => {
        const {isCalendarOpen} = this.state;
        if (!isCalendarOpen) {
            this.setState({isCalendarOpen: true, isFromSelected})
        }
        else if (isFromSelected !== undefined || isFromSelected !== null)
            this.setState({isFromSelected})
    }

    closeCalendar = (selectedRange) => {
        this.init(selectedRange);
        this.setState({isCalendarOpen: false, isFromSelected: null});
    };

    handleClickOutside = evt => {
        this.closeCalendar(undefined);
    };

    navigateTo(month, year) {
        const {maxPageAnimation, animationSpeed} = this.getProps();
        const navigateDate = {month, year};
        const currentDate = {
            year: this.currentYear,
            month: this.currentMonth
        };
        const flipTypeName = isBefore(currentDate, navigateDate) ? "nextMonth" : "previousMonth";
        const pagesToFlip = Math.abs(getDiff(currentDate, navigateDate, dateTypes.diffMonth));
        if (pagesToFlip <= maxPageAnimation) {
            generateArray(pagesToFlip, (i) =>
                setTimeout(() => this[flipTypeName](), (i + 1) * animationSpeed(pagesToFlip)));
        }
        else if (currentDate.year !== navigateDate.year) {
            this.currentYear = year;
            this.currentMonth = 0;
            this.setState({
                calendars: this.dateService.getFullYear(year).reverse()
            });
            this.navigateTo(month, year);
        }
        else {
            generateArray(pagesToFlip, (i) => this[flipTypeName]());
        }
    }

    onMouseHover = (e, selectedDate) => {
        const {isHoverMode, selectedRange, isFromSelected} = this.state;
        if (isHoverMode) {
            const selected = {
                from: isFromSelected && selectedDate || selectedRange.from,
                to: selectedDate
            };
            if (this.dateService.basicDateRangeValidation(selected)) {
                this.setState({
                    selectedRange: selected
                });
            }
        }
    };

    onSelecedDataChanged = (selectedDate) => {
        const {isCloseAfterSelect} = this.getProps();
        const {selectedRange, isFromSelected} = this.state;
        const selected = {
            from: isFromSelected && selectedDate || selectedRange.from,
            to: selectedDate
        };
        const stateInfo = isFromSelected ? {
            isHoverMode: true,
            isCloseNeedToClose: false,
            isFromSelected: false
        } : {
            isCloseNeedToClose: true,
            isHoverMode: false,
            isFromSelected: false
        };

        if (this.dateService.basicDateRangeValidation(selected)) {
            const newState = Object.assign({
                selectedRange: selected,
                rangeResult: Object.assign({}, selected),
            }, stateInfo);

            this.setState(newState, () => !this.state.isFromSelected && stateInfo.isCloseNeedToClose && isCloseAfterSelect && this.closeCalendar());
        }
    };

    getFlipSpeed = (flipCount) => flipCount <= 2 ? 300 : 200;

    clearSelectedRange = () => this.closeCalendar(null);

    render() {
        const {titleDateFormat, displayFormat, isDateDisable, showNotRelatedMonthDates} = this.getProps();
        const {calendars, isFromSelected, isCalendarOpen, selectedRange, rangeResult} = this.state;
        const dynamicStyle = {width: selectedRange ? '275px' : '220px'};
        return (
            <div className="dateRange-picker" style={dynamicStyle}>
                <ResultContainer
                    selectedRange={rangeResult}
                    displayFormat={displayFormat}
                    isFromSelected={isFromSelected}
                    onRemove={this.clearSelectedRange}
                    onToClicked={() => this.tryOpenCalendar(false)}
                    onFromClicked={() => this.tryOpenCalendar(true)}/>
                {isCalendarOpen &&
                <CalendarFlicker didOpen={this.calendarDidOpened}
                                 daysOfWeekOptions={this.daysOfWeekOptions}
                                 onChange={this.onSelecedDataChanged}
                                 nextMonth={this.nextMonth}
                                 onMouseHover={this.onMouseHover}
                                 isDateDisable={isDateDisable}
                                 previousMonth={this.previousMonth}
                                 showNotRelatedMonthDates={showNotRelatedMonthDates}
                                 calendars={calendars}
                                 selectedRange={selectedRange}
                                 titleDateFormat={titleDateFormat}/>}
            </div>);
    }
}

export default onClickOutside(DateRangePicker);