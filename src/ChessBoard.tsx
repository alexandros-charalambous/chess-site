import { Box, Container } from "@mui/material";
import React, { useState } from "react";
import { Board } from "./ChessLogic/types";

interface ChessBoardProps {
  board: Board;
  onMove: (from: [number, number], to: [number, number]) => void;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ board, onMove }) => {
  const [selectedPiece, setSelectedPiece] = useState<null | {
    from: [number, number];
    piece: string;
  }>(null);

  const pieceImages: { [key: string]: string } = {
    wP: "/assets/white-pawn.png",
    wR: "/assets/white-rook.png",
    wN: "/assets/white-knight.png",
    wB: "/assets/white-bishop.png",
    wQ: "/assets/white-queen.png",
    wK: "/assets/white-king.png",
    bP: "/assets/black-pawn.png",
    bR: "/assets/black-rook.png",
    bN: "/assets/black-knight.png",
    bB: "/assets/black-bishop.png",
    bQ: "/assets/black-queen.png",
    bK: "/assets/black-king.png",
  };

  const getSquareColor = (row: number, col: number) => {
    return (row + col) % 2 === 0 ? "#f0d9b5" : "#b58863";
  };

  const handleSquareDrop = (row: number, col: number) => {
    if (selectedPiece) {
      const from: [number, number] = selectedPiece.from;
      const to: [number, number] = [row, col];

      onMove(from, to);
      setSelectedPiece(null);
    }
  };

  const handleDragStart = (row: number, col: number, piece: string) => {
    setSelectedPiece({ from: [row, col], piece });
  };

  const handleSquareClick = (row: number, col: number, piece: string) => {
    console.log(`Square clicked: ${row}, ${col}, ${piece}`);
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
              backgroundColor: getSquareColor(rowIndex, colIndex),
              width: "90px",
              height: "90px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "30px",
            }}
            onDrop={() => handleSquareDrop(rowIndex, colIndex)}
            onDragOver={(e) => e.preventDefault()}
          >
            {piece && (
              <img
                src={pieceImages[piece]}
                alt={piece}
                draggable
                onDragStart={() => handleDragStart(rowIndex, colIndex, piece)}
                onClick={() => handleSquareClick(rowIndex, colIndex, piece)}
                style={{ width: "80%", height: "80%" }}
              />
            )}
          </Box>
        ))
      )}
    </Box>
  );
};

export default ChessBoard;
