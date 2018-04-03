import React from 'react';
import {render} from 'react-dom';
import {App} from './App.jsx'
import './styles.scss';
import {DateRangePicker} from '../src';
import moment from 'moment';

const isPastDay = (date) => moment().diff(date, 'd') > 0;
render((
    <App>
        <DateRangePicker  selectedRange={{from: moment(), to: moment().add(5, 'days')}}/>
    </App>
), document.getElementById('app'));