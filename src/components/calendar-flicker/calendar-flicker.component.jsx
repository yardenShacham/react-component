import React from "react";
import {CalendarMonth} from '../calendar-month';
import {generateArray} from '../../utils/arrayUtils';

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
const Input = ({label, onInput, type}) =>
    <div className="input-container">
        <label>{label}</label>
        <input onInput={onInput} type={type}/>
    </div>

class CalendarFlicker extends React.Component {

    componentDidMount() {
        const {didOpen} = this.props;
        didOpen();
    }

    isNotContain = (conatiner, className) => !conatiner.classList.contains(className);


    render() {
        const {calendars, className, daysOfWeekOptions, titleDateFormat, children} = this.props;

        return (
            <div ref={e => e && e.focus()}
                 style={{outline: 'none'}}
                 className={`flicker-conatiner ${className || ''}`}>
                <div className="stand front">{children}</div>
                {
                    calendars.map((c, i) =>
                        <CalendarMonth weeks={c.weeks}
                                       key={i}
                                       id={`${c.currentMonth.month()}-${c.currentMonth.year()}`}
                                       daysOfWeek={daysOfWeekOptions}
                                       {...this.props}
                                       currentMonth={c.currentMonth.format(titleDateFormat)}/>)
                }
                <div className="stand back"></div>
                <CalendarPin/>
            </div>
        );
    }
}

export default CalendarFlicker

