import * as React from 'react';
import * as ReactDOM from 'react-dom';
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
import { Chess, BoardState } from './components/Chess';
var boardState: BoardState = [];
for (var column: number = 0; column < 8; column++) {
  boardState[column] = [];
  for (var row: number = 0; row < 8; row++) {
    boardState[column][row] = {
      column: column,
      row: row,
      isWhite: false,
      piece: ''
    };
  }
}

for (column = 0; column < 8; column++) {
  boardState[column][1] = {
    ...boardState[column][1],
    isWhite: false,
    piece: 'P'
  };
  boardState[column][6] = {
    ...boardState[column][6],
    isWhite: true,
    piece: 'P'
  };
}

ReactDOM.render(<Chess {...boardState} />, document.getElementById(
  'root'
) as HTMLElement);
