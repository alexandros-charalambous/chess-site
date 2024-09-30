import React, { createContext, useContext, useState } from "react";
import { Board, Move } from "./ChessLogic/types";
import { getLegalMoves, isValidMove, makeMove } from "./ChessLogic/chessLogic";
import { initialBoardSetup } from "./ChessLogic/chessUtils";

interface ChessContextProps {
  board: Board;
  currentPlayer: "white" | "black";
  legalMoves: [number, number][];
  lastMove: Move | null;
  handleMove: (from: [number, number], to: [number, number]) => void;
  handleLegalMove: (from: [number, number]) => void;
  resetBoard: () => void;
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

  const handleMove = (from: [number, number], to: [number, number]) => {
    const move: Move = { from, to };

    if (isValidMove(move, board, currentPlayer, lastMove)) {
      setBoard(makeMove(move, board, lastMove));
      setLastMove(move);
      setCurrentPlayer(currentPlayer === "white" ? "black" : "white");
      setLegalMoves([]);
    }
  };

  const handleLegalMove = (from: [number, number]) => {
    const moves = getLegalMoves(from, board, currentPlayer, lastMove);
    setLegalMoves(moves);
  };

  const resetBoard = () => {
    setBoard(initialBoardSetup);
    setCurrentPlayer("white");
    setLegalMoves([]);
  };

  const value = {
    board,
    currentPlayer,
    legalMoves,
    lastMove,
    handleMove,
    handleLegalMove,
    resetBoard,
  };

  return (
    <ChessContext.Provider value={value}>{children}</ChessContext.Provider>
  );
};

// Custom hook to use the ChessContext
export const useChess = () => {
  return useContext(ChessContext);
};
