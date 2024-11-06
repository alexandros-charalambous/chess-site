import React from "react";
import { Box } from "@mui/material";
import { useChessContext } from "../../ChessLogic/ChessContext";
import { ChessBoardProps } from "../ChessGame";
import { pieceImages } from "../../ChessLogic/chessUtils";

interface PromotionBoxProps extends ChessBoardProps {
  onSelectPromotion: (piece: string) => void;
}

const PromotionBox: React.FC<ChessBoardProps> = ({ squareSize }) => {
  const { currentPlayer } = useChessContext();
  const color = currentPlayer === "white" ? "w" : "b";

  const promotionPieces =
    currentPlayer === "white" ? ["Q", "R", "N", "B"] : ["B", "N", "R", "Q"];

  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 100,
        backgroundColor: "#dbdbdbcc",
        boxShadow: "0px 0px 10px 3px rgba(0, 0, 0, 0.5)",
        display: "flex",
        flexDirection: "column",
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
          //   onClick={() => onSelectPromotion(`${color}${piece}`)}
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
    </Box>
  );
};

export default PromotionBox;
