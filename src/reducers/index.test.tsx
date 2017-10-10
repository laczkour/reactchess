// import * as React from 'react';
// import * as ReactDOM from 'react-dom';
import { ValidMoveChecker, ValidMoveCheckerProps } from './index';
import { Chess, buildStartBoard } from '../containers/Chess';

it('can test', () => {});

it('Castles when possible', () => {
  var props = createTestProps();
  // Clear everything in between the kings and rooks
  props.boardState[1][0].piece = '';
  props.boardState[2][0].piece = '';
  props.boardState[3][0].piece = '';
  props.boardState[5][0].piece = '';
  props.boardState[6][0].piece = '';

  props.boardState[1][7].piece = '';
  props.boardState[2][7].piece = '';
  props.boardState[3][7].piece = '';
  props.boardState[5][7].piece = '';
  props.boardState[6][7].piece = '';
  // White can castle left
  props.moveFromTo = { fromColumn: 4, fromRow: 0, toColumn: 2, toRow: 0 };
  expect(new ValidMoveChecker({ ...props }).moveIfValid().valid).toBeTruthy();
  // White can castle right
  props.moveFromTo = { fromColumn: 4, fromRow: 0, toColumn: 6, toRow: 0 };
  expect(new ValidMoveChecker({ ...props }).moveIfValid().valid).toBeTruthy();
  // White can't castle if already moved
  props.moveHistory.push({ ...props.moveFromTo });
  expect(new ValidMoveChecker({ ...props }).moveIfValid().valid).toBeFalsy();
  props.isWhiteNext = false;

  // Black can castle left
  props.moveFromTo = { fromColumn: 4, fromRow: 7, toColumn: 2, toRow: 7 };
  expect(new ValidMoveChecker({ ...props }).moveIfValid().valid).toBeTruthy();
  // Black can castle right
  props.moveFromTo = { fromColumn: 4, fromRow: 7, toColumn: 6, toRow: 7 };
  expect(new ValidMoveChecker({ ...props }).moveIfValid().valid).toBeTruthy();
  // Black can't castle if already moved (Notice, White's move is in the 0. index, black move is on the 1. index)
  props.moveHistory.push({ ...props.moveFromTo });
  expect(new ValidMoveChecker({ ...props }).moveIfValid().valid).toBeFalsy();
});

function createTestProps(): ValidMoveCheckerProps {
  return {
    boardState: buildStartBoard(),
    moveFromTo: { fromColumn: 0, fromRow: 0, toColumn: 0, toRow: 0 },
    isWhiteNext: true,
    moveHistory: []
  };
}
