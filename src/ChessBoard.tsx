import { Circle } from "@mui/icons-material";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { Box } from "@mui/material/";
import React, { useState } from "react";
import { useChessContext } from "./ChessContext";
import { pieceImages } from "./ChessLogic/chessUtils";

const ChessBoard: React.FC = () => {
  const { board, currentPlayer, legalMoves, handleMove, handleLegalMove } =
    useChessContext();

  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(
    null
  );
  const [selectedPiece, setSelectedPiece] = useState<null | {
    from: [number, number];
    piece: string;
  }>(null);

  const isLegalMove = (from: [number, number]) =>
    legalMoves.some((move) => move[0] === from[0] && move[1] === from[1]);

  const getSquareColor = (from: [number, number]) => {
    return (from[0] + from[1]) % 2 === 0 ? "#f0d9b5" : "#b58863";
  };

  const isSelected = (from: [number, number]) => {
    return (
      selectedSquare &&
      selectedSquare[0] === from[0] &&
      selectedSquare[1] === from[1]
    );
  };

  const handleSquareDrop = (from: [number, number]) => {
    if (selectedPiece) {
      const selectedPieceFrom: [number, number] = selectedPiece.from;
      const to: [number, number] = [from[0], from[1]];

      handleMove(selectedPieceFrom, to);
      setSelectedPiece(null);
      setSelectedSquare(null);
    }
  };

  const handleDragStart = (from: [number, number], piece: string) => {
    setSelectedPiece({ from: [from[0], from[1]], piece });
    setSelectedSquare([from[0], from[1]]);

    handleLegalMove([from[0], from[1]]);
  };

  const handleSquareClick = (from: [number, number]) => {
    const piece = board[from[0]][from[1]];
    if (
      (piece?.substring(0, 1) === "w" && currentPlayer === "white") ||
      (piece?.substring(0, 1) === "b" && currentPlayer === "black")
    ) {
      setSelectedPiece({ from: [from[0], from[1]], piece });
      setSelectedSquare([from[0], from[1]]);

      handleLegalMove([from[0], from[1]]);
    } else if (selectedPiece) {
      handleLegalMove([from[0], from[1]]);
      handleSquareDrop([from[0], from[1]]);
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
        userSelect: "none",
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
              backgroundColor: getSquareColor([rowIndex, colIndex]),
              boxShadow: isSelected([rowIndex, colIndex])
                ? "0px 0px 0px 6px #ffffff inset"
                : "none",
            }}
            onDrop={() => handleSquareDrop([rowIndex, colIndex])}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => handleSquareClick([rowIndex, colIndex])}
          >
            {piece ? (
              <>
                <img
                  src={pieceImages[piece]}
                  alt={piece}
                  draggable
                  onDragStart={() =>
                    handleDragStart([rowIndex, colIndex], piece)
                  }
                  style={{
                    width: piece?.substring(1, 2) === "P" ? "70%" : "80%",
                    height: piece?.substring(1, 2) === "P" ? "70%" : "80%",
                  }}
                />
                <CircleOutlinedIcon
                  sx={{
                    position: "absolute",
                    fontSize: "108px",
                    display: isLegalMove([rowIndex, colIndex])
                      ? "flex"
                      : "none",
                    color: "#0000005e",
                  }}
                />
              </>
            ) : (
              <Circle
                sx={{
                  fontSize: "36px",
                  display: isLegalMove([rowIndex, colIndex]) ? "flex" : "none",
                  color: "#0000005e",
                }}
              />
            )}
          </Box>
        ))
      )}
    </Box>
  );
};

export default ChessBoard;
