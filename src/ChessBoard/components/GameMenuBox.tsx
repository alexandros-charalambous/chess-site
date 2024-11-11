import React, { useEffect } from "react";
import { Box, Button, Typography, Modal } from "@mui/material";
import { useChessContext } from "../../ChessLogic/ChessContext";
import { green } from "@mui/material/colors";

const GameMenuBox: React.FC = () => {
  const { isGameActive } = useChessContext();

  return (
    <>
      {!isGameActive && (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "#2d2d2d",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: "center",
            zIndex: 100,
          }}
        >
          <Button variant="contained" sx={{ bgcolor: "green" }}>
            Start
          </Button>
        </Box>
      )}
    </>
  );
};

export default GameMenuBox;
