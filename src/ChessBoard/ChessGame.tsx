import { Grid2 } from "@mui/material";
import React, { useState } from "react";
import ChessBoard from "./components/ChessBoard";
import FileText from "./components/FileText";
import RankText from "./components/RankText";

export interface ChessBoardProps {
  squareSize: number;
}

const ChessGame: React.FC = () => {
  const [squareSize, setSquareSize] = useState<number>(90);

  return (
    <Grid2 container direction={"column"}>
      <Grid2 container direction={"row"}>
        <Grid2>
          <FileText squareSize={squareSize} />
        </Grid2>
        <Grid2
          sx={{
            justifyContent: "center",
          }}
        >
          <ChessBoard squareSize={squareSize} />
        </Grid2>
      </Grid2>

      <Grid2 container direction={"row"}>
        <RankText squareSize={squareSize} />
      </Grid2>
    </Grid2>
  );
};

export default ChessGame;
