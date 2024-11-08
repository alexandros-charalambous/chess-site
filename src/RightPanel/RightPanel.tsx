import { Box, Grid2, Stack } from "@mui/material";
import React from "react";
import FENBox from "./components/FENBox";
import MoveHistoryBox from "./components/MoveHistoryBox";
import NavigationButton from "./components/NavigationButton";

const RightPanel: React.FC = () => {
  return (
    <>
      <Grid2 container direction={"column"} spacing={1}>
        <Box
          sx={{
            boxShadow: "0 3px 4px 0px #000000",
            bgcolor: "#00000066",
          }}
        >
          <Stack spacing={1}>
            <MoveHistoryBox />
            <NavigationButton />
          </Stack>
        </Box>
        <FENBox />
      </Grid2>
    </>
  );
};

export default RightPanel;
