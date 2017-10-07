import { StorageState } from '../types/StorageState';
import * as actions from '../actions/index';

export function move(state: StorageState, action: actions.MoveAction): StorageState {
  switch(action.type) {
    case actions.TryMove: {
      if ()
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
  return state;
}

function _isValidMove(state: StorageState, action: actions.MoveAction): boolean {
  return true;
}