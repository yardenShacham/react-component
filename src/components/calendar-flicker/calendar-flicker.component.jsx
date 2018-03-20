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

export class CalendarFlicker extends React.Component {

    componentDidMount() {
        const {didOpen} = this.props;
        didOpen();
    }

    focusOut = (e) => {
        const {onFocusOut} = this.props;
        if (onFocusOut) {
            if (e.relatedTarget === null || e.relatedTarget && this.isNotContain(e.relatedTarget, "move-month")) {
                onFocusOut();
            }
        }
    };

    isNotContain = (conatiner, className) => !conatiner.classList.contains(className);


    render() {
        const {
            calendars, nextMonth, onChange, className,
            previousMonth, daysOfWeekOptions, titleDateFormat, children
        } = this.props;

        return (
            <div onBlur={this.focusOut}
                 tabIndex={-2}
                 ref={e => e && e.focus()}
                 style={{outline: 'none'}}
                 className={`flicker-conatiner ${className || ''}`}>
                <div className="stand front">{children}</div>
                {
                    calendars.map((c, i) =>
                        <CalendarMonth weeks={c.weeks}
                                       key={i}
                                       id={`${c.currentMonth.month()}-${c.currentMonth.year()}`}
                                       daysOfWeek={daysOfWeekOptions}
                                       onChange={onChange}
                                       nextMonth={nextMonth}
                                       previousMonth={previousMonth}
                                       currentMonth={c.currentMonth.format(titleDateFormat)}/>)
                }
                <div className="stand back"></div>
                <CalendarPin/>
            </div>
        );
    }
}

