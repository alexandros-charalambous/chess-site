import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { useChessContext } from "./ChessContext";
import { chessNotations } from "./ChessLogic/chessUtils";
import { MoveHistory, Piece } from "./ChessLogic/types";

const MoveHistoryPanel: React.FC = () => {
  const { moveHistory, FENString } = useChessContext();

  const getPieceNotation = (piece: Piece) => {
    const pieceType = piece?.substring(1);
    switch (pieceType) {
      case "P":
        return "";
      default:
        return pieceType;
    }
  };

  const formatMoveHistoryToAlgebraic = (moveHistory: MoveHistory[]) => {
    return moveHistory.map((historyEntry, index) => {
      const { move, piece, capturedPiece } = historyEntry;
      const pieceNotation = getPieceNotation(piece);
      const fromNotation = chessNotations(move.from[0], move.from[1]);
      const toNotation = chessNotations(move.to[0], move.to[1]);

      let moveString = `${pieceNotation}${
        capturedPiece ? "x" : ""
      }${toNotation}`;

      if (pieceNotation === "K") {
        if (move.from[1] === 4 && move.to[1] === 6) {
          moveString = `O-O`;
        }
        if (move.from[1] === 4 && move.to[1] === 2) {
          moveString = `O-O-O`;
        }
      }

      if (pieceNotation !== "" && capturedPiece) {
        moveString = `${pieceNotation}${fromNotation}x${toNotation}`;
      }

      console.log(moveHistory);

      return (
        <>
          {index === 0 ? `${index}.${moveString}` : ` ${index}.${moveString}`}
        </>
      );
    });
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
          <Typography color="#ffffff">
            {formatMoveHistoryToAlgebraic(moveHistory)}
          </Typography>
        </Box>
      </Stack>
    </>
  );
};

export default MoveHistoryPanel;
