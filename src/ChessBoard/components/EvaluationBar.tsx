import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useStockfishContext } from "../../ChessLogic/StockfishContext";
import { ChessBoardProps } from "../ChessGame";

const EvaluationBar: React.FC<ChessBoardProps> = ({ squareSize }) => {
  const { evaluation, mate } = useStockfishContext();

  const maxEvaluation = 10;
  const normalizedEval = Math.max(
    Math.min(evaluation, maxEvaluation),
    -maxEvaluation
  );

  const whitePercentage =
    mate === null
      ? ((normalizedEval + maxEvaluation) / (2 * maxEvaluation)) * 100
      : mate > 0
      ? 100
      : 0;
  const blackPercentage =
    mate === null ? 100 - whitePercentage : mate < 0 ? 100 : 0;

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box
        width="35px"
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
            backgroundColor: "white",
            height: `${whitePercentage}%`,
            transition: "height 1s ease-in-out",
            display: "flex",
            justifyContent: evaluation > 0 ? "flex-end" : "flex-start",
            alignItems: "center",
            color: "black",
            padding: "10px",
            position: "relative",
          }}
        >
          <Typography
            sx={{
              position: "absolute",
              fontSize: "10px",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {mate && mate > 0
              ? `M${Math.abs(mate)}`
              : evaluation > 0
              ? `${evaluation.toFixed(2)}`
              : ``}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: "black",
            height: `${blackPercentage}%`,
            transition: "height 1s ease-in-out",
            display: "flex",
            justifyContent: evaluation < 0 ? "flex-start" : "flex-end",
            alignItems: "center",
            color: "white",
            padding: "10px",
            position: "relative",
          }}
        >
          <Typography
            sx={{
              position: "absolute",
              fontSize: "10px",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {mate && mate < 0
              ? `M${Math.abs(mate)}`
              : evaluation < 0
              ? `${evaluation.toFixed(2)}`
              : ``}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
export default EvaluationBar;
