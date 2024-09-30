import React from "react";
import ChessBoard from "./ChessBoard";
import { useChessContext } from "./ChessContext";

const ChessGame: React.FC = () => {
  const { board, currentPlayer, legalMoves, handleMove, handleLegalMove } =
    useChessContext();

  return (
    <div>
      <ChessBoard
        board={board}
        currentPlayer={currentPlayer}
        legalMoves={legalMoves}
        handleMove={handleMove}
        handleLegalMove={handleLegalMove}
      />
    </div>
  );
};

export default ChessGame;
