import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const el = document.getElementById('plotly-editor');

ReactDOM.render(<App dataURL={el.getAttribute('data-dataURL')}
                     configField={el.getAttribute('data-config-field')}
                     />, el);
//ReactDOM.render(<App dataURL={el.getAttribute('data-dataURL')} />, el);