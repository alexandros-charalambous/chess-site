import { Box, Grid2, Typography } from "@mui/material";
import { ChessBoardProps } from "../ChessGame";

const RankText: React.FC<ChessBoardProps> = ({ squareSize }) => {
  const rankChars: string[] = ["a", "b", "c", "d", "e", "f", "g", "h"];

  return (
    <>
      {rankChars.map((char) => (
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
          <Typography color="#ffffffcc" fontSize={squareSize / 4}>
            {char}
          </Typography>
        </Box>
      ))}
    </>
  );
};

export default RankText;
