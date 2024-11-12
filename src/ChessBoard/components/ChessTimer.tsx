import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import { Box, Typography } from "@mui/material";
import React from "react";
import { useChessContext } from "../../ChessLogic/ChessContext";
import { ChessBoardProps } from "../ChessGame";

const ChessTimer: React.FC<ChessBoardProps> = ({ squareSize }) => {
  const { currentPlayer, whiteTime, blackTime, gameStarted } =
    useChessContext();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 100);

    if (time <= 30000) {
      return `:${seconds < 10 ? "0" : ""}${seconds}.${milliseconds}`;
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
            justifyContent: "space-evenly",
            bgcolor: currentPlayer === "black" ? "#2d2d2d" : "#2d2d2d80",
            borderRadius: "6px",
            alignItems: "center",
          }}
        >
          <TimerOutlinedIcon
            sx={{
              color: currentPlayer === "black" ? "#ffffff" : "#ffffffcc",
              fontSize: "large",
            }}
          />
          <Typography
            fontSize={squareSize / 4}
            sx={{
              color: currentPlayer === "black" ? "#ffffff" : "#ffffffcc",
            }}
          >
            {gameStarted ? formatTime(blackTime) : "- - : - -"}
          </Typography>
        </Box>
        <Box
          height={squareSize / 2}
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            bgcolor: currentPlayer === "white" ? "#ffffff" : "#ffffff80",
            borderRadius: "6px",
            alignItems: "center",
          }}
        >
          <TimerOutlinedIcon
            sx={{
              color: currentPlayer === "white" ? "#2d2d2d" : "#2d2d2dcc",
              fontSize: "large",
            }}
          />
          <Typography
            fontSize={squareSize / 4}
            sx={{
              color: currentPlayer === "white" ? "#2d2d2d" : "#2d2d2dcc",
            }}
          >
            {gameStarted ? formatTime(whiteTime) : "- - : - -"}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default ChessTimer;
