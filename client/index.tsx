import ReactDOM from 'react-dom';
import React from 'react';
import BlockNavigationTest from './components/block-navigation-test/BlockNavigationTest';

// import RPGGame from './components/rpg-game/RPGGame';


// import { Provider } from 'react-redux';

// import RXJSPractice from './RXJSPractice';
// import RXJSGame from './RXJSGame';
// import SearchBox from './SearchBox';
// import { store } from './SearchBox';
// import Animations from './components/animated-card/Animations';
// import CandleStickChart, { PriceData } from './components/candle-stick-chart/CandleStickChart';
// import { Phone } from './components/phone-navigation/Phone';


// import './sass/index.sass';
// import './components/candle-stick-chart/sass/candlestick-chart.sass';
// import './components/phone-navigation/sass/phone.sass';


// ReactDOM.render(<Phone />, document.getElementById('root'));

/*
ReactDOM.render(<CandleStickChart data='apple-price-data.json' chartType='svg' />, document.getElementById('root'));

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





ReactDOM.render(<BlockNavigationTest />, document.getElementById('root'));

/* THREE JS GAME */
// import './components/threejs-practice/ThreejsPractice';













/*
Might add normalizr later, if I see that the benefits outweights the cost of implementation.
Do remember that this simplifies the reducer logic, as the data structure will be less nested
and less objects and arrays must be recreated (casing better performance)
*/