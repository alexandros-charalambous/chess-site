import React from "react";
import ChessBoard from "./ChessBoard";
import { Stack } from "@mui/material";

const ChessGame: React.FC = () => {
  return (
    <Stack
      sx={{
        justifyContent: "center",
        alignItems: "end",
      }}
    >
      <ChessBoard />
    </Stack>
  );
};

export default ChessGame;
