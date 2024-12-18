import { CircularProgress, Grid2 } from "@mui/material";

const LoadingScreen: React.FC = () => {
  return (
    <>
      <Grid2
        sx={{
          position: "fixed",
          width: "100%",
          height: "100%",
          bgcolor: "#2d2d2d",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "1000",
        }}
      >
        <CircularProgress size={50} sx={{ color: "#ffffff" }} />
      </Grid2>
    </>
  );
};

export default LoadingScreen;
