import { Box, Tooltip, Typography } from "@mui/material";
import React from "react";
import { useChessContext } from "../../ChessLogic/ChessContext";
import { useStockfishContext } from "../../ChessLogic/StockfishContext";
import { ChessBoardProps } from "../ChessGame";

const EvaluationBar: React.FC<ChessBoardProps> = ({ squareSize }) => {
  const { evaluation, mate } = useStockfishContext();
  const { isCheckmate, isStalemate } = useChessContext();

  const maxEvaluation = 10;
  const normalizedEval = Math.max(
    Math.min(evaluation, maxEvaluation),
    -maxEvaluation
  );

  const whitePercentage = isStalemate
    ? 50
    : mate === null
    ? ((normalizedEval + maxEvaluation) / (2 * maxEvaluation)) * 100
    : mate > 0
    ? 100
    : 0;
  const blackPercentage =
    mate === null ? 100 - whitePercentage : mate < 0 ? 100 : 0;

  return (
    <Tooltip
      title={
        whitePercentage === 100 && isCheckmate
          ? `1-0`
          : blackPercentage === 100 && isCheckmate
          ? `0-1`
          : isStalemate
          ? `0`
          : mate
          ? `Mate in ${Math.abs(mate)}`
          : `${Math.abs(evaluation)}`
      }
      placement="right"
    >
      <Box
        width={squareSize / 3.5}
        height={squareSize * 8}
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column-reverse",
          transition: "height 1s ease-in-out",
        }}
      >
        <Box
          sx={{
            bgcolor: "white",
            height: `${whitePercentage}%`,
            transition: "height 1s ease-in-out",
            display: "flex",
            justifyContent: evaluation > 0 ? "flex-end" : "flex-start",
            alignItems: "center",
            padding: mate && mate < 0 ? "0px" : "10px",
            position: "relative",
          }}
        >
          <Typography
            sx={{
              position: "absolute",
              fontSize: squareSize / 12,
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              paddingBottom: "3px",
              color: "black",
            }}
          >
            {whitePercentage === 100 && isCheckmate
              ? `1-0`
              : isStalemate
              ? `0`
              : mate && mate > 0
              ? `M${Math.abs(mate)}`
              : evaluation > 0
              ? `${evaluation}`
              : ``}
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: "#2d2d2d",
            height: `${blackPercentage}%`,
            transition: "height 1s ease-in-out",
            display: "flex",
            justifyContent: evaluation < 0 ? "flex-start" : "flex-end",
            alignItems: "center",
            padding: mate && mate > 0 ? "0px" : "10px",
            position: "relative",
          }}
        >
          <Typography
            sx={{
              position: "absolute",
              fontSize: squareSize / 12,
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              color: "white",
              paddingTop: "3px",
            }}
          >
            {blackPercentage === 100 && isCheckmate
              ? `0-1`
              : isStalemate
              ? `0`
              : mate && mate < 0
              ? `M${Math.abs(mate)}`
              : evaluation < 0
              ? `${Math.abs(evaluation)}`
              : ``}
          </Typography>
        </Box>
      </Box>
    </Tooltip>
  );
};
export default EvaluationBar;
