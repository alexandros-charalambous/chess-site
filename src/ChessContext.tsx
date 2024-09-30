import React, { createContext, useContext, useState } from "react";
import { Board, Move, MoveHistory } from "./ChessLogic/types";
import { getLegalMoves, isValidMove, makeMove } from "./ChessLogic/chessLogic";
import { initialBoardSetup, initialGameState } from "./ChessLogic/chessUtils";

interface ChessContextProps {
  board: Board;
  currentPlayer: "white" | "black";
  legalMoves: [number, number][];
  lastMove: Move | null;
  handleMove: (from: [number, number], to: [number, number]) => void;
  handleLegalMove: (from: [number, number]) => void;
  resetBoard: () => void;
  moveHistory: MoveHistory[];
}

const ChessContext = createContext<ChessContextProps | undefined>(undefined);

export const useChessContext = () => {
  const context = useContext(ChessContext);
  if (!context) {
    throw new Error("useChessContext must be used within a ChessProvider");
  }
  return context;
};

export const ChessProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [board, setBoard] = useState<Board>(initialBoardSetup);
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">(
    "white"
  );
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const [legalMoves, setLegalMoves] = useState<[number, number][]>([]);
  const [moveHistory, setMoveHistory] = useState<MoveHistory[]>([]);
  const [castlePieceMoved, setCastlePieceMoved] = useState(initialGameState);

  const handleMove = (from: [number, number], to: [number, number]) => {
    const move: Move = { from, to };
    const piece = board[from[0]][from[1]];
    const capturedPiece = board[to[0]][to[1]];

    if (isValidMove(move, board, currentPlayer, lastMove)) {
      setBoard(makeMove(move, board, lastMove));
      setLastMove(move);
      setCurrentPlayer(currentPlayer === "white" ? "black" : "white");
      setLegalMoves([]);
      updateMovementStatus(move, castlePieceMoved);
      setMoveHistory((prevHistory) => [
        ...prevHistory,
        {
          move,
          piece,
          capturedPiece: capturedPiece || undefined,
        },
      ]);
    }
  };

  const updateMovementStatus = (
    move: Move,
    hasMoved: {
      white: { king: boolean; rookKingside: boolean; rookQueenside: boolean };
      black: { king: boolean; rookKingside: boolean; rookQueenside: boolean };
    }
  ) => {
    const piece = board[move.from[0]][move.from[1]];
    const color = piece?.substring(0) === "w" ? "white" : "black";

    if (piece?.substring(1) === "K") {
      hasMoved[color].king = true;
    } else if (piece?.substring(1) === "R") {
      if (move.from[1] === 0) {
        hasMoved[color].rookQueenside = true;
      } else if (move.from[1] === 7) {
        hasMoved[color].rookKingside = true;
      }
    }
    setCastlePieceMoved(hasMoved);
  };

  const handleLegalMove = (from: [number, number]) => {
    const moves = getLegalMoves(from, board, currentPlayer, lastMove);
    setLegalMoves(moves);
  };

  const resetBoard = () => {
    setBoard(initialBoardSetup);
    setCurrentPlayer("white");
    setLegalMoves([]);
    setMoveHistory([]);
    setCastlePieceMoved(initialGameState);
  };

  const value = {
    board,
    currentPlayer,
    legalMoves,
    lastMove,
    handleMove,
    handleLegalMove,
    resetBoard,
    moveHistory,
  };

  return (
    <ChessContext.Provider value={value}>{children}</ChessContext.Provider>
  );
};
