import { Grid2, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import ChessBoard from "./components/ChessBoard";
import ChessTimer from "./components/ChessTimer";
import EvaluationBar from "./components/EvaluationBar";
import FileText from "./components/FileText";
import GameMenuBox from "./components/GameMenuBox";
import RankText from "./components/RankText";
import ResultBox from "./components/ResultBox";
import { theme } from "../App";

export interface ChessBoardProps {
  squareSize: number;
}

const ChessGame: React.FC = () => {
  const [squareSize, setSquareSize] = useState<number>(90);
  // Define media queries for breakpoints
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isLg = useMediaQuery(theme.breakpoints.only("lg"));
  const isXl = useMediaQuery(theme.breakpoints.only("xl"));

  // State to track variable based on screen size
  const [boxWidth, setBoxWidth] = useState("100%");

  useEffect(() => {
    if (isXs) {
      setSquareSize(60);
    } else if (isSm) {
      setSquareSize(60);
    } else if (isMd) {
      setSquareSize(60);
    } else if (isLg) {
      setSquareSize(75);
    } else if (isXl) {
      setSquareSize(90);
    }
  }, [isXs, isSm, isMd, isLg, isXl]);
  return (
    <>
      <GameMenuBox />
      <ResultBox />
      <Grid2
        container
        direction={"row"}
        spacing={2}
        sx={{
          userSelect: "none",
        }}
      >
        <Grid2>
          <EvaluationBar squareSize={squareSize} />
        </Grid2>
        <Grid2>
          <FileText squareSize={squareSize} />
        </Grid2>
        <Grid2>
          <ChessBoard squareSize={squareSize} />
          <RankText squareSize={squareSize} />
        </Grid2>
        <Grid2>
          <ChessTimer squareSize={squareSize} />
        </Grid2>
      </Grid2>
    </>
  );
};

export default ChessGame;
