import React from "react";

const Day = (props) => {
    const {isCurrentMonth, number, isLastStartWeek} = props.dayInfo;
    return (
        <div className={`day ${isCurrentMonth ? 'currentMonth' : ''} `}>
            {number}
        </div>
    );
};

const Week = (props) => {
    const {days} = props;
    return (<div className="week">{days.map((d, i) => <Day key={i} dayInfo={d}/>)}</div>);
};

const DaysOfWeek = (props) => (
    <div className="daysOfWeek">
        {props.daysOfWeek.map((d, i) => <div key={i} className="day title">{d}</div>)}
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

const CalendarTitle = (props) => {
    const {daysOfWeek} = props;
    return (
        <div className="calendar-title">
            <CalendarNavigator {...props}/>
        </div>
    );
};
const CalendarContent = (props) => {
    const {daysOfWeek, weeks} = props;
    return (
        <div className="weeks-container">
            <DaysOfWeek daysOfWeek={daysOfWeek}/>
            {weeks.map((week, i) => <Week key={i} days={week}/>)}
        </div>
    );
}

export class CalendarMonth extends React.Component {

    render() {
        const {weeks, id} = this.props;
        return (
            <div ref="calendar" id={id} className="calendar-month">
                <CalendarTitle{...this.props} />
                <CalendarContent {...this.props}/>
            </div>);
    }
}