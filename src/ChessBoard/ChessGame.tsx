import { Grid2 } from "@mui/material";
import React, { useState } from "react";
import ChessBoard from "./components/ChessBoard";
import ChessTimer from "./components/ChessTimer";
import EvaluationBar from "./components/EvaluationBar";
import FileText from "./components/FileText";
import GameMenuBox from "./components/GameMenuBox";
import RankText from "./components/RankText";

export interface ChessBoardProps {
  squareSize: number;
}

const ChessGame: React.FC = () => {
  const [squareSize, setSquareSize] = useState<number>(90);

  // Function to determine the square size based on screen width
  // const updateSquareSize = () => {
  //   const screenWidth = window.innerWidth;
  //   if (screenWidth < 1240) {
  //     setSquareSize(60);
  //   } else if (screenWidth < 1550) {
  //     setSquareSize(80);
  //   } else if (screenWidth < 1900) {
  //     setSquareSize(100);
  //   } else if (screenWidth < 2550) {
  //     setSquareSize(120);
  //   } else {
  //     setSquareSize(150);
  //   }
  // };

  // useEffect(() => {
  //   // Set the initial square size
  //   updateSquareSize();

  //   // Add an event listener to update the square size on window resize
  //   window.addEventListener("resize", updateSquareSize);

  //   // Clean up the event listener on component unmount
  //   return () => {
  //     window.removeEventListener("resize", updateSquareSize);
  //   };
  // }, []);

  return (
    <>
      <GameMenuBox />
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
