import { StorageState } from '../types/StorageState';
import * as actions from '../actions/index';
import * as constants from '../constants/actions';
import * as pieces from '../constants/pieces';
import { TileProps, BoardState } from '../types/BoardState';

export function move(state: StorageState, action: actions.MoveAction): StorageState {
  switch (action.type) {
    case constants.TRY_MOVE: {
      var validMoveChecker = new ValidMoveChecker({
        boardState: state.boardState,
        isWhiteNext: state.isWhiteNext,
        moveHistory: state.moveHistory,
        moveFromTo: action.payload
      });
      const { valid, boardState } = validMoveChecker.moveIfValid();
      if (valid) {
        var history = [...state.history, state.boardState];
        var moveHistory = [...state.moveHistory, action.payload];
        return {
          ...state,
          boardState: boardState as BoardState,
          isWhiteNext: !state.isWhiteNext,
          history,
          moveHistory
        };
      }
      return state;
    }
    default: {
      return state;
    }
  }
}

interface ValidMoveReturn {
  boardState?: BoardState;
  valid: boolean;
}
interface IsContinousMoveValidParam {
  isPawnForward: boolean;
  isKingCastling: boolean;
}
export interface ValidMoveCheckerProps {
  boardState: BoardState;
  moveFromTo: actions.MoveFromTo;
  isWhiteNext: boolean;
  moveHistory: actions.MoveFromTo[];
}

export class ValidMoveChecker {
  // state: StorageState;
  boardState: BoardState;
  moveFromTo: actions.MoveFromTo;
  valid: boolean;
  fromTile: TileProps;
  newBoardState: BoardState;
  isWhiteNext: boolean;
  moveHistory: actions.MoveFromTo[];

  constructor(props: ValidMoveCheckerProps) {
    this.boardState = props.boardState;
    this.isWhiteNext = props.isWhiteNext;
    this.moveHistory = props.moveHistory;
    // this.state = state;
    this.moveFromTo = props.moveFromTo;
  }

  moveIfValid(): ValidMoveReturn {
    this.fromTile = this.boardState[this.moveFromTo.fromColumn][this.moveFromTo.fromRow];
    this.valid = true;
    if (this.isWhiteNext !== this.fromTile.isWhite) return { valid: false };
    if (this.moveFromTo.fromColumn === this.moveFromTo.toColumn && this.moveFromTo.toRow === this.moveFromTo.fromRow) {
      return { valid: false };
    }

    switch (this.fromTile.piece) {
      case pieces.ROOK:
        this.valid = this.isRookValidMove();
        break;
      case pieces.BISHOP:
        this.valid = this.isBishopValidMove();
        break;
      case pieces.KNIGHT:
        this.valid = this.isKnightValidMove();
        break;
      case pieces.KING:
        this.valid = this.isKingValidMove();
        break;
      case pieces.QUEEN:
        this.valid = this.isQueenValidMove();
        break;
      case pieces.PAWN:
        this.valid = this.isPawnValidMove();
        break;

      default:
        this.valid = false;
    }

    if (this.valid) {
      return { valid: this.valid, boardState: this.newBoardState };
    } else {
      return { valid: this.valid };
    }
  }

  isPawnValidMove(): boolean {
    const directionSign = this.fromTile.isWhite ? -1 : 1;
    const columnDifference = this.moveFromTo.fromColumn - this.moveFromTo.toColumn;
    const rowDifference = (this.moveFromTo.fromRow - this.moveFromTo.toRow) * directionSign;
    // Obvious invalid moves
    if (Math.abs(columnDifference) > 1) return false;
    if (rowDifference > 2 || rowDifference < 1) return false;

    // Move forward one?
    if (rowDifference === 1 && columnDifference === 0) {
      if (this.isDestinationValid(true)) {
        this.createCommonNewBoardState();
        return true;
      } else {
        return false;
      }
    }

    // Starting double move?
    if (rowDifference === 2 && columnDifference === 0) {
      if (this.moveFromTo.fromRow !== (this.fromTile.isWhite ? 1 : 6)) return false;
      if (columnDifference !== 0) return false;
      if (this.isContinousMoveValid({ isPawnForward: true, isKingCastling: false })) {
        this.createCommonNewBoardState();
        return true;
      } else {
        return false;
      }
    }

    // Capture
    if (rowDifference === 1 && Math.abs(columnDifference) === 1) {
      const toTile = this.boardState[this.moveFromTo.toColumn][this.moveFromTo.toRow];
      if (toTile.isWhite !== this.fromTile.isWhite && toTile.piece !== '') {
        this.createCommonNewBoardState();
        return true;
      }
      // En Passe? need to know the previous move to check correctly FIXME
      const toEnPasseTile = this.boardState[this.moveFromTo.toColumn][this.moveFromTo.fromRow];
      if (toEnPasseTile.isWhite !== this.fromTile.isWhite && toEnPasseTile.piece === pieces.PAWN) {
        // FIXME if the last move was happened with a double move with that pawn
        const lastMove = this.moveHistory[this.moveHistory.length - 1];
        if (
          // Was the last move from the opponent Pawn?
          lastMove.toColumn === this.moveFromTo.toColumn &&
          lastMove.toRow === this.moveFromTo.fromRow &&
          // Was the last move from it's starter position?
          Math.abs(lastMove.fromRow - lastMove.toRow) === 2
        ) {
          this.createCommonNewBoardState();
          this.newBoardState[lastMove.toColumn][lastMove.toRow].piece = '';
          return true;
        }
      }
    }

    return false;
  }

  isKnightValidMove(): boolean {
    const columnDistance = Math.abs(this.moveFromTo.fromColumn - this.moveFromTo.toColumn);
    const rowDistance = Math.abs(this.moveFromTo.fromRow - this.moveFromTo.toRow);
    if (columnDistance < 3 && rowDistance < 3 && columnDistance + rowDistance === 3) {
      if (this.isDestinationValid()) {
        this.createCommonNewBoardState();
        return true;
      }
    }
    return false;
  }

  isRookValidMove(): boolean {
    if (
      this.moveFromTo.fromColumn - this.moveFromTo.toColumn !== 0 &&
      this.moveFromTo.fromRow - this.moveFromTo.toRow !== 0
    ) {
      return false;
    }
    if (this.isContinousMoveValid()) {
      this.createCommonNewBoardState();
      return true;
    }
    return false;
  }

  isBishopValidMove(): boolean {
    if (
      Math.abs(this.moveFromTo.fromColumn - this.moveFromTo.toColumn) !==
      Math.abs(this.moveFromTo.fromRow - this.moveFromTo.toRow)
    ) {
      return false;
    }
    if (this.isContinousMoveValid()) {
      this.createCommonNewBoardState();
      return true;
    }
    return false;
  }

  isQueenValidMove(): boolean {
    if (
      this.moveFromTo.fromColumn - this.moveFromTo.toColumn !== 0 &&
      this.moveFromTo.fromRow - this.moveFromTo.toRow !== 0 &&
      Math.abs(this.moveFromTo.fromColumn - this.moveFromTo.toColumn) !==
        Math.abs(this.moveFromTo.fromRow - this.moveFromTo.toRow)
    ) {
      return false;
    }
    if (this.isContinousMoveValid()) {
      this.createCommonNewBoardState();
      return true;
    }
    return false;
  }

  isKingValidMove(): boolean {
    // Castling
    if (
      Math.abs(this.moveFromTo.fromColumn - this.moveFromTo.toColumn) === 2 &&
      this.moveFromTo.fromRow - this.moveFromTo.toRow === 0 &&
      (this.fromTile.isWhite ? this.moveFromTo.fromRow === 0 : this.moveFromTo.fromRow === 7) &&
      this.moveFromTo.fromColumn === 4
    ) {
      var moveIndexOffset = this.fromTile.isWhite ? 0 : 1;
      var columnRook = this.moveFromTo.fromColumn - this.moveFromTo.toColumn === 2 ? 0 : 7;
      var rowRook = this.moveFromTo.fromRow;
      // If the rook is not in it's starting position can't castle
      if (this.boardState[columnRook][rowRook].piece !== pieces.ROOK) {
        return false;
      }
      for (var i = moveIndexOffset; i < this.moveHistory.length; i += 2) {
        // If the king moved at any time, can't castle
        if (
          this.moveFromTo.fromColumn === this.moveHistory[i].fromColumn &&
          this.moveFromTo.toColumn === this.moveHistory[i].toColumn
        ) {
          return false;
        }
        // If the targeted rook moved at any time, can't castle
        if (columnRook === this.moveHistory[i].fromColumn && rowRook === this.moveHistory[i].fromRow) {
          return false;
        }
      }
      // If there are pieces in the way, can't castle
      if (this.isContinousMoveValid({ isPawnForward: false, isKingCastling: true })) {
        this.createCommonNewBoardState();
        this.newBoardState[columnRook][rowRook].piece = '';
        this.newBoardState[(this.moveFromTo.fromColumn + this.moveFromTo.toColumn) / 2][rowRook].piece = pieces.ROOK;
        return true;
      }
      return false;
    }

    if (
      Math.abs(this.moveFromTo.fromColumn - this.moveFromTo.toColumn) > 1 ||
      Math.abs(this.moveFromTo.fromRow - this.moveFromTo.toRow) > 1
    ) {
      return false;
    }
    return this.isQueenValidMove();
  }

  isContinousMoveValid(
    { isPawnForward, isKingCastling }: IsContinousMoveValidParam = { isPawnForward: false, isKingCastling: false }
  ): boolean {
    var speedColumn = -Math.sign(this.moveFromTo.fromColumn - this.moveFromTo.toColumn);
    var speedRow = -Math.sign(this.moveFromTo.fromRow - this.moveFromTo.toRow);
    var curColumn = this.moveFromTo.fromColumn + speedColumn;
    var curRow = this.moveFromTo.fromRow + speedRow;
    while (curColumn !== this.moveFromTo.toColumn || curRow !== this.moveFromTo.toRow) {
      if (this.boardState[curColumn][curRow].piece !== '') {
        return false;
        // break;
      }
      curColumn += speedColumn;
      curRow += speedRow;
    }
    if (!isKingCastling) {
      return this.isDestinationValid(isPawnForward);
    }
    return true;
  }

  isDestinationValid(isPawnForward?: boolean): boolean {
    const toTile = this.boardState[this.moveFromTo.toColumn][this.moveFromTo.toRow];
    if (toTile.piece !== '' && (isPawnForward || toTile.isWhite === this.fromTile.isWhite)) {
      return false;
    }
    return true;
  }

  createCommonNewBoardState() {
    var boardState = JSON.parse(JSON.stringify(this.boardState));
    var { fromColumn, fromRow, toColumn, toRow } = this.moveFromTo;
    boardState[toColumn][toRow] = { ...boardState[fromColumn][fromRow] };
    boardState[fromColumn][fromRow] = { isWhite: false, piece: '' };
    this.newBoardState = boardState;
  }
}

// function immutablyChange(obj, keys: string | number[], newValue) {
//   var curr = obj;
//   keys.slice(0, keys.length - 2).forEach(element => {
//     curr[element] = { ...curr[element] };
//   });
//   curr[keys[keys.length - 1]] = newValue;
// }
