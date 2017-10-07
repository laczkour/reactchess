import * as constants from '../constants/actions';

export interface TryMove {
  type: constants.TRY_MOVE;
}

export interface Move {
  type: constants.MOVE;
}

export interface MoveFail {
  type: constants.MOVE_FAIL;
}

export type MoveAction = TryMove | Move | MoveFail;

export function TryMove(): TryMove {
  return {
    type: constants.TRY_MOVE
  };
}

export function Move(): Move {
  return {
    type: constants.MOVE
  };
}

export function MoveFail(): MoveFail {
  return {
    type: constants.MOVE_FAIL
  };
}
