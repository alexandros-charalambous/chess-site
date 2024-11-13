import { Circle } from "@mui/icons-material";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { Box } from "@mui/material/";
import React, { useEffect, useState } from "react";
import { useChessContext } from "../../ChessLogic/ChessContext";
import { pieceImages } from "../../ChessLogic/chessUtils";
import { PromotionPiece } from "../../ChessLogic/types";
import { ChessBoardProps } from "../ChessGame";
import PromotionBox from "./PromotionBox";

const ChessBoard: React.FC<ChessBoardProps> = ({ squareSize }) => {
  const {
    gameState,
    board,
    currentPlayer,
    promotionSquare,
    promotionMove,
    legalMoves,
    handleMove,
    completeMove,
    cancelPromotion,
    handleLegalMove,
    resetLegalMove,
    moveHistory,
    currentMoveIndex,
  } = useChessContext();

  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(
    null
  );
  const [selectedPiece, setSelectedPiece] = useState<null | {
    from: [number, number];
    piece: string;
  }>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [promotionPosition, setPromotionPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [hoveredSquare, setHoveredSquare] = useState<[number, number] | null>(
    null
  );

  //Tracks the mouse position always
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setCursorPos({ x: event.clientX, y: event.clientY });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (promotionSquare) {
      setPromotionPosition(cursorPos);
    }
  }, [promotionSquare]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setCursorPos({ x: event.clientX, y: event.clientY });

      const boardRect = document
        .getElementById("chessboardSquare")
        ?.getBoundingClientRect();
      if (boardRect) {
        const x = event.clientX - boardRect.left;
        const y = event.clientY - boardRect.top;

        const col = Math.floor(x / squareSize);
        const row = Math.floor(y / squareSize);

        if (row >= 0 && row < 8 && col >= 0 && col < 8) {
          setHoveredSquare([row, col]);
        } else {
          setHoveredSquare(null);
        }
      }
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDragging, squareSize]);

  const isLegalMove = (from: [number, number]) =>
    legalMoves.some((move) => move[0] === from[0] && move[1] === from[1]);

  const getSquareColor = (from: [number, number]) => {
    if (
      currentMoveIndex !== 0 &&
      (JSON.stringify(moveHistory[currentMoveIndex].move.from) ===
        JSON.stringify(from) ||
        JSON.stringify(moveHistory[currentMoveIndex].move.to) ===
          JSON.stringify(from))
    ) {
      return "#faff9f";
    }
    return (from[0] + from[1]) % 2 === 0 ? "#f0d9b5" : "#b58863";
  };

  const isSelected = (from: [number, number]) => {
    if (gameState === "start" || gameState === "active") {
      return (
        selectedSquare &&
        selectedSquare[0] === from[0] &&
        selectedSquare[1] === from[1]
      );
    }
  };

  const handleSquareDrop = (from: [number, number], event?: MouseEvent) => {
    if (
      (gameState === "start" || gameState === "active") &&
      currentMoveIndex === moveHistory.length - 1
    ) {
      if (event && event.button === 2) {
        resetDragState();
        resetLegalMove();
        return;
      }

      if (selectedPiece) {
        const selectedPieceFrom: [number, number] = selectedPiece.from;
        const to: [number, number] = [from[0], from[1]];

        if (isDragging) {
          if (isLegalMove(to)) {
            handleMove(selectedPieceFrom, to);
          }
          resetDragState();
        } else {
          handleMove(selectedPieceFrom, to);
        }
      }
    }
  };

  const handleDragStart = (
    from: [number, number],
    piece: string,
    event: React.MouseEvent
  ) => {
    if (
      (gameState === "start" || gameState === "active") &&
      currentMoveIndex === moveHistory.length - 1
    ) {
      if (event.button === 0) {
        setSelectedPiece({ from: [from[0], from[1]], piece });
        setSelectedSquare([from[0], from[1]]);
        setIsDragging(true);
        handleLegalMove([from[0], from[1]]);
      }
    }
  };

  const handleSquareClick = (from: [number, number]) => {
    if (
      (gameState === "start" || gameState === "active") &&
      currentMoveIndex === moveHistory.length - 1
    ) {
      const piece = board[from[0]][from[1]];

      if (
        (piece?.substring(0, 1) === "w" && currentPlayer === "white") ||
        (piece?.substring(0, 1) === "b" && currentPlayer === "black")
      ) {
        setSelectedPiece({ from: [from[0], from[1]], piece });
        setSelectedSquare([from[0], from[1]]);
        handleLegalMove([from[0], from[1]]);
      } else if (selectedPiece) {
        handleSquareDrop([from[0], from[1]]);
      }
    }
  };

  const resetDragState = () => {
    if (
      (gameState === "start" || gameState === "active") &&
      currentMoveIndex === moveHistory.length - 1
    ) {
      setSelectedPiece(null);
      setSelectedSquare(null);
      setIsDragging(false);
      setHoveredSquare(null);
      resetLegalMove();
    }
  };

  const handleRightClick = (event: React.MouseEvent) => {
    if (gameState === "start" || gameState === "active") {
      event.preventDefault();
      resetDragState();
      resetLegalMove();
    }
  };

  const handleMouseUp = (from: [number, number], event: React.MouseEvent) => {
    if (
      (gameState === "start" || gameState === "active") &&
      currentMoveIndex === moveHistory.length - 1
    ) {
      handleSquareDrop(from, event.nativeEvent);
    }
  };

  return (
    <>
      {promotionSquare && promotionMove && (
        <PromotionBox
          squareSize={squareSize}
          cursorPos={promotionPosition}
          onSelectPromotion={(piece?: PromotionPiece) =>
            completeMove(promotionMove.from, promotionMove.to, piece)
          }
          onCancelPromotion={() => cancelPromotion()}
        />
      )}
      <Box
        id="chessboardSquare"
        sx={{
          width: squareSize * 8,
          height: squareSize * 8,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.6)",
          userSelect: "none",
          zIndex: "1",
          position: "relative",
        }}
        onContextMenu={handleRightClick}
      >
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => (
            <Box
              key={`${rowIndex}-${colIndex}`}
              sx={{
                width: squareSize,
                height: squareSize,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: getSquareColor([rowIndex, colIndex]),
                boxShadow:
                  isSelected([rowIndex, colIndex]) ||
                  (hoveredSquare &&
                    hoveredSquare[0] === rowIndex &&
                    hoveredSquare[1] === colIndex &&
                    isDragging)
                    ? "0px 0px 0px 6px #ffffff inset"
                    : "none",
              }}
              onMouseEnter={() => setHoveredSquare([rowIndex, colIndex])}
              onMouseLeave={() => setHoveredSquare(null)}
              onDrop={(e) =>
                handleSquareDrop([rowIndex, colIndex], e.nativeEvent)
              }
              onMouseUp={(e) => handleMouseUp([rowIndex, colIndex], e)}
              onClick={() => handleSquareClick([rowIndex, colIndex])}
            >
              {piece ? (
                <>
                  <img
                    src={pieceImages[piece]}
                    alt={piece}
                    draggable={false}
                    onMouseDown={(event) =>
                      handleDragStart([rowIndex, colIndex], piece, event)
                    }
                    style={{
                      width: piece?.substring(1, 2) === "P" ? "70%" : "80%",
                      height: piece?.substring(1, 2) === "P" ? "70%" : "80%",
                      opacity:
                        isDragging && isSelected([rowIndex, colIndex]) ? 0 : 1,
                    }}
                  />
                  <CircleOutlinedIcon
                    sx={{
                      position: "absolute",
                      fontSize: squareSize / 0.84,
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
                    fontSize: squareSize / 2.5,
                    display: isLegalMove([rowIndex, colIndex])
                      ? "flex"
                      : "none",
                    color: "#0000005e",
                  }}
                />
              )}
            </Box>
          ))
        )}
      </Box>

      {isDragging && selectedPiece && (
        <Box
          sx={{
            position: "fixed",
            left:
              selectedPiece.piece?.substring(1, 2) === "P"
                ? cursorPos.x - (squareSize * 7.5) / 10 / 2
                : cursorPos.x - (squareSize * 8.5) / 10 / 2,
            top:
              selectedPiece.piece?.substring(1, 2) === "P"
                ? cursorPos.y - (squareSize * 7.5) / 10 / 2
                : cursorPos.y - (squareSize * 8.5) / 10 / 2,
            pointerEvents: "none",
            zIndex: 9999,
          }}
        >
          <img
            src={pieceImages[selectedPiece.piece]}
            alt={selectedPiece.piece}
            style={{
              width:
                selectedPiece.piece?.substring(1, 2) === "P"
                  ? (squareSize * 7.5) / 10
                  : (squareSize * 8.5) / 10,
              height:
                selectedPiece.piece?.substring(1, 2) === "P"
                  ? (squareSize * 7.5) / 10
                  : (squareSize * 8.5) / 10,
            }}
          />
        </Box>
      )}
    </>
  );
};

export default ChessBoard;
