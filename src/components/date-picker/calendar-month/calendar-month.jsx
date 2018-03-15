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
    const {currentDate, nextMonth, previousMonth} = props;
    return (
        <div className="navigator-container">
            <div className="move-month" onClick={previousMonth}>
                <i className="arrow left"></i>
            </div>
            <div className="current-date">{currentDate}</div>
            <div className="move-month" onClick={nextMonth}>
                <i className="arrow right"></i>
            </div>
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
        const {weeks} = this.props;
        return (
            <div className="calendar-month">
                <CalendarTitle {...this.props}/>
                <CalendarContent {...this.props}/>
            </div>);
    }
}