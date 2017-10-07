import { Chess as ChessComponent } from '../components/Chess';
import * as actions from '../actions/index';
import { StorageState } from '../types/StorageState';
import { BoardState, TileProps } from '../types/BoardState';
import * as pieces from '../constants/pieces';
import { connect, Dispatch } from 'react-redux';

export function mapStateToProps({ boardState }: StorageState) {
  return {
    boardState
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.MoveAction>) {
  return {
    onTryMove: () => dispatch(actions.TryMove())
  };
}

export var Chess = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChessComponent as any);

/* ------------------------------------------------------------------------ */

export function buildStartBoard(): BoardState {
  var boardState: BoardState;
  boardState = [];
  for (var column: number = 2; column < 6; column++) {
    boardState[column] = [];
    for (var row: number = 2; row < 6; row++) {
      boardState[column][row] = {
        isWhite: false,
        piece: ''
      };
    }
  }
  for (column = 0; column < 8; column++) {
    _putpiece(column, 1, pieces.PAWN, boardState);
  }
  _putpiece(0, 0, pieces.ROOK, boardState);
  _putpiece(1, 0, pieces.KNIGHT, boardState);
  _putpiece(2, 0, pieces.BISHOP, boardState);
  _putpiece(3, 0, pieces.QUEEN, boardState);
  _putpiece(4, 0, pieces.KING, boardState);
  _putpiece(5, 0, pieces.BISHOP, boardState);
  _putpiece(6, 0, pieces.KNIGHT, boardState);
  _putpiece(7, 0, pieces.ROOK, boardState);
  var temp: TileProps = boardState[3][7];
  boardState[3][7] = boardState[4][7];
  boardState[4][7] = temp;
  return boardState;
}

function _putpiece(
  column: number,
  row: number,
  piece: pieces.PIECE,
  boardState: BoardState
): void {
  if (boardState[column] === undefined) boardState[column] = [];
  boardState[column][row] = {
    isWhite: true,
    piece: piece
  };
  column = 7 - column;
  row = 7 - row;
  if (boardState[column] === undefined) boardState[column] = [];
  boardState[column][row] = {
    isWhite: false,
    piece: piece
  };
}
