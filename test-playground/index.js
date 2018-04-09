import React from 'react';
import {render} from 'react-dom';
import {App} from './App.jsx'
import './styles.scss';
import {DateRangePicker} from '../dist/bundle';
import moment from 'moment';
//{from: moment(), to: moment().add(5, 'days')}
const isPastDay = (date) => moment().diff(date, 'd') > 0;
render((
    <App>
        <DateRangePicker isDateDisable={isPastDay}  selectedRange={null}/>
    </App>
), document.getElementById('app'));