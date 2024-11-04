import React, { useState, useEffect } from "react";
import { useChessContext } from "../../ChessLogic/ChessContext";
import { Box, Grid2, Typography } from "@mui/material";
import { ChessBoardProps } from "../ChessGame";

const ChessTimer: React.FC<ChessBoardProps> = ({ squareSize }) => {
  const { currentPlayer, isGameActive } = useChessContext();

  const [time, setTime] = useState(300);
  const [whiteTime, setWhiteTime] = useState(time * 1000);
  const [blackTime, setBlackTime] = useState(time * 1000);

  useEffect(() => {
    if (!isGameActive) return;

    const timer = setInterval(() => {
      if (currentPlayer === "white") {
        setWhiteTime((prevTime) => Math.max(prevTime - 100, 0));
      } else {
        setBlackTime((prevTime) => Math.max(prevTime - 100, 0));
      }
    }, 100);
    return () => clearInterval(timer);
  }, [currentPlayer, isGameActive]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 100);

    if (time <= 30000) {
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}.${milliseconds}`;
    } else {
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }
  };

  return (
    <>
      <Box
        width={squareSize}
        height={squareSize * 8}
        sx={{ display: "grid", alignContent: "space-between" }}
      >
        <Box
          height={squareSize / 2}
          sx={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: currentPlayer == "black" ? "#2d2d2d" : "#2d2d2d80",
            borderRadius: "6px",
          }}
        >
          <Typography
            fontSize={squareSize / 4}
            sx={{
              alignContent: "center",
              color: "#ffffff",
            }}
          >
            {formatTime(blackTime)}
          </Typography>
        </Box>
        <Box
          height={squareSize / 2}
          sx={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: currentPlayer == "white" ? "#ffffff" : "#ffffff80",
            borderRadius: "6px",
          }}
        >
          <Typography
            fontSize={squareSize / 4}
            sx={{
              alignContent: "center",
              color: "#2d2d2d",
            }}
          >
            {formatTime(whiteTime)}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default ChessTimer;
