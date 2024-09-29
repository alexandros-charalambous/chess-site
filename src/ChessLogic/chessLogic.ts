import { Board, Move } from './types';

const isEnemyPiece = (from: string, to: string) => {
  if (to === null ) return false;
  return (from !== to);
};

const kingMove = (from: [number, number], to: [number, number], board: Board, pieceColor: string) => {
  return (Math.abs(from[0] - to[0]) <= 1 && Math.abs(from[1] - to[1]) <= 1);
}

const queenMove = (from: [number, number], to: [number, number], board: Board, pieceColor: string) => {
  const rowDiff = to[0] - from[0];
  const colDiff = to[1] - from[1];

  if (from[0] === to[0]) {
    const step = colDiff > 0 ? 1 : -1;
    for (let col = from[1] + step; col !== to[1]; col += step) {
      if (board[from[0]][col] !== null) return false;
    }
  } else if (from[1] === to[1]) {
    const step = rowDiff > 0 ? 1 : -1;
    for (let row = from[0] + step; row !== to[0]; row += step) {
      if (board[row][from[1]] !== null) return false;
    }
  } else if (Math.abs(rowDiff) === Math.abs(colDiff)) {
    const rowStep = rowDiff > 0 ? 1 : -1;
    const colStep = colDiff > 0 ? 1 : -1;

    let row = from[0] + rowStep;
    let col = from[1] + colStep;

    while (row !== to[0] && col !== to[1]) {
      if (board[row][col] !== null) return false;     
      row += rowStep;
      col += colStep;
    }
  }

  return (Math.abs(from[0] - to[0]) === Math.abs(from[1] - to[1]) || 
  from[0] === to[0] || from[1] === to[1]);
}

const rookMove = (from: [number, number], to: [number, number], board: Board, pieceColor: string) => {
  const rowDiff = to[0] - from[0];
  const colDiff = to[1] - from[1];

  if (from[0] === to[0]) {
    const step = colDiff > 0 ? 1 : -1;
    for (let col = from[1] + step; col !== to[1]; col += step) {
      if (board[from[0]][col] !== null) return false;
    }
  } else if (from[1] === to[1]) {
    const step = rowDiff > 0 ? 1 : -1;
    for (let row = from[0] + step; row !== to[0]; row += step) {
      if (board[row][from[1]] !== null) return false;
    }
  }
  return (from[0] === to[0] || from[1] === to[1]);
}

const bishopMove = (from: [number, number], to: [number, number], board: Board, pieceColor: string) => {  
  const rowDiff = to[0] - from[0];
  const colDiff = to[1] - from[1];
  if (Math.abs(rowDiff) === Math.abs(colDiff)) {
    const rowStep = rowDiff > 0 ? 1 : -1;
    const colStep = colDiff > 0 ? 1 : -1;

    let row = from[0] + rowStep;
    let col = from[1] + colStep;

    while (row !== to[0] && col !== to[1]) {
      if (board[row][col] !== null) return false;
      row += rowStep;
      col += colStep;
    }
  }

  return (Math.abs(from[0] - to[0]) === Math.abs(from[1] - to[1]));
}

const knightMove = (from: [number, number], to: [number, number], board: Board, pieceColor: string) => {
  return (Math.abs(from[0] - to[0]) === 2 && Math.abs(from[1] - to[1]) === 1) || 
  (Math.abs(from[0] - to[0]) === 1 && Math.abs(from[1] - to[1]) === 2);
}

const pawnMove = (from: [number, number], to: [number, number], board: Board, pieceColor: string, lastMove: Move | null) => {

  const forward = pieceColor === 'white' ? -1 : 1; 
  
  if (lastMove !== null) {
    const lastMoveWasDoubleStepPawn = board[lastMove.to[0]][lastMove.to[1]] === (pieceColor === 'white' ? 'bP' : 'wP') && Math.abs(lastMove.from[0] - lastMove.to[0]) === 2;
    const enPassantRow = pieceColor === 'white' ? 3 : 4;
    console.log(lastMoveWasDoubleStepPawn && from[0] === enPassantRow && to[1] === lastMove.to[1]);
    if (lastMoveWasDoubleStepPawn && from[0] === enPassantRow && to[1] === lastMove.to[1] && ((pieceColor === 'white' && to[0] === from[0] - 1) || (pieceColor === 'black' && to[0] === from[0] + 1))) return true;
  }

  const isCaptureMove = Math.abs(from[1] - to[1]) === 1 && (to[0] - from[0] === forward);
  if (isCaptureMove) {
    const targetSquare = board[to[0]][to[1]];
    const thisSquare = board[from[0]][from[1]];
    return targetSquare !== null && thisSquare !== null && isEnemyPiece(thisSquare.substring(0,1), targetSquare.substring(0,1));
  }

  const isForwardMove = from[1] === to[1] && to[0] - from[0] === forward;
  if (isForwardMove) {
    return board[to[0]][to[1]] === null;
  }

  if (pieceColor === 'white' && from[0] === 6 && from[1] === to[1] && to[0] === 4) {
    return board[5][to[1]] === null && board[4][to[1]] === null; 
  }

  if (pieceColor === 'black' && from[0] === 1 && from[1] === to[1] && to[0] === 3) {
    return board[2][to[1]] === null && board[3][to[1]] === null;
  }
  
  return false;
}

const pieceMoves: { [key: string]: (from: [number, number], to: [number, number], board: Board, pieceColor: string, lastMove: Move | null) => boolean } = {
  K: (from, to, board, pieceColor) => kingMove(from, to, board, pieceColor),
  Q: (from, to, board, pieceColor) => queenMove(from, to, board, pieceColor),
  R: (from, to, board, pieceColor) => rookMove(from, to, board, pieceColor), 
  B: (from, to, board, pieceColor) => bishopMove(from, to, board, pieceColor),
  N: (from, to, board, pieceColor) => knightMove(from, to, board, pieceColor),
  P: (from, to, board, pieceColor, lastMove) => pawnMove(from, to, board, pieceColor, lastMove)
};


export const isValidMove = (move: Move, board: Board, currentPlayer: 'white' | 'black', lastMove: Move | null): boolean => {
  const piece = board[move.from[0]][move.from[1]];
  if (!piece) return false;

  if (move.from[0] === move.to[0] && move.from[1] === move.to[1]) return false;
  if (board[move.from[0]][move.from[1]]?.substring(0,1) === board[move.to[0]][move.to[1]]?.substring(0,1)) return false;

  const pieceColor = piece.substring(0,1) === "w" ? 'white' : 'black';

  if (pieceColor !== currentPlayer) return false;
  
  if (!pieceMoves[piece.substring(1,2)]) return false;
  if (!pieceMoves[piece.substring(1,2)](move.from, move.to, board, pieceColor, lastMove)) return false;

  return true;
};

export const makeMove = (move: Move, board: Board, lastMove: Move | null) => {
  const newBoard = board.map(row => [...row]);
  const piece = newBoard[move.from[0]][move.from[1]];

  if (piece?.substring(1,2) === 'P') {
    const forward = piece?.substring(0,1) === 'w' ? -1 : 1;
    
    if (Math.abs(move.from[1] - move.to[1]) === 1 && newBoard[move.to[0]][move.to[1]] === null) {
      newBoard[move.to[0] - forward][move.to[1]] = null;
    }
  }

  newBoard[move.to[0]][move.to[1]] = piece;
  newBoard[move.from[0]][move.from[1]] = null;
  return newBoard;
};