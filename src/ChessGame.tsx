import React, { useState } from "react";
import ChessBoard from "./ChessBoard";
import { initialBoardSetup } from "./ChessLogic/chessUtils";
import { isValidMove, makeMove } from "./ChessLogic/chessLogic";
import { Move, Board } from "./ChessLogic/types";
import { Button, Container, Grid2, Stack } from "@mui/material";

const ChessGame: React.FC = () => {
  const [board, setBoard] = useState<Board>(initialBoardSetup);
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">(
    "white"
  );

  const handleMove = (from: [number, number], to: [number, number]) => {
    const move: Move = { from, to };

    if (isValidMove(move, board, currentPlayer)) {
      setBoard(makeMove(move, board));
      setCurrentPlayer(currentPlayer === "white" ? "black" : "white");
    } else {
      alert("Invalid move!");
    }
  };

  return (
    <div style={{ height: "100%", width: "100%", position: "fixed" }}>
      <Grid2 container>
        <Grid2 size={3}>
          <Container
            sx={{
              height: "100vh",
              backgroundColor: "#6d4500",
            }}
          ></Container>
        </Grid2>
        <Grid2 size={6}>
          <Container
            maxWidth="xl"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              backgroundColor: "#5a3900",
              boxShadow: "inset 0 0 10px 3px rgba(0, 0, 0, 0.6)",
            }}
          >
            <Stack
              spacing={2}
              sx={{
                justifyContent: "center",
                alignItems: "end",
              }}
            >
              <Button variant="outlined">Reset</Button>
              <ChessBoard board={board} onMove={handleMove} />
            </Stack>
          </Container>
        </Grid2>
        <Grid2 size={3}>
          <Container
            sx={{
              height: "100vh",
              backgroundColor: "#6d4500",
            }}
          ></Container>
        </Grid2>
      </Grid2>
    </div>
  );
};

export default ChessGame;
