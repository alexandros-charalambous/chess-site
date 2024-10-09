import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { useChessContext } from "./ChessContext";
import { chessNotations } from "./ChessLogic/chessUtils";
import { MoveHistory, Piece } from "./ChessLogic/types";

const MoveHistoryPanel: React.FC = () => {
  const { moveHistory, FENString, loadHistoryBoard } = useChessContext();

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
          <Typography color="#ffffff">{FENString}</Typography>
        </Box>
        <Box
          sx={{
            width: "20vw",
            height: "60vh",
            padding: 2,
            bgcolor: "#0000002e",
            boxShadow: "0 3px 4px 0px #000000",
          }}
        >
          {moveHistory.map(
            (move, index) =>
              index !== 0 && (
                <Button
                  key={index}
                  variant="text"
                  sx={{ textTransform: "none", borderRadius: "20px" }}
                  onClick={() => loadHistoryBoard(moveHistory[index].board)}
                >
                  <Typography color="#ffffff">
                    {formatMoveHistoryToAlgebraic(move)}
                  </Typography>
                </Button>
              )
          )}
        </Box>
      </Stack>
    </>
  );
};

export default MoveHistoryPanel;
