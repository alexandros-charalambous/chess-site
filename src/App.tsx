import { Container, Grid2 } from "@mui/material";
import { ChessProvider } from "./ChessLogic/ChessContext";
import ChessGame from "./ChessBoard/ChessGame";
import RightPanel from "./RightPanel/RightPanel";
import { StockfishProvider } from "./ChessLogic/StockfishContext";
import { useEffect, useState } from "react";
import ResetButton from "./components/ResetButton";
import LoadingScreen from "./components/Loading";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ height: "100%", width: "100%", position: "fixed" }}>
      {isLoading ? (
        <>
          <LoadingScreen />
        </>
      ) : (
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
                  justifyContent: "space-evenly",
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
      )}
      ;
    </div>
  );
}

export default App;
