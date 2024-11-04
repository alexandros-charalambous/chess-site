import { Container, Grid2 } from "@mui/material";
import { ChessProvider } from "./ChessLogic/ChessContext";
import ChessGame from "./ChessBoard/ChessGame";
import ResetButton from "./ResetButton";
import RightPanel from "./RightPanel/RightPanel";
import { StockfishProvider } from "./ChessLogic/StockfishContext";

function App() {
  return (
    <div style={{ height: "100%", width: "100%", position: "fixed" }}>
      <ChessProvider>
        <Grid2 container>
          <Grid2 size={0.5}>
            <Container
              sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "#4d2e22",
                position: "relative",
                zIndex: "1",
              }}
            >
              <ResetButton />
            </Container>
          </Grid2>
          <StockfishProvider>
            <Grid2
              size={11.5}
              sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                height: "100vh",
                backgroundImage: "url(/assets/wood.jpg)",
                backgroundPosition: "center",
                backgroundSize: "cover",
                boxShadow: "inset 0 0 10px 3px rgba(0, 0, 0, 0.6)",
              }}
            >
              <ChessGame />
              <RightPanel />
            </Grid2>
          </StockfishProvider>
        </Grid2>
      </ChessProvider>
    </div>
  );
}

export default App;
