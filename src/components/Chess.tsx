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
    <td
      className={classNameString}
      onDragOver={event => {
        event.preventDefault();
      }}
      onDrop={event => {
        console.log('drop 1');
        var m: MoveFromTo = {
          fromRow: Number(event.dataTransfer.getData('fromRow')),
          fromColumn: Number(event.dataTransfer.getData('fromColumn')),
          toRow: tileprops.row,
          toColumn: tileprops.column
        };
        console.log('drop 2');
        tileprops.onMoveToHere(m);
      }}
    >
      <span
        draggable={true}
        onDragStart={event => {
          console.log('dragstart 1');
          event.dataTransfer.setData('fromRow', tileprops.row + '');
          event.dataTransfer.setData('fromColumn', tileprops.column + '');
          console.log('dragstart 2');
        }}
      >
        {pieceToUnicodeChar(tileprops.piece, tileprops.isWhite)}
      </span>
    </td>
  );
}

export function Board(props: Props) {
  //   throw new Error('This is how i can throw an error');
  var tiles: {}[] = [];
  var rows: {}[] = [];
  for (var row: number = 0; row < 8; row++) {
    tiles = [];
    for (var column: number = 0; column < 8; column++) {
      if (tiles[column] === undefined) tiles[column] = [];
      var dispRow: number = 7 - row;
      var tile: DisplayTileProps = {
        ...props.boardState[column][dispRow],
        isBgWhite: (column + dispRow) % 2 === 1,
        onMoveToHere: props.onTryMove,
        column,
        row: dispRow
      };
      tiles[column] = <Tile {...tile} />;
    }
    rows.push(<tr>{tiles}</tr>);
  }
  return <table className="board">{rows}</table>;
}

export class Chess extends React.Component<Props, object> {
  render() {
    return Board(this.props as Props);
  }
}
