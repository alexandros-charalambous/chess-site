import { Box, Grid2, Hidden, Stack } from "@mui/material";
import React from "react";
import FENBox from "./components/FENBox";
import MoveHistoryBox from "./components/MoveHistoryBox";
import NavigationButton from "./components/NavigationButton";

const RightPanel: React.FC = () => {
  return (
    <>
      <Hidden only={"xs"}>
        <Grid2 container direction={"column"} spacing={1}>
          <Box
            sx={{
              width: { xs: "90vw", md: "350px", lg: "450px", xl: "600px" },
            }}
          >
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
            <Box
              sx={{ boxShadow: "0 3px 4px 0px #000000", bgcolor: "#00000066" }}
            >
              <FENBox />
            </Box>
          </Box>
        </Grid2>
      </Hidden>
    </>
  );
};

export default RightPanel;
