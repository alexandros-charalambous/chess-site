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
        paddingBlock: "10px",
        paddingInline: "20px",
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
