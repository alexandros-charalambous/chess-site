import { Box, Typography } from "@mui/material";
import { ChessBoardProps } from "../ChessGame";

const FileText: React.FC<ChessBoardProps> = ({ squareSize }) => {
  const fileNumbers: number[] = [8, 7, 6, 5, 4, 3, 2, 1];

  return (
    <>
      {fileNumbers.map((number) => (
        <Box
          key={`${number}`}
          sx={{
            height: squareSize,
            width: squareSize / 3,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "end",
            alignContent: "center",
          }}
        >
          <Typography color="#ffffffcc" fontSize={squareSize / 4}>
            {number}
          </Typography>
        </Box>
      ))}
    </>
  );
};

export default FileText;
