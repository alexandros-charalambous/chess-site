import { Board, Move } from './types';

const pieceMoves: { [key: string]: (from: [number, number], to: [number, number], board: Board) => boolean } = {
  wK: (from, to) => Math.abs(from[0] - to[0]) <= 1 && Math.abs(from[1] - to[1]) <= 1,
  wQ: (from, to) => Math.abs(from[0] - to[0]) === Math.abs(from[1] - to[1]) || 
                   from[0] === to[0] || from[1] === to[1],
  wR: (from, to) => from[0] === to[0] || from[1] === to[1], 
  wB: (from, to) => Math.abs(from[0] - to[0]) === Math.abs(from[1] - to[1]),
  wN: (from, to) => (Math.abs(from[0] - to[0]) === 2 && Math.abs(from[1] - to[1]) === 1) || 
                   (Math.abs(from[0] - to[0]) === 1 && Math.abs(from[1] - to[1]) === 2),
  wP: (from, to) => {
    if (from[0] === 6) {
      return (to[0] === from[0] - 1 && to[1] === from[1]) || (to[0] === from[0] - 2 && to[1] === from[1]);
    }
    return to[0] === from[0] - 1 && to[1] === from[1];
  },
  bK: (from, to) => Math.abs(from[0] - to[0]) <= 1 && Math.abs(from[1] - to[1]) <= 1,
  bQ: (from, to) => Math.abs(from[0] - to[0]) === Math.abs(from[1] - to[1]) ||
                    from[0] === to[0] || from[1] === to[1],
  bR: (from, to) => from[0] === to[0] || from[1] === to[1],
  bB: (from, to) => Math.abs(from[0] - to[0]) === Math.abs(from[1] - to[1]),
  bN: (from, to) => (Math.abs(from[0] - to[0]) === 2 && Math.abs(from[1] - to[1]) === 1) || 
                    (Math.abs(from[0] - to[0]) === 1 && Math.abs(from[1] - to[1]) === 2),
  bP: (from, to) => {
    if (from[0] === 1) {
      return (to[0] === from[0] + 1 && to[1] === from[1]) || (to[0] === from[0] + 2 && to[1] === from[1]);
    }
    return to[0] === from[0] + 1 && to[1] === from[1];
  },
};

export const isValidMove = (move: Move, board: Board, currentPlayer: 'white' | 'black'): boolean => {
  const piece = board[move.from[0]][move.from[1]];
  if (!piece) return false;

  const pieceColor = piece.substring(0,1) === "w" ? 'white' : 'black';
  if (pieceColor !== currentPlayer) return false;
  
  if (!pieceMoves[piece]) return false;

  if (!pieceMoves[piece](move.from, move.to, board)) return false;

  return true;
};

export const makeMove = (move: Move, board: Board) => {
  const newBoard = board.map(row => [...row]);
  const piece = newBoard[move.from[0]][move.from[1]];
  newBoard[move.to[0]][move.to[1]] = piece;
  newBoard[move.from[0]][move.from[1]] = null;
  return newBoard;
};