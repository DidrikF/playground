import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';

import RXJSPractice from './RXJSPractice';
import RXJSGame from './RXJSGame';
import SearchBox from './SearchBox';
import { store } from './SearchBox';
import Animations from './components/animated-card/Animations';
import CandleStickChart, { PriceData } from './components/candle-stick-chart/CandleStickChart';



import './sass/index.sass';
import './components/candle-stick-chart/sass/candlestick-chart.sass';


ReactDOM.render(<CandleStickChart data='apple-price-data.json' chartType='svg' />, document.getElementById('root'));




/*

ReactDOM.render(
    <Provider store={store}>
        <SearchBox />
    </Provider>,
    document.getElementById('root')
)

ReactDOM.render(
    <Animations />,
    document.getElementById('root2')  
);

ReactDOM.render(
    <RXJSPractice />,
    document.getElementById('root2')
);

ReactDOM.render(
    <RXJSGame />,
    document.getElementById('root3')
);
*/




/*

Might add normalizr later, if I see that the benefits outweights the cost of implementation.
Do remember that this simplifies the reducer logic, as the data structure will be less nested
and less objects and arrays must be recreated (casing better performance)

*/