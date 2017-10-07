// src/components/Hello.tsx

import * as React from 'react';
import './Chess.css';
import * as pieces from '../constants/pieces';
import { BoardState, TileProps } from '../types/BoardState';
import { MoveFromTo } from '../actions/index';

export interface Props {
  boardState: BoardState;
  onTryMove: () => void;
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

export interface DisplayTileProps extends TileProps {
  onMoveToHere: (m: MoveFromTo) => void;
  isBgWhite: boolean;
  column: number;
  row: number;
}

// [columns][rows]

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
          event.dataTransfer.setData('fromRow', tileprops.row + '');
          event.dataTransfer.setData('fromColumn', tileprops.column + '');
        }}
        onDrop={event => {
          var m: MoveFromTo = {
            fromRow: Number(event.dataTransfer.getData('fromRow')),
            fromColumn: Number(event.dataTransfer.getData('fromColumn')),
            toRow: tileprops.row,
            toColumn: tileprops.column
          };
          tileprops.onMoveToHere(m);
        }}
      >
        {pieceToUnicodeChar(tileprops.piece, tileprops.isWhite)}
      </span>
    </div>
  );
}

export function Board(props: Props) {
  //   throw new Error('This is how i can throw an error');
  var tiles: {}[][] = [];
  for (var column: number = 0; column < 8; column++) {
    for (var row: number = 0; row < 8; row++) {
      if (tiles[column] === undefined) tiles[column] = [];
      var tile: DisplayTileProps = {
        ...props.boardState[column][row],
        isBgWhite: (column + row) % 2 === 1,
        onMoveToHere: props.onTryMove,
        column,
        row
      };
      tiles[column][7 - row] = <Tile {...tile} />;
    }
  }
  return <div className="board">{tiles}</div>;
}

export class Chess extends React.Component<Props, object> {
  render() {
    return Board(this.props as Props);
  }
}
