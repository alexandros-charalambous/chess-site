import { Box, Button, Fade, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useChessContext } from "../../ChessLogic/ChessContext";

const ResultBox: React.FC = () => {
  const { gameState, result, startGame } = useChessContext();
  const [resultString, setResultString] = useState("");
  const [boxOpen, setBoxOpen] = useState(false);

  useEffect(() => {
    if (gameState === "end") setBoxOpen(true);
  }, [gameState]);

  useEffect(() => {
    switch (result.method) {
      case "checkmate":
        setResultString(`won by checkmate!`);
        break;
      case "stalemate":
        setResultString(`by stalemate!`);
        break;
      case "insufficient material":
        setResultString(`by insufficient material!`);
        break;
      case "repetition":
        setResultString(`by repetition!`);
        break;
      case "timeout":
        setResultString(`won by time out!`);
        break;
    }
  }, [result]);

  const closeResultBox = () => {
    setBoxOpen(false);
  };

  return (
    <>
      <Fade in={(gameState === "end" && boxOpen) || boxOpen}>
        <Box
          sx={{
            position: "fixed",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 3px 4px 0px #000000",
            width: "25%",
            height: "350px",
            bgcolor: "#2d2d2d",
            borderRadius: 2,
            textAlign: "center",
            zIndex: 100,
            userSelect: "none",
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              padding: 2,
            }}
          >
            <Typography
              variant="h3"
              color="#ffffff"
              sx={{ fontWeight: "bold" }}
            >
              {result.winner}
            </Typography>
            <Typography
              variant="body1"
              color="#a3a3a3"
              sx={{ fontWeight: "bold" }}
            >
              {resultString}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              bgcolor: "#1e1e1e",
              flex: 4,
              p: 2,
            }}
          >
            <Button
              variant="contained"
              sx={{ bgcolor: "green", width: "100%", fontWeight: "bold" }}
              onClick={() => closeResultBox()}
            >
              Game Review
            </Button>
          </Box>
          <Box
            sx={{
              flex: 1,
              p: 2,
            }}
          >
            <Button
              variant="contained"
              sx={{ bgcolor: "green", width: "100%", fontWeight: "bold" }}
              onClick={() => startGame()}
            >
              New Game
            </Button>
          </Box>
        </Box>
      </Fade>
    </>
  );
};

export default ResultBox;
