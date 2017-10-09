import * as React from 'react';
import * as ReactDOM from 'react-dom';

// import * as pieces from './constants/pieces';

// // import App from './App';
// import Hello from './components/Hello';
// import registerServiceWorker from './registerServiceWorker';
// import './index.css';

// ReactDOM.render(
//   <Hello name="TypeScript" enthusiasmLevel={10} />,
//   document.getElementById('root') as HTMLElement
// );
// registerServiceWorker();

// Hello version
// import { createStore } from 'redux';
// import { enthusiasm } from './reducers/index';
// import { StoreState } from './types/index';
// import Hello from './containers/Hello';
// import { Provider } from 'react-redux';

// const store = createStore<StoreState>(enthusiasm, {
//   enthusiasmLevel: 1,
//   languageName: 'TypeScript',
// });

// ReactDOM.render(
//   <Provider store={store}>
//     <Hello />
//   </Provider>,
//   document.getElementById('root') as HTMLElement
// );

// Chess
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { BoardState } from './types/BoardState';
import { StorageState } from './types/StorageState';
import { move } from './reducers/index';
import { Chess, buildStartBoard } from './containers/Chess';

const boardState: BoardState = buildStartBoard();
const store = createStore<StorageState>(move, { boardState });
console.log('start');
ReactDOM.render(
  <Provider store={store}>
    <Chess />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
