import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useChessContext } from "../../ChessLogic/ChessContext";

const FENBox: React.FC = () => {
  const { FENString } = useChessContext();

  const handleCopy = () => {
    navigator.clipboard.writeText(FENString);
  };

  return (
    <Box
      sx={{
        width: "25vw",
        height: "15px",
        padding: "20px",
        bgcolor: "#00000066",
        boxShadow: "0 3px 4px 0px #000000",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Typography
        color="#ffffff"
        variant="caption"
        alignItems="center"
        display="flex"
      >
        {FENString}
      </Typography>
      <Box />
      <Tooltip title="Copy">
        <IconButton
          sx={{
            color: "#ffffff",
          }}
          onClick={handleCopy}
        >
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default FENBox;
