import { Box, Grid2, Stack } from "@mui/material";
import React from "react";
import FENBox from "./components/FENString";
import MoveHistoryBox from "./components/MoveHistoryBox";
import NavigationButton from "./components/NavigationButton";

const RightPanel: React.FC = () => {
  return (
    <>
      <Stack spacing={1}>
        <Box
          sx={{
            boxShadow: "0 3px 4px 0px #000000",
            bgcolor: "#0000002e",
          }}
        >
          <Stack spacing={1}>
            <MoveHistoryBox />
            <Grid2 direction={"row"}>
              <NavigationButton />
            </Grid2>
          </Stack>
        </Box>
        <FENBox />
      </Stack>
    </>
  );
};

export default RightPanel;
