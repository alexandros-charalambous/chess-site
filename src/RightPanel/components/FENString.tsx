import { Box, Typography } from "@mui/material";
import { useChessContext } from "../../ChessLogic/ChessContext";

const FENBox: React.FC = () => {
  const { FENString } = useChessContext();
  return (
    <Box
      sx={{
        width: "20vw",
        padding: 2,
        bgcolor: "#0000002e",
        boxShadow: "0 3px 4px 0px #000000",
      }}
    >
      <Typography color="#ffffff" variant="caption">
        {FENString}
      </Typography>
    </Box>
  );
};

export default FENBox;
