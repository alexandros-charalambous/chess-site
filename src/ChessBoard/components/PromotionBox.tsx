import React from "react";
import { Box } from "@mui/material";
import { useChessContext } from "../../ChessLogic/ChessContext";
import { ChessBoardProps } from "../ChessGame";
import { pieceImages } from "../../ChessLogic/chessUtils";
import { PromotionPiece } from "../../ChessLogic/types";
import CloseIcon from "@mui/icons-material/Close";

interface PromotionBoxProps extends ChessBoardProps {
  cursorPos: { x: number; y: number };
  onSelectPromotion: (piece: PromotionPiece) => void;
  onCancelPromotion: () => void;
}

const PromotionBox: React.FC<PromotionBoxProps> = ({
  squareSize,
  cursorPos,
  onSelectPromotion,
  onCancelPromotion,
}) => {
  const { currentPlayer } = useChessContext();
  const color = currentPlayer === "white" ? "w" : "b";

  const promotionPieces: PromotionPiece[] = ["Q", "R", "N", "B"];

  return (
    <Box
      sx={{
        position: "fixed",
        top: cursorPos.y,
        left: cursorPos.x,
        transform:
          color == "w" ? "translate(-50%, 0%)" : "translate(-50%, -100%)",
        zIndex: 100,
        backgroundColor: "#dbdbdbcc",
        boxShadow: "0px 0px 10px 3px rgba(0, 0, 0, 0.5)",
        display: "flex",
        flexDirection: color == "w" ? "column" : "column-reverse",
        alignItems: "center",
      }}
    >
      {promotionPieces.map((piece) => (
        <Box
          key={piece}
          sx={{
            width: squareSize,
            height: squareSize,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
          onClick={() => onSelectPromotion(piece)}
        >
          <img
            src={pieceImages[`${color}${piece}`]}
            alt={`${color}${piece}`}
            draggable={false}
            style={{
              width: "80%",
              height: "80%",
            }}
          />
        </Box>
      ))}
      <Box
        sx={{
          width: squareSize,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          "&:hover": { backgroundColor: "#f0f0f0" },
        }}
        onClick={() => onCancelPromotion()}
      >
        <CloseIcon />
      </Box>
    </Box>
  );
};

export default PromotionBox;
