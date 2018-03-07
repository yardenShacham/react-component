import React from 'react';
import {render} from 'react-dom';
import {App} from './App.jsx'
import {components} from '../src'
import './styles.scss';

const allComponents = components.map(c =>
    <div className="react-component">
        {c}
    </div>);
render((
    <App>
        {allComponents}
    </App>
), document.getElementById('app'));