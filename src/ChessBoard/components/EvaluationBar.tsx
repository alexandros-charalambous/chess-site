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
    <Box
      width={squareSize / 3}
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
          padding: mate && mate > 0 ? "0px" : "10px",
          position: "relative",
        }}
      >
        <Typography
          sx={{
            position: "absolute",
            fontSize: "8px",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "3px",
            color: "black",
          }}
        >
          {mate && mate > 0
            ? `M${Math.abs(mate)}`
            : evaluation > 0
            ? `${evaluation}`
            : ``}
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: "#2d2d2d",
          height: `${blackPercentage}%`,
          transition: "height 1s ease-in-out",
          display: "flex",
          justifyContent: evaluation < 0 ? "flex-start" : "flex-end",
          alignItems: "center",
          padding: mate && mate < 0 ? "0px" : "10px",
          position: "relative",
        }}
      >
        <Typography
          sx={{
            position: "absolute",
            fontSize: "8px",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            padding: "3px",
          }}
        >
          {mate && mate < 0
            ? `M${Math.abs(mate)}`
            : evaluation < 0
            ? `${Math.abs(evaluation)}`
            : ``}
        </Typography>
      </Box>
    </Box>
  );
};
export default EvaluationBar;
