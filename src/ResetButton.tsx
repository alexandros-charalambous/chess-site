import { Button, Tooltip } from "@mui/material";
import { useChessContext } from "./ChessLogic/ChessContext";
import ReplayIcon from "@mui/icons-material/Replay";

const ResetButton: React.FC = () => {
  const { resetBoard } = useChessContext();

  return (
    <>
      <Tooltip title="Reset">
        <Button
          variant="contained"
          onClick={resetBoard}
          sx={{
            backgroundColor: "#372118",
            width: "64px",
            height: "64px",
            borderRadius: "8px",
          }}
        >
          <ReplayIcon fontSize="large" />
        </Button>
      </Tooltip>
    </>
  );
};

export default ResetButton;
