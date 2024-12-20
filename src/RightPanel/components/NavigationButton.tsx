import { Button, Grid2 } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { useEffect, useState } from "react";
import { useChessContext } from "../../ChessLogic/ChessContext";

const NavigationButton: React.FC = () => {
  const { moveHistory, currentMoveIndex, loadHistoryBoard } = useChessContext();

  const goToFirstMove = () => {
    loadHistoryBoard(moveHistory[0], 0);
  };
  const goToPreviousMove = () => {
    if (currentMoveIndex === 0) {
      return;
    } else {
      loadHistoryBoard(moveHistory[currentMoveIndex - 1], currentMoveIndex - 1);
    }
  };
  const goToNextMove = () => {
    if (currentMoveIndex === moveHistory.length - 1) {
      loadHistoryBoard(
        moveHistory[moveHistory.length - 1],
        moveHistory.length - 1
      );
    } else {
      loadHistoryBoard(moveHistory[currentMoveIndex + 1], currentMoveIndex + 1);
    }
  };
  const goToLastMove = () => {
    loadHistoryBoard(
      moveHistory[moveHistory.length - 1],
      moveHistory.length - 1
    );
  };

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

  return (
    <>
      <Grid2
        direction={"row"}
        sx={{ justifyContent: "space-around", display: "flex" }}
      >
        <Button
          sx={{
            color: "#ffffff",
            bgcolor: "#00000066",
            "&:hover": { bgcolor: "#20131066" },
            borderRadius: "10px",
            width: "23%",
            margin: "4px",
          }}
          onClick={goToFirstMove}
        >
          <KeyboardDoubleArrowLeftIcon fontSize="large" />
        </Button>
        <Button
          sx={{
            color: "#ffffff",
            bgcolor: "#00000066",
            "&:hover": { bgcolor: "#20131066" },
            borderRadius: "10px",
            width: "23%",
            margin: "4px",
          }}
          onClick={goToPreviousMove}
        >
          <KeyboardArrowLeftIcon fontSize="large" />
        </Button>
        <Button
          sx={{
            color: "#ffffff",
            bgcolor: "#00000066",
            "&:hover": { bgcolor: "#20131066" },
            borderRadius: "10px",
            width: "23%",
            margin: "4px",
          }}
          onClick={goToNextMove}
        >
          <KeyboardArrowRightIcon fontSize="large" />
        </Button>
        <Button
          sx={{
            color: "#ffffff",
            bgcolor: "#00000066",
            "&:hover": { bgcolor: "#20131066" },
            borderRadius: "10px",
            width: "23%",
            margin: "4px",
          }}
          onClick={goToLastMove}
        >
          <KeyboardDoubleArrowRightIcon fontSize="large" />
        </Button>
      </Grid2>
    </>
  );
};

export default NavigationButton;
