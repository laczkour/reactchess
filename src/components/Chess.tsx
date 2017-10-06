// src/components/Hello.tsx

import * as React from 'react';
import './Chess.css';

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
  column: number;
  row: number;
  piece: string;
  isWhite: boolean;
  onMoveToHere?: () => void;
}

// [columns][rows]
export type BoardState = TileProps[][];

function pieceToUnicodeChar(piece: string, isWhite: boolean): string {
  switch (piece) {
    case 'P':
      return isWhite ? '♙' : '♟';
    default:
      return '';
  }
}

export function Tile(tileprops: TileProps) {
  var classNameString: string;
  if ((tileprops.column + tileprops.row) % 2 === 0) {
    classNameString = 'black tile';
  } else {
    classNameString = 'tile';
  }

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

export function Chess(boardState: BoardState) {
  //   throw new Error('This is how i can throw an error');
  var tiles: {}[][] = [];

  for (var row: number = 7; row >= 0; row--) {
    for (var column: number = 0; column < 8; column++) {
      if (tiles[column] === undefined) tiles[column] = [];
      tiles[column][row] = <Tile {...boardState[column][row]} />;
    }
  }
  return <div className="board">{tiles}</div>;
}

// export default Chess;
