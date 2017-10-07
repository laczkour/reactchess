// src/components/Hello.tsx

import * as React from 'react';
import './Chess.css';
import * as pieces from '../constants/pieces';

export interface Props {
  name: string;
  enthusiasmLevel?: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

/* 
  pieces:
  0: nothing
  P: pawn
  N: knight
  B: bishop
  R: rook/castle
  Q: queen
  K: king
*/

export interface TileProps {
  // column: number;
  // row: number;
  piece: string;
  isWhite: boolean;
  onMoveToHere?: () => void;
}

export interface DisplayTileProps extends TileProps {
  isBgWhite: boolean;
}

// [columns][rows]
export type BoardState = TileProps[][];

// https://en.wikipedia.org/wiki/Chess_symbols_in_Unicode
function pieceToUnicodeChar(piece: string, isWhite: boolean): string {
  switch (piece) {
    case pieces.PAWN:
      return isWhite ? '♙' : '♟';
    case pieces.KNIGHT:
      return isWhite ? '♘' : '♞';
    case pieces.BISHOP:
      return isWhite ? '♗' : '♝';
    case pieces.ROOK:
      return isWhite ? '♖' : '♜';
    case pieces.QUEEN:
      return isWhite ? '♕' : '♛';
    case pieces.KING:
      return isWhite ? '♔' : '♚';
    default:
      return '';
  }
}

export function Tile(tileprops: DisplayTileProps) {
  var classNameString: string = tileprops.isBgWhite ? 'tile' : 'black tile';
  return (
    <div className={classNameString}>
      <span
        draggable={true}
        onDragStart={event => {
          event.dataTransfer.setData('text', 'x');
        }}
      >
        {pieceToUnicodeChar(tileprops.piece, tileprops.isWhite)}
      </span>
    </div>
  );
}

export function Board(boardState: BoardState) {
  //   throw new Error('This is how i can throw an error');
  var tiles: {}[][] = [];
  for (var column: number = 0; column < 8; column++) {
    for (var row: number = 0; row < 8; row++) {
      if (tiles[column] === undefined) tiles[column] = [];
      var tile: DisplayTileProps = {
        ...boardState[column][row],
        isBgWhite: (column + row) % 2 === 1
      };
      tiles[column][7 - row] = <Tile {...tile} />;
    }
  }
  return <div className="board">{tiles}</div>;
}

export class Chess extends React.Component<any, object> {
  render() {
    var boardState: BoardState = _buildStartBoard();
    return Board(boardState);
  }
}

function _buildStartBoard(): BoardState {
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
