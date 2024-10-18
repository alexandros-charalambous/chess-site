import { Box, Grid2, Typography } from "@mui/material";
import { ChessBoardProps } from "../ChessGame";

const RankText: React.FC<ChessBoardProps> = ({ squareSize }) => {
  const rankChars: string[] = ["a", "b", "c", "d", "e", "f", "g", "h"];

  return (
    <>
      <Box
        sx={{
          width: squareSize / 3,
        }}
      />
      {rankChars.map((char, rankIndex) => (
        <Box
          key={`${char}`}
          sx={{
            width: squareSize,
            height: squareSize / 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "end",
          }}
        >
          <Typography color="#ffffff" fontSize={squareSize / 4}>
            {char}
          </Typography>
        </Box>
      ))}
    </>
  );
};

export default RankText;
