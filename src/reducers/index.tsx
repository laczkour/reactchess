import { StorageState } from '../types/StorageState';
import * as actions from '../actions/index';
import * as constants from '../constants/actions';

export function move(state: StorageState, action: actions.MoveAction): StorageState {
  console.log('move reducer');
  switch (action.type) {
    case constants.TRY_MOVE: {
      if (_isValidMove(state, action)) {
        console.log('move reducer valid');
        var { fromColumn, fromRow, toColumn, toRow } = action.payload;
        var boardState = { ...state.boardState };
        boardState[toColumn][toRow] = { ...boardState[fromColumn][fromRow] };
        boardState[fromColumn][fromRow].piece = '';
        return { ...state, boardState };
      }
      return state;
    }
    default: {
      return state;
    }
  }
  // switch (action.type) {
  //   case INCREMENT_ENTHUSIASM:
  //     return { ...state, enthusiasmLevel: state.enthusiasmLevel + 1 };
  //   case DECREMENT_ENTHUSIASM:
  //     return { ...state, enthusiasmLevel: state.enthusiasmLevel - 1 };
  //   default:
  //     return state;
  // }
  // return state;
}

function _isValidMove(state: StorageState, action: actions.MoveAction): boolean {
  return true;
}
