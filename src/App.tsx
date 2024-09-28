import { Container, Grid2, Stack } from "@mui/material";
import ChessBoard from "./ChessBoard";
import ChessGame from "./ChessGame";

function App() {
  return (
    <div style={{ height: "100%", width: "100%", position: "fixed" }}>
      <ChessGame />
    </div>
  );
}

export default App;
