import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';

import RXJSPractice from './RXJSPractice';
import RXJSGame from './RXJSGame';
import SearchBox from './SearchBox';
import { store } from './SearchBox';
import Animations from './components/animated-card/Animations';
import CandleStickChart from './components/candle-stick-chart/CandleStickChart';



import './sass/index.sass';
import './components/candle-stick-chart/sass/candlestick-chart.sass';


let priceData = require('./components/candle-stick-chart/apple-price-data.json');
priceData = priceData.map(el => {
    const newEl = {};
    newEl['date'] = new Date(el.date);
    newEl['open'] = parseFloat(el.open);
    newEl['high']= parseFloat(el.high);
    newEl['low'] =parseFloat(el.low);
    newEl['close'] = parseFloat(el.close);
    newEl['volume'] = parseInt(el.volume, 10);
    return newEl;
})

console.log('Price Data: ', priceData);

ReactDOM.render(<CandleStickChart data={priceData} />, document.getElementById('root'));



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