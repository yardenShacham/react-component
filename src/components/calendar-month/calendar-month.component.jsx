import React from "react";
import {isDateEqual} from "../../utils/dateUtils";

const Day = ({onChange, dayInfo, isDateDisable, selectedDate, showNotRelatedMonthDates}) => {
    const {isCurrentMonth, number, date} = dayInfo;
    const disableClass = 'disable';
    const currentMonthClass = 'currentMonth';
    const selectedDateClass = 'selected';
    const isSelectedClass = selectedDate && date && isDateEqual(selectedDate, date) ? selectedDateClass : '';
    let isDisableClass = isDateDisable && isDateDisable(date) ? disableClass : '';
    let isCurrentMonthClass = isCurrentMonth ? currentMonthClass : '';
    return (
        (isCurrentMonth || showNotRelatedMonthDates) ?
            <div onClick={() => isDisableClass !== disableClass && onChange(date)}
                 className={`day ${isCurrentMonthClass} ${isSelectedClass} ${isDisableClass}`}>
                {number}
            </div> :
            <div className="day"></div>
    );
};

const Week = (props) => (
    <div className="week">{props.days.map((d, i) => <Day key={i}
                                                         {...props}
                                                         dayInfo={d}/>)}</div>
);

const DaysOfWeek = ({daysOfWeek}) => (
    <div className="daysOfWeek">
        {daysOfWeek.map((d, i) => <div key={i} className="day title">{d}</div>)}
    </div>
);


const CalendarNavigator = (props) => {
    const {currentMonth, nextMonth, previousMonth} = props;
    return (
        <div className="navigator-container">
            <button className="move-month" onClick={(e) => {
                e.preventDefault();
                previousMonth();
            }}>
                <i className="arrow left"></i>
            </button>
            <div className="current-date">{currentMonth}</div>
            <button className="move-month" onClick={(e) => {
                e.preventDefault();
                nextMonth();
            }}>
                <i className="arrow right"></i>
            </button>
        </div>
    );
};

const CalendarTitle = (props) =>
    <div className="calendar-title">
        <CalendarNavigator {...props}/>
    </div>;

const CalendarContent = (props) =>
    <div className="weeks-container">
        <DaysOfWeek daysOfWeek={props.daysOfWeek}/>
        {props.weeks.map((week, i) => <Week key={i} {...props} days={week}/>)}
    </div>

export class CalendarMonth extends React.Component {

    render() {
        const {id} = this.props;
        return (
            <div ref="calendar" id={id} className="calendar-month">
                <CalendarTitle{...this.props} />
                <CalendarContent {...this.props}/>
            </div>);
    }
}