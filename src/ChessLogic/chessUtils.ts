import { Board } from './types';

export const initialBoardSetup = (): Board => [
    ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
    ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
    ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"],
  ];

  
// export const initialBoardSetup = (): Board => [
//   ['bR', null, null, null, 'bK', null, null, 'bR'],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   ['wR', null, null, null, 'wK', null, null, 'wR'],
// ];

export const initialGameState = {
    white: {
      king: false,
      rookKingside: false,
      rookQueenside: false,
    },
    black: {
      king: false,
      rookKingside: false,
      rookQueenside: false,
    },
  };

export const pieceImages: { [key: string]: string } = {
    wP: "/assets/white-pawn.png",
    wR: "/assets/white-rook.png",
    wN: "/assets/white-knight.png",
    wB: "/assets/white-bishop.png",
    wQ: "/assets/white-queen.png",
    wK: "/assets/white-king.png",
    bP: "/assets/black-pawn.png",
    bR: "/assets/black-rook.png",
    bN: "/assets/black-knight.png",
    bB: "/assets/black-bishop.png",
    bQ: "/assets/black-queen.png",
    bK: "/assets/black-king.png",
  };

export const chessNotations = (row: number, col: number) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const notationMap = new Map<string, string>();

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const notation = `${files[col]}${8 - row}`;
      notationMap.set(`${row},${col}`, notation);
    }
  }
  return notationMap.get(`${row},${col}`);
};