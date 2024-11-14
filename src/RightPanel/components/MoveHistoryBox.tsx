import { Box, Button, Typography } from "@mui/material";
import { useChessContext } from "../../ChessLogic/ChessContext";
import { chessNotations, pieceImages } from "../../ChessLogic/chessUtils";
import { MoveHistory, Piece } from "../../ChessLogic/types";

const MoveHistoryBox: React.FC = () => {
  const { moveHistory, loadHistoryBoard } = useChessContext();
  const totalMoveTime = moveHistory.reduce(
    (acc, move) => acc + move.moveTime,
    0
  );
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

  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const millis = Math.floor((milliseconds % 1000) / 100);

    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, "0")}.${millis}`;
    } else if (seconds > 0) {
      return `${seconds}.${millis}`;
    } else {
      return `0.${millis}`;
    }
  };

  return (
    <>
      <Box
        sx={{
          width: "25vw",
          height: "60vh",
          padding: "20px",
          overflowX: "hidden",
          userSelect: "none",
        }}
      >
        {rows.map((row, rowIndex) => (
          <Box
            key={rowIndex}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: "10px",
              bgcolor: rowIndex % 2 === 0 ? "" : "#00000059",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                color="#ffffff"
                style={{ marginRight: 24, width: "24px" }}
              >
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
                    borderRadius: "5px",
                    marginRight: 3,
                    alignItems: "center",
                    justifyContent: "space-evenly",
                  }}
                  onClick={() => loadHistoryBoard(moveHistory, index + 1)}
                >
                  <Typography color="#ffffff" fontSize={15}>
                    {formatMoveHistoryToAlgebraic(moveHistory)}
                  </Typography>
                </Button>
              ))}
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "50%",
              }}
            >
              {row.map((moveHistory: MoveHistory, index: number) => (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "end",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: "80%",
                      display: "flex",
                      justifyContent: "end",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        height: "6px",
                        width: `${Math.max(
                          (moveHistory.moveTime / totalMoveTime) * 100,
                          3
                        )}%`,
                        bgcolor: index % 2 === 0 ? "#ffffff" : "#2d2d2d",
                        border: "1px solid #ffffff42",
                        borderRadius: "2px",
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      width: "20%",
                      display: "flex",
                      justifyContent: "start",
                    }}
                  >
                    <Typography
                      color="#ffffffb3"
                      sx={{ textAlign: "end", fontSize: "10px" }}
                    >
                      {formatTime(moveHistory.moveTime)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default MoveHistoryBox;
