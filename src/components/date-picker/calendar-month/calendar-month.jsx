import React from "react";

const Day = (props) => {
    const {isCurrentMonth, number} = props.dayInfo;
    return (
        <div className={`day ${isCurrentMonth ? 'currentMonth' : ''}`}>{number}</div>
    );
};

const Week = (props) => {
    const {days} = props;
    return (<div className="week">{days.map(d => <Day dayInfo={d}/>)}</div>);
};

const CalendarTitle = (props) => {
    const {daysOfWeek, currentDate} = props;
    return (
        <div className="calendar-title">
            <div>{currentDate}</div>
            <div className="daysOfWeek">{daysOfWeek.map((d, i) => <div key={i} className="day">{d}</div>)}</div>
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