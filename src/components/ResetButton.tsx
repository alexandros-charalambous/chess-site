import { Button, Tooltip } from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import { useChessContext } from "../ChessLogic/ChessContext";

const ResetButton: React.FC = () => {
  const { resetBoard } = useChessContext();

  return (
    <>
      <Tooltip title="Reset">
        <Button
          variant="contained"
          onClick={resetBoard}
          sx={{
            bgcolor: "#372118",
            minWidth: "44px",
            height: "44px",
            borderRadius: "8px",
          }}
        >
          <ReplayIcon fontSize={"medium"} />
        </Button>
      </Tooltip>
    </>
  );
};

export default ResetButton;
