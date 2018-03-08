import React from "react";
import {generateArray} from '../../../utils/arrayUtils';

const Day = (props) => {
    const {isCurrentMonth, number, isLastStartWeek} = props.dayInfo;
    return (
        <div className={`day ${isCurrentMonth ? 'currentMonth' : ''} `}>
            {number}
            {isLastStartWeek ? <div className=" day next-month-flipper">{number}</div> : null}
        </div>
    );
};

const Week = (props) => {
    const {days} = props;
    return (<div className="week">{days.map(d => <Day dayInfo={d}/>)}</div>);
};

const DaysOfWeek = (props) => (
    <div className="daysOfWeek">
        {props.daysOfWeek.map((d, i) => <div key={i} className="day title">{d}</div>)}
    </div>
);

const CalendarPin = () => (
    <div className="pins">
        {generateArray(10, i =>
            <div className="pin">
                <div></div>
                <div></div>
            </div>)
        }
    </div>
);

const CalendarNavigator = (props) => {
    const {currentDate, nextMonth, previousMonth} = props;
    return (
        <div className="navigator-container">
            <div className="month">{currentDate.month}</div>
            <div className="navigator">
                <div className="left-arrow" onClick={previousMonth}>{'<--'}</div>
                <div className="right-arrow" onClick={nextMonth}>{'-->'}</div>
            </div>
            <div className="year">{currentDate.year}</div>
            <CalendarPin/>
        </div>
    );
};

const CalendarTitle = (props) => {
    const {daysOfWeek, currentDate} = props;
    return (
        <div className="calendar-title">
            <CalendarNavigator currentDate={currentDate}/>
            <DaysOfWeek daysOfWeek={daysOfWeek}/>
        </div>
    );
};
const CalendarContent = (props) => props.weeks.map((week, i) => <Week key={i} days={week}/>);

export class CalendarMonth extends React.Component {

    render() {
        const {weeks, currentDate, daysOfWeek} = this.props;
        return (
            <div className="calendar-month">
                <CalendarTitle daysOfWeek={daysOfWeek} currentDate={currentDate}/>
                <CalendarContent weeks={weeks}/>
            </div>);
    }
}