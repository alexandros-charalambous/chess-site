import { Board, Move } from './types';

const isEnemyPiece = (from: string, to: string) => {
  if (to === null ) return false;
  return (from !== to);
};

const kingMove = (from: [number, number], to: [number, number], board: Board, pieceColor: string) => {
  const currentPlayer = pieceColor === 'white' ? 'white' : 'black';

  if (to[0] === from[0] && to[1] === from[1] + 2) {
    const rookPosition = [from[0], from[1] + 3]; 
    const rookPiece = board[rookPosition[0]][rookPosition[1]];
    const kingMoves: [number, number][] = [
      [from[0], from[1] + 1], 
      to,
    ]; 
    if (rookPiece?.substring(1,2) === 'R' 
      && !isKingInCheck(board, from, currentPlayer) 
      && !isKingInCheck(board, kingMoves[0], currentPlayer) 
      && !isKingInCheck(board, kingMoves[1], currentPlayer)) {
      return true; 
    }
  }

  if (to[0] === from[0] && to[1] === from[1] - 2) {
    const rookPosition = [from[0], from[1] - 4]; 
    const rookPiece = board[rookPosition[0]][rookPosition[1]];
    const kingMoves: [number, number][] = [
      [from[0], from[1] - 1], 
      to,                          
    ]; 
    if (rookPiece?.substring(1,2) === 'R' 
      && !isKingInCheck(board, from, currentPlayer) 
      && !isKingInCheck(board, kingMoves[0], currentPlayer) 
      && !isKingInCheck(board, kingMoves[1], currentPlayer)) {
      return true; 
    }
  }

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

const isKingInCheck = (board: Board, kingPosition: [number, number], currentPlayer: 'white' | 'black'): boolean => {
  const enemyColor = currentPlayer === 'white' ? 'b' : 'w';
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.startsWith(enemyColor)) {
        const pieceType = piece.substring(1,2); 
        const canMove = pieceMoves[pieceType](kingPosition, [row, col], board, enemyColor, null);
        if (canMove) {
          return true; 
        }
      }
    }
  } 
  return false; 
};

const simulateMove = (board: Board, move: Move): Board => {
  const newBoard = board.map(row => [...row]); 
  const piece = newBoard[move.from[0]][move.from[1]];
  
  newBoard[move.to[0]][move.to[1]] = piece;
  newBoard[move.from[0]][move.from[1]] = null;
  
  return newBoard;
};

const getKingPosition = (board: Board, currentPlayer: 'white' | 'black'): [number, number] => {
  const kingPiece = currentPlayer === 'white' ? 'wK' : 'bK';
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === kingPiece) {
        return [row, col];
      }
    }
  }
  
  throw new Error(`King not found for ${currentPlayer}`);
};

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
  if (!pieceMoves[piece.substring(1,2)](move.from, move.to, board, currentPlayer, lastMove)) return false;

  const simulatedBoard = simulateMove(board, move);
  const kingPosition = getKingPosition(simulatedBoard, currentPlayer);
  if (isKingInCheck(simulatedBoard, kingPosition, currentPlayer)) {
    return false;
  }

  return true;
};

export const getLegalMoves = (
  from: [number, number], 
  board: Board, 
  currentPlayer: 'white' | 'black', 
  lastMove: Move | null
): [number, number][] => {
  const legalMoves: [number, number][] = [];
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const move: Move = { from, to: [row, col] };
      if (isValidMove(move, board, currentPlayer, lastMove)) {          
        const simulatedBoard = simulateMove(board, move);

        if (!isKingInCheck(simulatedBoard, getKingPosition(simulatedBoard, currentPlayer), currentPlayer)) {
          legalMoves.push([row, col]);
        }
      }
    }
  }
  return legalMoves;
};

export const makeMove = (move: Move, board: Board, lastMove: Move | null) => {
  const newBoard = board.map(row => [...row]);
  const piece = newBoard[move.from[0]][move.from[1]];
  
  if (piece?.substring(1, 2) === 'K' && move.to[1] === move.from[1] + 2) {
    newBoard[move.to[0]][move.to[1]] = piece;
    newBoard[move.from[0]][move.from[1]] = null;
    newBoard[move.from[0]][move.to[1] - 1] = newBoard[move.from[0]][move.from[1] + 3];
    newBoard[move.from[0]][move.from[1] + 3] = null;
  }
  else if (piece?.substring(1, 2) === 'K' && move.to[1] === move.from[1] - 2) {
    newBoard[move.to[0]][move.to[1]] = piece;
    newBoard[move.from[0]][move.from[1]] = null;
    newBoard[move.from[0]][move.to[1] + 1] = newBoard[move.from[0]][move.from[1] - 4];
    newBoard[move.from[0]][move.from[1] - 4] = null;
  }
  else {
    newBoard[move.to[0]][move.to[1]] = piece;
    newBoard[move.from[0]][move.from[1]] = null;
  }

  return newBoard;
};