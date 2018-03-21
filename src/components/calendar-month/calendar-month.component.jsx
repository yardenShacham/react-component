import React from "react";

const Day = ({onChange, dayInfo}) => {
    const {isCurrentMonth, number, date} = dayInfo;
    return (
        <div onClick={() => onChange(date)}
             className={`day ${isCurrentMonth ? 'currentMonth' : ''} `}>
        {number}
        </div>
        );
    };

const Week = ({onChange, days}) => (
    <div className="week">{days.map((d, i) => <Day key={i} onChange={onChange}
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
    }
;

const CalendarTitle = (props) => {
    const {daysOfWeek} = props;
    return (
    <div className="calendar-title">
    <CalendarNavigator {...props}/>
    </div>
    );
};
const CalendarContent = ({daysOfWeek, weeks, onChange}) =>
    <div className="weeks-container">
        <DaysOfWeek daysOfWeek={daysOfWeek}/>
        {weeks.map((week, i) => <Week key={i} onChange={onChange} days={week}/>)}
    </div>

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