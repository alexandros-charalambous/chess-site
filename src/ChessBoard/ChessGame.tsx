import { Grid2 } from "@mui/material";
import React, { useState } from "react";
import ChessBoard from "./components/ChessBoard";
import FileText from "./components/FileText";
import RankText from "./components/RankText";
import EvaluationBar from "./components/EvaluationBar";
import ChessTimer from "./components/ChessTimer";

export interface ChessBoardProps {
  squareSize: number;
}

const ChessGame: React.FC = () => {
  const [squareSize, setSquareSize] = useState<number>(90);

  return (
    <Grid2 container direction={"column"}>
      <Grid2 container direction={"row"} spacing={2}>
        <Grid2>
          <EvaluationBar squareSize={squareSize} />
        </Grid2>
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
        <Grid2>
          <ChessTimer squareSize={squareSize} />
        </Grid2>
      </Grid2>

      <Grid2 container direction={"row"} justifyContent={"center"}>
        <RankText squareSize={squareSize} />
      </Grid2>
    </Grid2>
  );
};

export default ChessGame;
