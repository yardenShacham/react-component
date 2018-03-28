import React from 'react';
import {render} from 'react-dom';
import {App} from './App.jsx'
import './styles.scss';
import {DatePicker} from '../dist/bundle';
import moment from 'moment';

const isPastDay = (date) => moment().diff(date, 'd') > 0;
render((
    <App>
        <DatePicker isDateDisable={(date) => isPastDay(date)}/>
    </App>
), document.getElementById('app'));