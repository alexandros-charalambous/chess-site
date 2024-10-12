import { Box, Button, Grid2, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useChessContext } from "./ChessContext";
import { chessNotations } from "./ChessLogic/chessUtils";
import { MoveHistory, Piece } from "./ChessLogic/types";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";

const MoveHistoryPanel: React.FC = () => {
  const { moveHistory, FENString, loadHistoryBoard } = useChessContext();
  const rows: any[] = [];
  const [currentMoveIndex, setCurrentMoveIndex] = useState(
    moveHistory.length - 1
  );

  for (let i = 1; i < moveHistory.length; i += 2) {
    rows.push(moveHistory.slice(i, i + 2));
  }

  const goToFirstMove = () => {
    loadHistoryBoard(moveHistory[0].board);
    setCurrentMoveIndex(0);
  };
  const goToPreviousMove = () => {
    if (currentMoveIndex === 0) {
      loadHistoryBoard(moveHistory[0].board);
      setCurrentMoveIndex(0);
    } else {
      loadHistoryBoard(moveHistory[currentMoveIndex - 1].board);
      setCurrentMoveIndex(currentMoveIndex - 1);
    }
  };
  const goToNextMove = () => {
    if (currentMoveIndex === moveHistory.length - 1) {
      loadHistoryBoard(moveHistory[moveHistory.length - 1].board);
      setCurrentMoveIndex(moveHistory.length - 1);
    } else {
      loadHistoryBoard(moveHistory[currentMoveIndex + 1].board);
      setCurrentMoveIndex(currentMoveIndex + 1);
    }
  };
  const goToLastMove = () => {
    loadHistoryBoard(moveHistory[moveHistory.length - 1].board);
    setCurrentMoveIndex(moveHistory.length - 1);
  };

  useEffect(() => {
    setCurrentMoveIndex(moveHistory.length - 1);
  }, [moveHistory.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          if (currentMoveIndex > 0) goToPreviousMove();
          break;
        case "ArrowRight":
          if (currentMoveIndex < moveHistory.length - 1) goToNextMove();
          break;
        case "ArrowUp":
          goToFirstMove();
          break;
        case "ArrowDown":
          goToLastMove();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentMoveIndex, moveHistory.length]);

  const getPieceNotation = (piece: Piece) => {
    const pieceType = piece?.substring(1);
    switch (pieceType) {
      case "P":
        return "";
      default:
        return pieceType;
    }
  };
  const formatMoveHistoryToAlgebraic = (move: MoveHistory): string => {
    const { move: moveDetails, piece, capturedPiece } = move;
    const pieceNotation = getPieceNotation(piece);
    const toNotation = chessNotations(moveDetails.to[0], moveDetails.to[1]);

    let moveString = "";

    if (pieceNotation === "K") {
      if (moveDetails.from[1] === 4 && moveDetails.to[1] === 6) {
        moveString = `O-O`;
      } else if (moveDetails.from[1] === 4 && moveDetails.to[1] === 2) {
        moveString = `O-O-O`;
      }
    }

    moveString = `${pieceNotation}${capturedPiece ? "x" : ""}${toNotation}`;

    return moveString;
  };

  return (
    <>
      <Stack spacing={1}>
        <Box
          sx={{
            width: "20vw",
            padding: 2,
            bgcolor: "#0000002e",
            boxShadow: "0 3px 4px 0px #000000",
          }}
        >
          <Typography color="#ffffff" variant="caption">
            {FENString}
          </Typography>
        </Box>
        <Box
          sx={{
            boxShadow: "0 3px 4px 0px #000000",
          }}
        >
          <Box
            sx={{
              width: "20vw",
              height: "60vh",
              padding: 2,
              bgcolor: "#0000002e",
              overflowX: "hidden",
            }}
          >
            {rows.map((row, rowIndex) => (
              <Box
                key={rowIndex}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "10px",
                  whiteSpace: "nowrap",
                  backgroundColor: rowIndex % 2 === 0 ? "" : "#00000021",
                }}
              >
                <Typography color="#ffffff" style={{ marginRight: "10px" }}>
                  {rowIndex + 1}.
                </Typography>

                {row.map((moveHistory: MoveHistory, index: number) => (
                  <Button
                    key={index}
                    variant="text"
                    sx={{
                      textTransform: "none",
                      borderRadius: "20px",
                      marginRight: "10px",
                    }}
                    onClick={() => loadHistoryBoard(moveHistory.board)}
                  >
                    <Typography color="#ffffff">
                      {formatMoveHistoryToAlgebraic(moveHistory)}
                    </Typography>
                  </Button>
                ))}
              </Box>
            ))}
          </Box>
          <Grid2 direction={"row"}>
            <Button
              sx={{
                color: "#ffffff",
                backgroundColor: "#372118",
                borderRadius: "0px",
                width: "25%",
              }}
              onClick={goToFirstMove}
            >
              <KeyboardDoubleArrowLeftIcon fontSize="large" />
            </Button>
            <Button
              sx={{
                color: "#ffffff",
                backgroundColor: "#372118",
                borderRadius: "0px",
                width: "25%",
              }}
              onClick={goToPreviousMove}
            >
              <KeyboardArrowLeftIcon fontSize="large" />
            </Button>
            <Button
              sx={{
                color: "#ffffff",
                backgroundColor: "#372118",
                borderRadius: "0px",
                width: "25%",
              }}
              onClick={goToNextMove}
            >
              <KeyboardArrowRightIcon fontSize="large" />
            </Button>
            <Button
              sx={{
                color: "#ffffff",
                backgroundColor: "#372118",
                borderRadius: "0px",
                width: "25%",
              }}
              onClick={goToLastMove}
            >
              <KeyboardDoubleArrowRightIcon fontSize="large" />
            </Button>
          </Grid2>
        </Box>
      </Stack>
    </>
  );
};

export default MoveHistoryPanel;
