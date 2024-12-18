import { Box, Button, Fade, Grid2, Typography } from "@mui/material";
import React, { useState } from "react";
import { useChessContext } from "../../ChessLogic/ChessContext";

const GameMenuBox: React.FC = () => {
  const { gameState, startGame, setTime } = useChessContext();
  const [selectedTime, setSelectedTime] = useState<number | null>(300);

  const timeOptions = [
    { label: "30 sec", time: 30 },
    { label: "1 min", time: 60 },
    { label: "3 min", time: 180 },
    { label: "5 min", time: 300 },
    { label: "10 min", time: 600 },
    { label: "30 min", time: 1800 },
  ];
  const handleTimeSelection = (time: number) => {
    setSelectedTime(time);
    setTime(time);
  };

  return (
    <>
      <Fade in={gameState === "initial"}>
        <Box
          sx={{
            position: "fixed",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 3px 4px 0px #000000",
            width: "450px",
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
              p: 2,
            }}
          >
            <Typography variant="h4" color="white" sx={{ fontWeight: "bold" }}>
              Chess Game
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
            <Typography
              variant="h6"
              color="white"
              sx={{ fontWeight: "bold" }}
              gutterBottom
            >
              Select Game Time
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                marginTop: 2,
              }}
            >
              {timeOptions
                .reduce((rows: JSX.Element[][], option, index) => {
                  const rowIndex = Math.floor(index / 3);
                  if (!rows[rowIndex]) rows[rowIndex] = [];
                  rows[rowIndex].push(
                    <Button
                      key={option.time}
                      variant="outlined"
                      onClick={() => handleTimeSelection(option.time)}
                      sx={{
                        flex: 1,
                        color: "white",
                        bgcolor:
                          selectedTime === option.time ? "#00800099" : "",
                        borderColor: "green",
                      }}
                    >
                      {option.label}
                    </Button>
                  );
                  return rows;
                }, [])
                .map((row, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      gap: 2,
                      justifyContent: "center",
                    }}
                  >
                    {row}
                  </Box>
                ))}
            </Box>
          </Box>
          <Box
            sx={{
              flex: 1,
              p: 2,
            }}
          >
            <Button
              variant="contained"
              sx={{
                bgcolor: "#008000",
                boxShadow: "0 5px 0px #004f00",
                "&:hover": {
                  bgcolor: "#009300",
                  boxShadow: "0 5px 0px #004f00",
                },
                width: "100%",
                fontWeight: "bold",
              }}
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

export default GameMenuBox;
