import React from "react";
import ChessBoard from "./components/ChessBoard";
import { Box, Grid2, Stack } from "@mui/material";

const ChessGame: React.FC = () => {


  return (
    <Grid2 container direction={"row"}>
      <Grid2 
        sx={{
          justifyContent: "center",
        }}
      ><Box
      sx={{
        width: 10,
        height: 720,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.6)",
        userSelect: "none",
      }}
    ></Box></Grid2>
      <Grid2 
        sx={{
          justifyContent: "center",
        }}
      >
        <ChessBoard />
      </Grid2>
      <Grid2/>
    </Grid2>
  );
};

export default ChessGame;
