import { Board, Move } from "./types";

let halfMoveClock = 0;
let fullMoveNumber = 1;

export const boardToFEN = (
    board: Board, 
    currentPlayer: 'white' | 'black', 
    castlingAvailability: string, 
    enPassantTarget: string, 
    halfMoveClock: string, 
    fullMoveNumber: string
  ): string => {
    let fen = '';
  
    for (let row = 0; row < 8; row++) {
      let emptyCount = 0;
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col]?.substring(0,1) === "w" ? board[row][col]?.toUpperCase() : board[row][col]?.toLowerCase();
        if (piece) {
          if (emptyCount > 0) {
            fen += emptyCount.toString();
            emptyCount = 0;
          }
          fen += piece.substring(1,2) || ''; 
        } else {
          emptyCount++;
        }
      }
      if (emptyCount > 0) {
        fen += emptyCount.toString();
      }
      if (row < 7) fen += '/'; 
    }
    const activeColor = currentPlayer === 'white' ? 'w' : 'b';  
    const castling = castlingAvailability || '-';
    const enPassant = enPassantTarget || '-';
    const halfMove = halfMoveClock;
    const fullMove = fullMoveNumber;
    fen += ` ${activeColor} ${castling} ${enPassant} ${halfMove} ${fullMove}`;
    return fen;
  };
  
  export function getCastlingAvailability(castleState: {     
    white: {
      king: boolean,
      rookKingside: boolean,
      rookQueenside: boolean,
    },
      black: {
        king: boolean,
        rookKingside: boolean,
        rookQueenside: boolean,
    }},
  ): string {
    let castling = "";
    if (!castleState.white.king && !castleState.white.rookKingside)
      castling += "K";
    if (!castleState.white.king && !castleState.white.rookQueenside)
      castling += "Q";
    if (!castleState.black.king && !castleState.black.rookKingside)
      castling += "k";
    if (!castleState.black.king && !castleState.black.rookQueenside)
      castling += "q";

    return castling || "-";
  }
  
  export function getEnPassantTarget(
    lastMove: Move | null,
    piece: string | null,
  ): string {
    if (lastMove !== null && piece !== null) {
      if (piece === "wP" && lastMove.from[0] === 6 && lastMove.to[0] === 4) {
        const targetSquare = `${String.fromCharCode(97 + lastMove.to[1])}3`;
        return `${targetSquare}`;
      } else if (
        piece === "bP" &&
        lastMove.from[0] === 1 &&
        lastMove.to[0] === 3
      ) {
        const targetSquare = `${String.fromCharCode(97 + lastMove.to[1])}6`;
        return `${targetSquare}`;
      }
    }  
    return "";
  }

  
  export function getHalfMoveClock(piece: string | null, isCapture: boolean) {
    if (piece?.substring(1, 2) === "P" || isCapture) {
      halfMoveClock = 0;
    } else {
      halfMoveClock++;
    }
    return halfMoveClock.toString();
  }
  
  export function getFullMoveNumber(currentPlayer: "white" | "black") {
    if (currentPlayer === "black") {
      fullMoveNumber++;
    }
    return fullMoveNumber.toString();
  }

  export function resetFENCounters() {
    halfMoveClock = 0;
    fullMoveNumber = 1;
  }