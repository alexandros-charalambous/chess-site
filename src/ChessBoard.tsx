import { Box } from "@mui/material";
import React, { useState } from "react";
import { getLegalMoves } from "./ChessLogic/chessLogic";
import { pieceImages } from "./ChessLogic/chessUtils";
import { Board, Move, Piece } from "./ChessLogic/types";

interface ChessBoardProps {
  board: Board;
  currentPlayer: "white" | "black";
  lastMove: Move | null;
  onMove: (from: [number, number], to: [number, number]) => void;
}

const ChessBoard: React.FC<ChessBoardProps> = ({
  board,
  currentPlayer,
  lastMove,
  onMove,
}) => {
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(
    null
  );
  const [selectedPiece, setSelectedPiece] = useState<null | {
    from: [number, number];
    piece: string;
  }>(null);
  const [legalMoves, setLegalMoves] = useState<[number, number][]>([]); // To store the legal moves

  const getSquareColor = (row: number, col: number) => {
    return (row + col) % 2 === 0 ? "#f0d9b5" : "#b58863";
  };

  const getSquareStyle = (row: number, col: number) => {
    const isSelected =
      selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col;
    const isLegalMove = legalMoves.some(
      (move) => move[0] === row && move[1] === col
    );
    return {
      boxShadow: isSelected ? "0px 0px 0px 3px #ffffff inset" : "none",
      backgroundColor: isLegalMove ? "lightgreen" : getSquareColor(row, col),
    };
  };

  const getImageStyle = (piece: Piece) => {
    return {
      width: piece?.substring(1, 2) === "P" ? "70%" : "80%",
      height: piece?.substring(1, 2) === "P" ? "70%" : "80%",
    };
  };

  const handleSquareDrop = (row: number, col: number) => {
    if (selectedPiece) {
      const from: [number, number] = selectedPiece.from;
      const to: [number, number] = [row, col];

      onMove(from, to);
      setSelectedPiece(null);
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  const handleDragStart = (row: number, col: number, piece: string) => {
    setSelectedPiece({ from: [row, col], piece });
    setSelectedSquare([row, col]);

    // Calculate and set the legal moves for the selected piece
    const moves = getLegalMoves([row, col], board, currentPlayer, lastMove);
    setLegalMoves(moves);
  };

  const handleSquareClick = (row: number, col: number) => {
    const piece = board[row][col];
    if (
      (piece?.substring(0, 1) === "w" && currentPlayer === "white") ||
      (piece?.substring(0, 1) === "b" && currentPlayer === "black")
    ) {
      setSelectedPiece({ from: [row, col], piece });
      setSelectedSquare([row, col]);

      const moves = getLegalMoves([row, col], board, currentPlayer, lastMove);
      setLegalMoves(moves);
    } else if (selectedPiece) {
      handleSquareDrop(row, col);
    }
  };

  return (
    <Box
      sx={{
        width: 720,
        height: 720,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.6)",
      }}
    >
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => (
          <Box
            key={`${rowIndex}-${colIndex}`}
            sx={{
              width: "90px",
              height: "90px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "30px",
              ...getSquareStyle(rowIndex, colIndex),
            }}
            onDrop={() => handleSquareDrop(rowIndex, colIndex)}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => handleSquareClick(rowIndex, colIndex)}
          >
            {piece && (
              <img
                src={pieceImages[piece]}
                alt={piece}
                draggable
                onDragStart={() => handleDragStart(rowIndex, colIndex, piece)}
                style={{ ...getImageStyle(piece) }}
              />
            )}
          </Box>
        ))
      )}
    </Box>
  );
};

export default ChessBoard;
