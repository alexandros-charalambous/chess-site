import { Container, Grid2, Stack } from "@mui/material";
import { ChessProvider } from "./ChessContext";
import ChessGame from "./ChessGame";
import MoveHistory from "./MoveHistoryPanel";
import ResetButton from "./ResetButton";

function App() {
  return (
    <div style={{ height: "100%", width: "100%", position: "fixed" }}>
      <ChessProvider>
        <Grid2 container>
          <Grid2 size={3}>
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
          <Grid2 size={6}>
            <Container
              maxWidth="xl"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundImage: "url(/assets/wood.jpg)",
                backgroundPosition: "center",
                backgroundSize: "cover",
                boxShadow: "inset 0 0 10px 3px rgba(0, 0, 0, 0.6)",
                userSelect: "none",
              }}
            >
              <Stack
                sx={{
                  justifyContent: "center",
                  alignItems: "end",
                }}
              >
                <ChessGame />
              </Stack>
            </Container>
          </Grid2>
          <Grid2 size={3}>
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
              <MoveHistory />
            </Container>
          </Grid2>
        </Grid2>
      </ChessProvider>
    </div>
  );
}

export default App;
