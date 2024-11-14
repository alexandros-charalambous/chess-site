import { Board, Move, Piece, PromotionPiece } from "./types";

const isEnemyPiece = (from: string, to: string) => {
  if (to === null) return false;
  return from !== to;
};

const kingMove = (
  from: [number, number],
  to: [number, number],
  board: Board,
  pieceColor: "white" | "black",
  castleState: [boolean, boolean]
): boolean => {
  const row = from[0];

  if (to[0] === from[0] && to[1] === from[1] + 2) {
    if (!castleState[0]) {
      const rookPosition = [row, from[1] + 3];
      const rookPiece = board[rookPosition[0]][rookPosition[1]];

      const kingPath: [number, number][] = [[row, from[1] + 1], to];

      if (
        rookPiece?.substring(1, 2) === "R" &&
        board[row][from[1] + 1] === null &&
        board[row][from[1] + 2] === null &&
        kingPath.every(
          (pos) => !isKingInCheck(board, pos, pieceColor, castleState)
        )
      ) {
        return true;
      }
    }
  }

  if (to[0] === from[0] && to[1] === from[1] - 2) {
    if (!castleState[1]) {
      const rookPosition = [row, from[1] - 4];
      const rookPiece = board[rookPosition[0]][rookPosition[1]];

      const kingPath: [number, number][] = [[row, from[1] - 1], to];

      if (
        rookPiece?.substring(1, 2) === "R" &&
        board[row][from[1] - 1] === null &&
        board[row][from[1] - 2] === null &&
        board[row][from[1] - 3] === null &&
        kingPath.every(
          (pos) => !isKingInCheck(board, pos, pieceColor, castleState)
        )
      ) {
        return true;
      }
    }
  }

  return Math.abs(from[0] - to[0]) <= 1 && Math.abs(from[1] - to[1]) <= 1;
};

const queenMove = (
  from: [number, number],
  to: [number, number],
  board: Board
) => {
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

  return (
    Math.abs(from[0] - to[0]) === Math.abs(from[1] - to[1]) ||
    from[0] === to[0] ||
    from[1] === to[1]
  );
};

const rookMove = (
  from: [number, number],
  to: [number, number],
  board: Board
) => {
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
  return from[0] === to[0] || from[1] === to[1];
};

const bishopMove = (
  from: [number, number],
  to: [number, number],
  board: Board
) => {
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

  return Math.abs(from[0] - to[0]) === Math.abs(from[1] - to[1]);
};

const knightMove = (from: [number, number], to: [number, number]) => {
  return (
    (Math.abs(from[0] - to[0]) === 2 && Math.abs(from[1] - to[1]) === 1) ||
    (Math.abs(from[0] - to[0]) === 1 && Math.abs(from[1] - to[1]) === 2)
  );
};

const pawnMove = (
  from: [number, number],
  to: [number, number],
  board: Board,
  pieceColor: "white" | "black",
  lastMove: Move | null
) => {
  const forward = pieceColor === "white" ? -1 : 1;

  if (lastMove !== null) {
    const lastMoveWasDoubleStepPawn =
      board[lastMove.to[0]][lastMove.to[1]] ===
        (pieceColor === "white" ? "bP" : "wP") &&
      Math.abs(lastMove.from[0] - lastMove.to[0]) === 2;
    const enPassantRow = pieceColor === "white" ? 3 : 4;
    if (
      lastMoveWasDoubleStepPawn &&
      from[0] === enPassantRow &&
      Math.abs(from[1] - lastMove.to[1]) === 1 &&
      to[1] === lastMove.to[1] &&
      ((pieceColor === "white" && to[0] === from[0] - 1) ||
        (pieceColor === "black" && to[0] === from[0] + 1))
    )
      return true;
  }

  const isCaptureMove =
    Math.abs(from[1] - to[1]) === 1 && to[0] - from[0] === forward;
  if (isCaptureMove) {
    const targetSquare = board[to[0]][to[1]];
    const thisSquare = board[from[0]][from[1]];
    return (
      targetSquare !== null &&
      thisSquare !== null &&
      isEnemyPiece(thisSquare.substring(0, 1), targetSquare.substring(0, 1))
    );
  }

  const isForwardMove = from[1] === to[1] && to[0] - from[0] === forward;
  if (isForwardMove) {
    return board[to[0]][to[1]] === null;
  }

  if (
    pieceColor === "white" &&
    from[0] === 6 &&
    from[1] === to[1] &&
    to[0] === 4
  ) {
    return board[5][to[1]] === null && board[4][to[1]] === null;
  }

  if (
    pieceColor === "black" &&
    from[0] === 1 &&
    from[1] === to[1] &&
    to[0] === 3
  ) {
    return board[2][to[1]] === null && board[3][to[1]] === null;
  }

  return false;
};

const pieceMoves: {
  [key: string]: (
    from: [number, number],
    to: [number, number],
    board: Board,
    pieceColor: "white" | "black",
    lastMove: Move | null,
    castleState: [boolean, boolean]
  ) => boolean;
} = {
  K: (from, to, board, pieceColor, lastMove, castleState) =>
    kingMove(from, to, board, pieceColor, castleState),
  Q: (from, to, board) => queenMove(from, to, board),
  R: (from, to, board) => rookMove(from, to, board),
  B: (from, to, board) => bishopMove(from, to, board),
  N: (from, to) => knightMove(from, to),
  P: (from, to, board, pieceColor, lastMove) =>
    pawnMove(from, to, board, pieceColor, lastMove),
};

const isKingInCheck = (
  board: Board,
  kingPosition: [number, number],
  player: "white" | "black",
  castleState: [boolean, boolean]
): boolean => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.startsWith(player === "white" ? "b" : "w")) {
        const pieceType = piece.substring(1, 2);

        const canMoveToKing = pieceMoves[pieceType](
          kingPosition,
          [row, col],
          board,
          player,
          null,
          castleState
        );

        if (canMoveToKing) {
          return true;
        }
      }
    }
  }
  return false;
};

export const checkCheckmate = (
  board: Board,
  player: "white" | "black",
  lastMove: Move | null,
  castleState: [boolean, boolean]
): boolean => {
  if (
    !isKingInCheck(board, getKingPosition(board, player), player, castleState)
  )
    return false;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.startsWith(player === "white" ? "w" : "b")) {
        const from: [number, number] = [row, col];
        const legalMoves = getLegalMoves(
          from,
          board,
          player,
          lastMove,
          castleState
        );

        for (const to of legalMoves) {
          const move: Move = { from, to };
          const simulatedBoard = simulateMove(board, move);
          if (
            !isKingInCheck(
              simulatedBoard,
              getKingPosition(simulatedBoard, player),
              player,
              castleState
            )
          ) {
            return false;
          }
        }
      }
    }
  }

  return true;
};

export const checkStalemate = (
  board: Board,
  player: "white" | "black",
  lastMove: Move | null,
  castleState: [boolean, boolean]
): boolean => {
  if (
    isKingInCheck(board, getKingPosition(board, player), player, castleState)
  ) {
    return false;
  }

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.startsWith(player === "white" ? "w" : "b")) {
        const from: [number, number] = [row, col];
        const legalMoves = getLegalMoves(
          from,
          board,
          player,
          lastMove,
          castleState
        );

        for (const to of legalMoves) {
          const move: Move = { from, to };
          const simulatedBoard = simulateMove(board, move);

          if (
            !isKingInCheck(
              simulatedBoard,
              getKingPosition(simulatedBoard, player),
              player,
              castleState
            )
          ) {
            return false;
          }
        }
      }
    }
  }

  return true;
};

export const isPromotionMove = (board: Board, move: Move) => {
  const newBoard = board;
  const piece = newBoard[move.from[0]][move.from[1]];

  if (
    piece?.substring(1, 2) === "P" &&
    (move.to[0] === 0 || move.to[0] === 7)
  ) {
    return true;
  }

  return false;
};

const simulateMove = (board: Board, move: Move): Board => {
  const newBoard = board.map((row) => [...row]);
  const piece = newBoard[move.from[0]][move.from[1]];

  newBoard[move.to[0]][move.to[1]] = piece;
  newBoard[move.from[0]][move.from[1]] = null;

  return newBoard;
};

const getKingPosition = (
  board: Board,
  player: "white" | "black"
): [number, number] => {
  const kingPiece = player === "white" ? "wK" : "bK";

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === kingPiece) {
        return [row, col];
      }
    }
  }

  throw new Error(`King not found for ${player}`);
};

export const isValidMove = (
  move: Move,
  board: Board,
  player: "white" | "black",
  lastMove: Move | null,
  castleState: [boolean, boolean]
): boolean => {
  const piece = board[move.from[0]][move.from[1]];
  if (!piece) return false;
  if (move.from[0] === move.to[0] && move.from[1] === move.to[1]) return false;
  if (
    board[move.from[0]][move.from[1]]?.substring(0, 1) ===
    board[move.to[0]][move.to[1]]?.substring(0, 1)
  )
    return false;

  const pieceColor = piece.substring(0, 1) === "w" ? "white" : "black";

  if (pieceColor !== player) return false;

  if (!pieceMoves[piece.substring(1, 2)]) return false;
  if (
    !pieceMoves[piece.substring(1, 2)](
      move.from,
      move.to,
      board,
      player,
      lastMove,
      castleState
    )
  )
    return false;

  const simulatedBoard = simulateMove(board, move);
  const kingPosition = getKingPosition(simulatedBoard, player);
  if (isKingInCheck(simulatedBoard, kingPosition, player, castleState)) {
    return false;
  }

  return true;
};

export const getLegalMoves = (
  from: [number, number],
  board: Board,
  player: "white" | "black",
  lastMove: Move | null,
  castleState: [boolean, boolean]
): [number, number][] => {
  const legalMoves: [number, number][] = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const move: Move = { from, to: [row, col] };
      if (isValidMove(move, board, player, lastMove, castleState)) {
        const simulatedBoard = simulateMove(board, move);

        if (
          !isKingInCheck(
            simulatedBoard,
            getKingPosition(simulatedBoard, player),
            player,
            castleState
          )
        ) {
          legalMoves.push([row, col]);
        }
      }
    }
  }

  return legalMoves;
};

export const makeMove = (
  move: Move,
  board: Board,
  promotionPiece?: PromotionPiece
) => {
  const newBoard = board;
  const piece = newBoard[move.from[0]][move.from[1]];

  if (piece?.substring(1, 2) === "K" && move.to[1] === move.from[1] + 2) {
    newBoard[move.to[0]][move.to[1]] = piece;
    newBoard[move.from[0]][move.from[1]] = null;
    newBoard[move.from[0]][move.to[1] - 1] =
      newBoard[move.from[0]][move.from[1] + 3];
    newBoard[move.from[0]][move.from[1] + 3] = null;
  } else if (
    piece?.substring(1, 2) === "K" &&
    move.to[1] === move.from[1] - 2
  ) {
    newBoard[move.to[0]][move.to[1]] = piece;
    newBoard[move.from[0]][move.from[1]] = null;
    newBoard[move.from[0]][move.to[1] + 1] =
      newBoard[move.from[0]][move.from[1] - 4];
    newBoard[move.from[0]][move.from[1] - 4] = null;
  } else if (isPromotionMove(newBoard, move) && piece != null) {
    if (promotionPiece) {
      const promotedPiece = (piece[0] + promotionPiece) as Piece;
      newBoard[move.to[0]][move.to[1]] = promotedPiece;
    }
    newBoard[move.from[0]][move.from[1]] = null;
  } else if (piece?.substring(1, 2) === "P") {
    const forward = piece?.substring(0, 1) === "w" ? -1 : 1;

    if (
      Math.abs(move.from[1] - move.to[1]) === 1 &&
      newBoard[move.to[0]][move.to[1]] === null
    ) {
      newBoard[move.to[0] - forward][move.to[1]] = null;
    }
    newBoard[move.to[0]][move.to[1]] = piece;
    newBoard[move.from[0]][move.from[1]] = null;
  } else {
    newBoard[move.to[0]][move.to[1]] = piece;
    newBoard[move.from[0]][move.from[1]] = null;
  }

  return newBoard;
};

export const updateCastleState = (
  move: Move,
  piece: Piece,
  capturedPiece: Piece,
  castleState: {
    white: { kingSideCastle: boolean; queenSideCastle: boolean };
    black: { kingSideCastle: boolean; queenSideCastle: boolean };
  },
  currentPlayer: "white" | "black"
) => {
  const enemyColor = currentPlayer === "white" ? "black" : "white";

  if (piece?.substring(1, 2) === "K") {
    castleState[currentPlayer].kingSideCastle = true;
    castleState[currentPlayer].queenSideCastle = true;
  }

  if (piece?.substring(1, 2) === "R") {
    if (move.from[1] === 0) {
      castleState[currentPlayer].queenSideCastle = true;
    } else if (move.from[1] === 7) {
      castleState[currentPlayer].kingSideCastle = true;
    }
  }
  if (capturedPiece?.substring(1, 2) === "R") {
    if (move.to[0] === (enemyColor === "white" ? 7 : 0) && move.to[1] === 0) {
      castleState[enemyColor].queenSideCastle = true;
    } else if (
      move.to[0] === (enemyColor === "white" ? 7 : 0) &&
      move.to[1] === 7
    ) {
      castleState[enemyColor].kingSideCastle = true;
    }
  }

  return castleState;
};
