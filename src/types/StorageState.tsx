import { BoardState } from './BoardState';
import { MoveFromTo } from '../actions/index';

export interface StorageState {
  boardState: BoardState;
  history: BoardState[];
  moveHistory: MoveFromTo[];
  isWhiteNext: boolean;
  isCheck: boolean;
  isCheckMate: boolean;
  isStaleMate: boolean;
}
