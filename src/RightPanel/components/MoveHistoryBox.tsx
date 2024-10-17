import { Box, Button, Typography } from "@mui/material";
import { useChessContext } from "../../ChessLogic/ChessContext";
import { chessNotations } from "../../ChessLogic/chessUtils";
import { MoveHistory, Piece } from "../../ChessLogic/types";

const MoveHistoryBox: React.FC = () => {
  const { moveHistory, loadHistoryBoard } = useChessContext();
  const rows: any[] = [];

  for (let i = 1; i < moveHistory.length; i += 2) {
    rows.push(moveHistory.slice(i, i + 2));
  }

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
      <Box
        sx={{
          width: "25vw",
          height: "60vh",
          padding: 2,
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
    </>
  );
};

export default MoveHistoryBox;
