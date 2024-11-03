import { Box, Button, Typography } from "@mui/material";
import { useChessContext } from "../../ChessLogic/ChessContext";
import { chessNotations, pieceImages } from "../../ChessLogic/chessUtils";
import { MoveHistory, Piece } from "../../ChessLogic/types";

const MoveHistoryBox: React.FC = () => {
  const { moveHistory, loadHistoryBoard } = useChessContext();
  const rows: any[] = [];

  for (let i = 1; i < moveHistory.length; i += 2) {
    rows.push(moveHistory.slice(i, i + 2));
  }

  const getPieceNotation = (piece: Piece) => {
    const pieceType = piece?.substring(1, 2);
    switch (pieceType) {
      case "P":
        return "";
      default:
        return pieceType;
    }
  };

  const formatMoveHistoryToAlgebraic = (moveHistory: MoveHistory): string => {
    const { move: moveDetails, piece, capturedPiece } = moveHistory;
    const pieceNotation = getPieceNotation(piece);
    const toNotation = chessNotations(moveDetails.to[0], moveDetails.to[1]);

    let moveString = "";

    moveString = `${capturedPiece ? "x" : ""}${toNotation}`;

    if (pieceNotation === "K") {
      if (moveDetails.from[1] === 4 && moveDetails.to[1] === 6) {
        moveString = `O-O`;
      } else if (moveDetails.from[1] === 4 && moveDetails.to[1] === 2) {
        moveString = `O-O-O`;
      }
    }

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
                startIcon={
                  <img
                    src={
                      moveHistory.piece === null
                        ? ""
                        : pieceImages[moveHistory.piece]
                    }
                    style={{
                      width: "20px",
                      height: "20px",
                    }}
                  />
                }
                key={index}
                variant="text"
                sx={{
                  textTransform: "none",
                  borderRadius: "20px",
                  marginRight: "10px",
                }}
                onClick={() => loadHistoryBoard(moveHistory)}
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
