import { Box, Grid2, Typography } from "@mui/material";
import { ChessBoardProps } from "../ChessGame";

const FileText: React.FC<ChessBoardProps> = ({ squareSize }) => {
  const fileNumbers: number[] = [8, 7, 6, 5, 4, 3, 2, 1];

  return (
    <>
      {fileNumbers.map((number, fileIndex) => (
        <Box
          key={`${number}`}
          sx={{
            height: squareSize,
            alignContent: "center",
            width: squareSize / 3,
          }}
        >
          <Typography color="#ffffff" fontSize={squareSize / 4}>
            {number}
          </Typography>
        </Box>
      ))}
    </>
  );
};

export default FileText;
