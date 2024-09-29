import { Button, Container, Grid2, Stack } from "@mui/material";
import React, { useState } from "react";
import ChessBoard from "./ChessBoard";
import { isValidMove, makeMove } from "./ChessLogic/chessLogic";
import { initialBoardSetup } from "./ChessLogic/chessUtils";
import { Board, Move } from "./ChessLogic/types";
import MoveHistory from "./MoveHistory";

const ChessGame: React.FC = () => {
  const [board, setBoard] = useState<Board>(initialBoardSetup);
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">(
    "white"
  );

  const handleMove = (from: [number, number], to: [number, number]) => {
    const move: Move = { from, to };

    if (isValidMove(move, board, currentPlayer, lastMove)) {
      setBoard(makeMove(move, board, lastMove));
      setLastMove(move);
      setCurrentPlayer(currentPlayer === "white" ? "black" : "white");
    }
  };

  const resetBoard = () => {
    setBoard(initialBoardSetup);
    setCurrentPlayer("white");
  };

  return (
    <div style={{ height: "100%", width: "100%", position: "fixed" }}>
      <Grid2 container>
        <Grid2 size={3}>
          <Container
            sx={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "#4d2e22",
              position: "relative",
              zIndex: "1",
            }}
          >
            <Button variant="contained" color="secondary" onClick={resetBoard}>
              Reset
            </Button>
          </Container>
        </Grid2>
        <Grid2 size={6}>
          <Container
            maxWidth="xl"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              backgroundImage: "url(/assets/wood.jpg)",
              backgroundPosition: "center",
              backgroundSize: "cover",
              boxShadow: "inset 0 0 10px 3px rgba(0, 0, 0, 0.6)",
              userSelect: "none",
            }}
          >
            <Stack
              spacing={2}
              sx={{
                justifyContent: "center",
                alignItems: "end",
              }}
            >
              <ChessBoard board={board} onMove={handleMove} />
            </Stack>
          </Container>
        </Grid2>
        <Grid2 size={3}>
          <Container
            sx={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "#4d2e22",
              position: "relative",
              zIndex: "1",
            }}
          >
            <MoveHistory />
          </Container>
        </Grid2>
      </Grid2>
    </div>
  );
};

export default ChessGame;
