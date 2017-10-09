import * as constants from '../constants/actions';

export interface MoveFromTo {
  fromColumn: number;
  fromRow: number;
  toColumn: number;
  toRow: number;
}

export interface TryMove {
  type: constants.TRY_MOVE;
  payload: MoveFromTo;
}

export interface Move {
  type: constants.MOVE;
}

export interface MoveFail {
  type: constants.MOVE_FAIL;
}

export type MoveAction = TryMove | Move | MoveFail;
export function TryMove(m: MoveFromTo): TryMove {
  console.log('action TryMove');
  return {
    type: constants.TRY_MOVE,
    payload: m
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
