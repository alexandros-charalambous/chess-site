import { Button, Container, Grid2, Stack } from "@mui/material";
import ChessGame from "./ChessGame";
import MoveHistory from "./MoveHistory";

function App() {
  return (
    <div style={{ height: "100%", width: "100%", position: "fixed" }}>
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
            <Button variant="contained" color="secondary">
              Reset
            </Button>
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
              spacing={2}
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
    </div>
  );
}

export default App;
