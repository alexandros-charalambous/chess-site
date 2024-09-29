import { Button, Container, Grid2, Stack } from "@mui/material";
import React, { useState } from "react";
import ChessBoard from "./ChessBoard";
import { isValidMove, makeMove } from "./ChessLogic/chessLogic";
import { initialBoardSetup } from "./ChessLogic/chessUtils";
import { Board, Move } from "./ChessLogic/types";
import MoveHistory from "./MoveHistory";

const ChessGame: React.FC = () => {
  const [board, setBoard] = useState<Board>(initialBoardSetup);
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">(
    "white"
  );

  const handleMove = (from: [number, number], to: [number, number]) => {
    const move: Move = { from, to };

    if (isValidMove(move, board, currentPlayer, lastMove)) {
      setBoard(makeMove(move, board, lastMove));
      setLastMove(move);
      setCurrentPlayer(currentPlayer === "white" ? "black" : "white");
    }
  };

  const resetBoard = () => {
    setBoard(initialBoardSetup);
    setCurrentPlayer("white");
  };

  return (
    <div>
      <ChessBoard
        board={board}
        currentPlayer={currentPlayer}
        lastMove={lastMove}
        onMove={handleMove}
      />
    </div>
  );
};

export default ChessGame;
