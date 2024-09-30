import React from "react";
import ChessBoard from "./ChessBoard";
import { useChessContext } from "./ChessContext";

const ChessGame: React.FC = () => {
  const { board, currentPlayer, legalMoves, handleMove, handleLegalMove } =
    useChessContext();

  return (
    <>
      <ChessBoard
        board={board}
        currentPlayer={currentPlayer}
        legalMoves={legalMoves}
        handleMove={handleMove}
        handleLegalMove={handleLegalMove}
      />
    </>
  );
};

export default ChessGame;
