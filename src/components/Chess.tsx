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

export interface ChessProps {
  boardState: BoardState;
  isWhiteNext: boolean;
  onTryMove: () => void;

  moveHistory: MoveFromTo[];
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
        var m: MoveFromTo = {
          fromRow: Number(event.dataTransfer.getData('fromRow')),
          fromColumn: Number(event.dataTransfer.getData('fromColumn')),
          toRow: tileprops.row,
          toColumn: tileprops.column
        };
        tileprops.onMoveToHere(m);
      }}
    >
      <span
        draggable={true}
        onDragStart={event => {
          event.dataTransfer.setData('fromRow', tileprops.row + '');
          event.dataTransfer.setData('fromColumn', tileprops.column + '');
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
      tiles[column] = <Tile key={column + '_' + row} {...tile} />;
    }
    // var chr = String.fromCharCode(65 + 7 - row);
    rows.push(
      <tr key={row}>
        <th>{8 - row}</th>
        {tiles}
      </tr>
    );
  }
  rows.push(
    <tr>
      <th />
      <th>A</th>
      <th>B</th>
      <th>C</th>
      <th>D</th>
      <th>E</th>
      <th>F</th>
      <th>G</th>
      <th>H</th>
    </tr>
  );
  return (
    <table className="board">
      <tbody>{rows}</tbody>
    </table>
  );
}

export class Chess extends React.Component<ChessProps, object> {
  render() {
    var whoisnext = this.props.isWhiteNext ? 'White is next' : 'Black is next';
    var lis: {}[] = [];
    var getChr = (row: number) => String.fromCharCode(65 + 7 - row);
    this.props.moveHistory.forEach(element => {
      lis.push(<li>{getChr(element.fromColumn) + element.fromRow + getChr(element.toColumn) + element.toRow} </li>);
    });
    return (
      <div>
        <Board {...this.props} />
        <span>{whoisnext}</span>
        <ol>{lis}</ol>
      </div>
    );
    // return Board(this.props as Props);
  }
}
